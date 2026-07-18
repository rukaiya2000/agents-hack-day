import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  BriefSectionStatus,
  ExportFormat,
  ExportStatus,
  MossAssetType,
  MossIndexStatus,
  Prisma,
  ProcessingRunStatus,
  ProcessingStageKey,
  ProcessingStageStatus,
  ProtocolStatus,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const UNSILOED_BASE_URL = 'https://prod.visionapi.unsiloed.ai';
const POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 5000;

type RouteContext = {
  params: Promise<{ protocolCode: string }>;
};

type UnsiloedSegment = {
  segment_id?: string;
  segment_type?: string;
  content?: string;
  markdown?: string;
  html?: string;
  bbox?: unknown;
  page_number?: number;
  page_width?: number;
  page_height?: number;
  image?: string;
  ocr?: unknown;
  confidence?: number;
};

type UnsiloedChunk = {
  chunk_id?: string;
  embed?: string;
  segments?: UnsiloedSegment[];
  chunk_length?: number;
};

type UnsiloedParseResult = {
  job_id: string;
  status: string;
  file_name?: string;
  file_type?: string;
  file_url?: string;
  pdf_url?: string;
  page_count?: number;
  total_chunks?: number;
  credit_used?: number;
  message?: string;
  chunks?: UnsiloedChunk[];
  metadata?: unknown;
  configuration?: unknown;
};

type ProtocolProfile = {
  title: string;
  sponsor: string | null;
  phase: string | null;
  indication: string | null;
  intervention: string | null;
  patientPopulation: string | null;
  enrollmentDisplay: string | null;
  geographies: string[];
  relevantSpecialties: string[];
};

type ParseContext = {
  protocolId: string;
  protocolCode: string;
  documentId: string;
  runId: string;
  runKey: string;
  uploadPath: string | null;
};

function jsonError(message: string, status = 400, details?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...details }, { status });
}

function asJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function errorDetails(value: unknown) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

function textMatch(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return match?.[1]?.replace(/\s+/g, ' ').trim() ?? null;
}

function firstHeading(markdown: string) {
  const heading = markdown.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();
  return heading ? heading.slice(0, 260) : null;
}

function cleanFileName(name: string) {
  const baseName = path.basename(name || 'protocol.pdf');
  const cleaned = baseName.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-{2,}/g, '-');

  return cleaned || 'protocol.pdf';
}

function titleFromFileName(name: string) {
  return cleanFileName(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function inferPhase(text: string) {
  const phase = text.match(/\bphase\s+(1\/2|2\/3|1|2|3|4|i\/ii|ii\/iii|i|ii|iii|iv)\b/i)?.[1];
  if (!phase) {
    return null;
  }

  return phase
    .toUpperCase()
    .replace('III', '3')
    .replace('II', '2')
    .replace('IV', '4')
    .replace('I', '1');
}

function inferGeographies(text: string) {
  const geographies = new Set<string>();
  const candidates: Array<[string, RegExp]> = [
    ['US', /\b(United States|USA|U\.S\.)\b/i],
    ['EU', /\b(Europe|European Union|EU)\b/i],
    ['UK', /\b(United Kingdom|UK)\b/i],
    ['CA', /\b(Canada)\b/i],
    ['JP', /\b(Japan)\b/i],
    ['AU', /\b(Australia)\b/i],
    ['Global', /\b(multinational|global|international)\b/i],
  ];

  for (const [label, pattern] of candidates) {
    if (pattern.test(text)) {
      geographies.add(label);
    }
  }

  return [...geographies];
}

function inferSpecialties(text: string) {
  const specialties = new Set<string>();
  const candidates: Array<[string, RegExp]> = [
    [
      'Infectious Disease',
      /\b(infectious disease|infection|vaccine|vaccination|immunogenicity)\b/i,
    ],
    ['Vaccinology', /\b(vaccine|vaccination|immunization|immunogenicity)\b/i],
    ['Immunology', /\b(immune|immunology|antibody|seroconversion)\b/i],
    ['Oncology', /\b(cancer|tumou?r|oncology|carcinoma|neoplasm)\b/i],
    ['Pulmonology', /\b(respiratory|pulmonary|lung)\b/i],
    ['Neurology', /\b(neurology|alzheimer|dementia|cognitive)\b/i],
    ['Rheumatology', /\b(lupus|rheumatology|arthritis)\b/i],
    ['Endocrinology', /\b(obesity|diabetes|metabolic|endocrine)\b/i],
  ];

  for (const [label, pattern] of candidates) {
    if (pattern.test(text)) {
      specialties.add(label);
    }
  }

  return [...specialties];
}

function inferProtocolProfile(
  result: UnsiloedParseResult,
  fallbackFileName: string
): ProtocolProfile {
  const markdown = (result.chunks ?? []).map((chunk) => chunk.embed ?? '').join('\n\n');
  const compact = markdown.replace(/\s+/g, ' ').slice(0, 25000);
  const title = firstHeading(markdown) ?? titleFromFileName(result.file_name ?? fallbackFileName);

  return {
    title,
    sponsor:
      textMatch(compact, /\b(?:sponsor|sponsored by)\s*[:\-]\s*([^.;\n]{2,120})/i) ??
      textMatch(
        compact,
        /\b(?:by|for)\s+([A-Z][A-Za-z0-9&.,' -]{2,80}(?:Inc\.|Ltd\.|LLC|Pharma|Biologics|Therapeutics|Pfizer|BioNTech))/
      ),
    phase: inferPhase(compact),
    indication:
      textMatch(compact, /\b(?:indication|disease|condition)\s*[:\-]\s*([^.;\n]{2,140})/i) ??
      textMatch(compact, /\b(?:patients|participants)\s+with\s+([^.;\n]{2,120})/i),
    intervention:
      textMatch(
        compact,
        /\b(?:intervention|investigational product|study intervention)\s*[:\-]\s*([^.;\n]{2,160})/i
      ) ?? textMatch(compact, /\b(?:evaluate|evaluating|study of)\s+([^.;\n]{2,160})/i),
    patientPopulation:
      textMatch(compact, /\b(?:population|participants|subjects)\s*[:\-]\s*([^.;\n]{2,180})/i) ??
      textMatch(compact, /\b(?:adults|patients|participants)\s+(?:aged|with)[^.;\n]{2,160}/i),
    enrollmentDisplay: textMatch(
      compact,
      /\b(?:enrollment|sample size)\s*[:\-]?\s*(?:approximately|about)?\s*([0-9,]{2,})/i
    ),
    geographies: inferGeographies(compact),
    relevantSpecialties: inferSpecialties(compact),
  };
}

function briefSectionsFromProfile(profile: ProtocolProfile) {
  const sections: Array<{
    sectionKey: string;
    sectionLabel: string;
    value: string | null;
    confidence: number | null;
    status: BriefSectionStatus;
  }> = [
    {
      sectionKey: 'study_title',
      sectionLabel: 'Study title',
      value: profile.title,
      confidence: 0.82,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'sponsor',
      sectionLabel: 'Sponsor',
      value: profile.sponsor,
      confidence: profile.sponsor ? 0.72 : null,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'phase',
      sectionLabel: 'Phase',
      value: profile.phase,
      confidence: profile.phase ? 0.86 : null,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'indication',
      sectionLabel: 'Indication',
      value: profile.indication,
      confidence: profile.indication ? 0.7 : null,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'intervention',
      sectionLabel: 'Intervention',
      value: profile.intervention,
      confidence: profile.intervention ? 0.65 : null,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'patient_population',
      sectionLabel: 'Patient population',
      value: profile.patientPopulation,
      confidence: profile.patientPopulation ? 0.66 : null,
      status: BriefSectionStatus.REVIEW,
    },
    {
      sectionKey: 'relevant_specialties',
      sectionLabel: 'Relevant specialties',
      value: profile.relevantSpecialties.join(' / ') || null,
      confidence: profile.relevantSpecialties.length ? 0.58 : null,
      status: BriefSectionStatus.REVIEW,
    },
  ];

  return sections.filter((section) => section.value);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollUnsiloedParse(jobId: string, apiKey: string) {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const response = await fetch(`${UNSILOED_BASE_URL}/parse/${jobId}`, {
      headers: { 'api-key': apiKey, accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Unsiloed /parse/${jobId} failed with ${response.status}: ${await response.text()}`
      );
    }

    const result = (await response.json()) as UnsiloedParseResult;
    const status = result.status.toLowerCase();

    if (status === 'succeeded' || status === 'success' || status === 'completed') {
      return result;
    }

    if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
      throw new Error(result.message || `Unsiloed parse job ${status}.`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('Unsiloed parse job did not finish within 5 minutes.');
}

function jobIdFromSummary(summaryValue: unknown) {
  const summary = asRecord(summaryValue);
  const unsiloed = asRecord(summary.unsiloed);

  return asString(unsiloed.jobId) ?? asString(unsiloed.job_id);
}

function uploadPathFromSummary(summaryValue: unknown) {
  const summary = asRecord(summaryValue);
  const upload = asRecord(summary.upload);

  return asString(upload.storagePath) ?? asString(upload.localPath);
}

function jobIdFromAuditEvents(events: Array<{ payload: Prisma.JsonValue | null }>) {
  for (const event of events) {
    const payload = asRecord(event.payload);
    const jobId =
      asString(payload.unsiloedJobId) ??
      asString(payload.jobId) ??
      asString(payload.job_id) ??
      asString(asRecord(payload.unsiloed).jobId) ??
      asString(asRecord(payload.unsiloed).job_id);

    if (jobId) {
      return jobId;
    }
  }

  return null;
}

async function markRunPolling(context: ParseContext, jobId: string, source: string) {
  const startedAt = new Date();

  await prisma.$transaction(async (tx) => {
    const existingRun = await tx.processingRun.findUnique({
      where: { id: context.runId },
      select: { summary: true },
    });
    const summary = asRecord(existingRun?.summary);
    const unsiloed = asRecord(summary.unsiloed);
    const upload = asRecord(summary.upload);

    await tx.protocol.update({
      where: { id: context.protocolId },
      data: { status: ProtocolStatus.PARSING },
    });
    await tx.processingRun.update({
      where: { id: context.runId },
      data: {
        status: ProcessingRunStatus.RUNNING,
        stageLabel: 'Refreshing Unsiloed parse',
        completedAt: null,
        errorMessage: null,
        summary: asJson({
          ...summary,
          error: null,
          unsiloed: {
            ...unsiloed,
            jobId,
            status: 'Polling',
            refreshSource: source,
            refreshedAt: startedAt.toISOString(),
          },
          upload: {
            ...upload,
            localPath: context.uploadPath,
          },
        }),
      },
    });
    await tx.processingStage.upsert({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      update: {
        status: ProcessingStageStatus.ACTIVE,
        detail: `Unsiloed job ${jobId}`,
        startedAt,
        completedAt: null,
      },
      create: {
        runId: context.runId,
        key: ProcessingStageKey.PARSED,
        label: 'Parsed',
        status: ProcessingStageStatus.ACTIVE,
        detail: `Unsiloed job ${jobId}`,
        order: 0,
        startedAt,
      },
    });
    await tx.auditEvent.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        action: 'protocol.parse_refresh_started',
        entityType: 'ProcessingRun',
        entityId: context.runId,
        payload: asJson({ unsiloedJobId: jobId, source }),
      },
    });
  });
}

async function markRunFailed(
  context: ParseContext,
  message: string,
  details?: unknown,
  jobId?: string | null
) {
  const failedAt = new Date();

  await prisma.$transaction(async (tx) => {
    const existingRun = await tx.processingRun.findUnique({
      where: { id: context.runId },
      select: { summary: true },
    });
    const summary = asRecord(existingRun?.summary);
    const unsiloed = asRecord(summary.unsiloed);

    await tx.protocol.update({
      where: { id: context.protocolId },
      data: { status: ProtocolStatus.FAILED },
    });
    await tx.processingRun.update({
      where: { id: context.runId },
      data: {
        status: ProcessingRunStatus.FAILED,
        stageLabel: 'Parsing failed',
        completedAt: failedAt,
        errorMessage: message,
        summary: asJson({
          ...summary,
          unsiloed: {
            ...unsiloed,
            ...(jobId ? { jobId } : {}),
            status: 'Failed',
          },
          error: {
            message,
            details: errorDetails(details),
            failedAt: failedAt.toISOString(),
          },
        }),
      },
    });
    await tx.processingStage.upsert({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      update: {
        status: ProcessingStageStatus.ERROR,
        detail: message.slice(0, 240),
        completedAt: failedAt,
      },
      create: {
        runId: context.runId,
        key: ProcessingStageKey.PARSED,
        label: 'Parsed',
        status: ProcessingStageStatus.ERROR,
        detail: message.slice(0, 240),
        order: 0,
        completedAt: failedAt,
      },
    });
    await tx.auditEvent.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        action: 'protocol.parse_refresh_failed',
        entityType: 'ProcessingRun',
        entityId: context.runId,
        payload: asJson({ message, unsiloedJobId: jobId ?? null }),
      },
    });
  });
}

async function upsertStage(
  tx: Prisma.TransactionClient,
  runId: string,
  key: ProcessingStageKey,
  label: string,
  order: number,
  status: ProcessingStageStatus,
  detail: string,
  timestamp: Date
) {
  await tx.processingStage.upsert({
    where: { runId_key: { runId, key } },
    update: {
      status,
      detail,
      ...(status === ProcessingStageStatus.ACTIVE
        ? { startedAt: timestamp, completedAt: null }
        : { completedAt: timestamp }),
    },
    create: {
      runId,
      key,
      label,
      status,
      detail,
      order,
      ...(status === ProcessingStageStatus.ACTIVE
        ? { startedAt: timestamp }
        : { completedAt: timestamp }),
    },
  });
}

async function persistParseResult(context: ParseContext, result: UnsiloedParseResult) {
  const chunks = result.chunks ?? [];
  const outputMarkdown = chunks.map((chunk) => chunk.embed ?? '').join('\n\n');
  const outputDir = path.join(process.cwd(), 'storage', 'protocol-runs', context.runKey);
  const resultJsonPath = path.join(outputDir, 'result.json');
  const outputMarkdownPath = path.join(outputDir, 'output.md');
  const completedAt = new Date();
  const profile = inferProtocolProfile(result, result.file_name ?? 'protocol.pdf');
  const briefSections = briefSectionsFromProfile(profile);

  await mkdir(outputDir, { recursive: true });
  await writeFile(resultJsonPath, `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(outputMarkdownPath, `${outputMarkdown}\n`);

  await prisma.$transaction(async (tx) => {
    if (chunks.length) {
      await tx.protocolChunk.createMany({
        data: chunks.map((chunk, index) => {
          const segments = chunk.segments ?? [];
          const pages = segments
            .map((segment) => segment.page_number)
            .filter((page): page is number => typeof page === 'number');

          return {
            protocolId: context.protocolId,
            documentId: context.documentId,
            chunkIndex: index,
            heading: firstHeading(chunk.embed ?? ''),
            pageStart: pages.length ? Math.min(...pages) : null,
            pageEnd: pages.length ? Math.max(...pages) : null,
            tokenCount: typeof chunk.chunk_length === 'number' ? chunk.chunk_length : null,
            text: chunk.embed ?? '',
            extractionJson: asJson(chunk),
          };
        }),
        skipDuplicates: true,
      });
    }

    for (const section of briefSections) {
      await tx.protocolBriefSection.upsert({
        where: {
          protocolId_sectionKey: {
            protocolId: context.protocolId,
            sectionKey: section.sectionKey,
          },
        },
        update: {
          runId: context.runId,
          sectionLabel: section.sectionLabel,
          value: section.value ?? '',
          confidence: section.confidence,
          status: section.status,
        },
        create: {
          protocolId: context.protocolId,
          runId: context.runId,
          sectionKey: section.sectionKey,
          sectionLabel: section.sectionLabel,
          value: section.value ?? '',
          confidence: section.confidence,
          status: section.status,
        },
      });
    }

    const existingMossAsset = await tx.mossIndexAsset.findFirst({
      where: {
        protocolId: context.protocolId,
        runId: context.runId,
        assetType: MossAssetType.PROTOCOL_CHUNK,
      },
      select: { id: true },
    });

    if (existingMossAsset) {
      await tx.mossIndexAsset.update({
        where: { id: existingMossAsset.id },
        data: {
          label: 'Protocol chunks',
          totalChunks: chunks.length,
          embeddedChunks: 0,
          failedChunks: 0,
          status: MossIndexStatus.QUEUED,
        },
      });
    } else {
      await tx.mossIndexAsset.create({
        data: {
          protocolId: context.protocolId,
          runId: context.runId,
          assetType: MossAssetType.PROTOCOL_CHUNK,
          label: 'Protocol chunks',
          totalChunks: chunks.length,
          embeddedChunks: 0,
          failedChunks: 0,
          status: MossIndexStatus.QUEUED,
        },
      });
    }

    await tx.exportArtifact.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        format: ExportFormat.JSON,
        label: 'Unsiloed result.json',
        description: 'Raw Unsiloed parse response persisted after protocol refresh.',
        storageUrl: resultJsonPath,
        status: ExportStatus.READY,
      },
    });

    await tx.protocolDocument.update({
      where: { id: context.documentId },
      data: {
        parsedAt: completedAt,
        sourceUrl: result.pdf_url ?? result.file_url ?? null,
      },
    });

    await tx.protocol.update({
      where: { id: context.protocolId },
      data: {
        title: profile.title,
        sponsor: profile.sponsor,
        phase: profile.phase,
        indication: profile.indication,
        intervention: profile.intervention,
        patientPopulation: profile.patientPopulation,
        enrollmentDisplay: profile.enrollmentDisplay,
        geographies: profile.geographies,
        relevantSpecialties: profile.relevantSpecialties,
        status: ProtocolStatus.READY_FOR_REVIEW,
        sourceUrl: result.pdf_url ?? result.file_url ?? null,
      },
    });

    await tx.processingStage.upsert({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      update: {
        status: ProcessingStageStatus.DONE,
        detail: `${chunks.length} chunks`,
        completedAt,
        metrics: asJson({
          jobId: result.job_id,
          totalChunks: chunks.length,
          pageCount: result.page_count ?? null,
          creditUsed: result.credit_used ?? null,
        }),
      },
      create: {
        runId: context.runId,
        key: ProcessingStageKey.PARSED,
        label: 'Parsed',
        status: ProcessingStageStatus.DONE,
        detail: `${chunks.length} chunks`,
        order: 0,
        completedAt,
        metrics: asJson({
          jobId: result.job_id,
          totalChunks: chunks.length,
          pageCount: result.page_count ?? null,
          creditUsed: result.credit_used ?? null,
        }),
      },
    });
    await upsertStage(
      tx,
      context.runId,
      ProcessingStageKey.BRIEF,
      'Brief Extracted',
      1,
      briefSections.length ? ProcessingStageStatus.WARN : ProcessingStageStatus.SKIPPED,
      briefSections.length
        ? `${briefSections.length} inferred sections need review`
        : 'No protocol fields inferred',
      completedAt
    );
    await upsertStage(
      tx,
      context.runId,
      ProcessingStageKey.MOSS,
      'Indexed in Moss',
      6,
      ProcessingStageStatus.ACTIVE,
      'Protocol chunks queued',
      completedAt
    );
    await upsertStage(
      tx,
      context.runId,
      ProcessingStageKey.REVIEW,
      'Ready for Review',
      7,
      ProcessingStageStatus.ACTIVE,
      'Parsed protocol ready for review',
      completedAt
    );

    const existingRun = await tx.processingRun.findUnique({
      where: { id: context.runId },
      select: { summary: true },
    });
    const summary = asRecord(existingRun?.summary);
    const upload = asRecord(summary.upload);

    await tx.processingRun.update({
      where: { id: context.runId },
      data: {
        status: ProcessingRunStatus.COMPLETED_WITH_WARNINGS,
        stageLabel: 'Parsed protocol ready for review',
        completedAt,
        errorMessage: null,
        summary: asJson({
          ...summary,
          error: null,
          unsiloed: {
            jobId: result.job_id,
            status: result.status,
            fileName: result.file_name,
            fileType: result.file_type,
            fileUrl: result.file_url,
            pdfUrl: result.pdf_url,
            totalChunks: chunks.length,
            pageCount: result.page_count,
            creditUsed: result.credit_used,
            refreshedAt: completedAt.toISOString(),
          },
          outputs: {
            resultJsonPath,
            outputMarkdownPath,
          },
          upload: {
            ...upload,
            localPath: context.uploadPath,
          },
          inferredProfile: profile,
        }),
      },
    });

    await tx.auditEvent.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        action: 'protocol.parse_refreshed',
        entityType: 'ProcessingRun',
        entityId: context.runId,
        payload: asJson({
          unsiloedJobId: result.job_id,
          totalChunks: chunks.length,
          outputMarkdownPath,
          resultJsonPath,
        }),
      },
    });
  });

  return {
    profile,
    outputMarkdownPath,
    resultJsonPath,
    totalChunks: chunks.length,
    pageCount: result.page_count ?? null,
    unsiloedJobId: result.job_id,
  };
}

export async function POST(request: Request, context: RouteContext) {
  const { protocolCode } = await context.params;
  const decodedProtocolCode = decodeURIComponent(protocolCode);
  const body = (await request.json().catch(() => ({}))) as { jobId?: unknown };
  const requestedJobId = asString(body.jobId);

  const protocol = await prisma.protocol.findFirst({
    where: { protocolCode: decodedProtocolCode },
    include: {
      _count: { select: { chunks: true } },
      documents: {
        orderBy: [{ createdAt: 'desc' }],
        take: 1,
      },
      runs: {
        orderBy: [{ startedAt: 'desc' }, { createdAt: 'desc' }],
        take: 1,
      },
      auditEvents: {
        where: {
          action: {
            in: [
              'protocol.parse_submitted',
              'protocol.parse_refresh_started',
              'protocol.parse_refresh_failed',
            ],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { payload: true },
      },
    },
  });

  if (!protocol) {
    return jsonError(`Protocol ${decodedProtocolCode} was not found.`, 404);
  }

  if (protocol._count.chunks > 0) {
    return NextResponse.json({
      status: 'already_parsed',
      protocol: {
        id: protocol.id,
        protocolCode: protocol.protocolCode,
      },
      message: 'Protocol already has parsed chunks stored.',
    });
  }

  const apiKey = process.env.UNSILOED_API_KEY;

  if (!apiKey) {
    return jsonError('UNSILOED_API_KEY is not configured on the server.', 500);
  }

  const document = protocol.documents[0] ?? null;
  const run = protocol.runs[0] ?? null;

  if (!document) {
    return jsonError(`Protocol ${decodedProtocolCode} has no stored document to refresh.`, 409);
  }

  if (!run) {
    return jsonError(`Protocol ${decodedProtocolCode} has no processing run to refresh.`, 409);
  }

  const uploadPath = document.storageUrl ?? uploadPathFromSummary(run.summary);
  const parseContext: ParseContext = {
    protocolId: protocol.id,
    protocolCode: protocol.protocolCode,
    documentId: document.id,
    runId: run.id,
    runKey: run.runKey,
    uploadPath,
  };
  const storedJobId = jobIdFromSummary(run.summary) ?? jobIdFromAuditEvents(protocol.auditEvents);
  const jobId = requestedJobId ?? storedJobId;
  const source = requestedJobId ? 'provided_job' : storedJobId ? 'stored_job' : 'missing_job';

  if (!jobId) {
    return jsonError(
      'No existing Unsiloed job id is stored for this failed parse. Paste the original Unsiloed job id to pull its parsed result.',
      409,
      {
        requiresJobId: true,
        protocolCode: protocol.protocolCode,
        runKey: run.runKey,
      }
    );
  }

  try {
    await markRunPolling(parseContext, jobId, source);
    const result = await pollUnsiloedParse(jobId, apiKey);
    const persisted = await persistParseResult(parseContext, result);

    return NextResponse.json({
      status: 'parsed',
      protocol: {
        id: protocol.id,
        protocolCode: protocol.protocolCode,
        title: persisted.profile.title,
        sponsor: persisted.profile.sponsor,
        phase: persisted.profile.phase,
        indication: persisted.profile.indication,
      },
      run: {
        id: run.id,
        runKey: run.runKey,
      },
      unsiloed: {
        jobId: persisted.unsiloedJobId,
        source,
        totalChunks: persisted.totalChunks,
        pageCount: persisted.pageCount,
      },
      outputs: {
        resultJsonPath: persisted.resultJsonPath,
        outputMarkdownPath: persisted.outputMarkdownPath,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unsiloed parse refresh failed.';
    await markRunFailed(parseContext, message, error, jobId);

    return jsonError(message, 502, {
      protocolCode: protocol.protocolCode,
      runKey: run.runKey,
      unsiloedJobId: jobId,
    });
  }
}
