import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';
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
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 5000;

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

type CreatedRunContext = {
  protocolId: string;
  protocolCode: string;
  documentId: string;
  runId: string;
  runKey: string;
  uploadPath: string;
};

function jsonError(message: string, status = 400, details?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...details }, { status });
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

function protocolCodeFromFile(name: string, checksum: string) {
  const stem = cleanFileName(name)
    .replace(/\.[^.]+$/, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28);

  return `${stem || 'PROTOCOL'}-${checksum.slice(0, 6).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
}

function isPdf(file: File, buffer: Buffer) {
  const nameLooksPdf = file.name.toLowerCase().endsWith('.pdf');
  const mimeLooksPdf = file.type === 'application/pdf' || file.type === 'application/octet-stream';
  const headerLooksPdf = buffer.subarray(0, 4).toString('utf8') === '%PDF';

  return nameLooksPdf && mimeLooksPdf && headerLooksPdf;
}

function asJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
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

async function submitToUnsiloed(
  fileName: string,
  fileType: string,
  buffer: Buffer,
  apiKey: string
) {
  const form = new FormData();
  const fileBytes = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  form.append('file', new Blob([fileBytes], { type: fileType || 'application/pdf' }), fileName);

  const response = await fetch(`${UNSILOED_BASE_URL}/parse`, {
    method: 'POST',
    headers: { 'api-key': apiKey },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Unsiloed /parse failed with ${response.status}: ${await response.text()}`);
  }

  const body = (await response.json()) as { job_id?: string; status?: string };
  if (!body.job_id) {
    throw new Error('Unsiloed /parse did not return a job_id.');
  }

  return body.job_id;
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

    if (result.status === 'Succeeded') {
      return result;
    }

    if (result.status === 'Failed' || result.status === 'Cancelled') {
      throw new Error(result.message || `Unsiloed parse job ${result.status.toLowerCase()}.`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('Unsiloed parse job did not finish within 5 minutes.');
}

function stageRows(runId: string) {
  const rows: Array<{
    runId: string;
    key: ProcessingStageKey;
    label: string;
    status: ProcessingStageStatus;
    detail: string;
    order: number;
    startedAt?: Date;
  }> = [
    {
      runId,
      key: ProcessingStageKey.PARSED,
      label: 'Parsed',
      status: ProcessingStageStatus.ACTIVE,
      detail: 'Submitting to Unsiloed',
      order: 0,
      startedAt: new Date(),
    },
    {
      runId,
      key: ProcessingStageKey.BRIEF,
      label: 'Brief Extracted',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending parse output',
      order: 1,
    },
    {
      runId,
      key: ProcessingStageKey.QUERIES,
      label: 'Queries Generated',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending',
      order: 2,
    },
    {
      runId,
      key: ProcessingStageKey.EVIDENCE,
      label: 'Evidence Retrieved',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending',
      order: 3,
    },
    {
      runId,
      key: ProcessingStageKey.KOLS,
      label: 'KOLs Extracted',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending',
      order: 4,
    },
    {
      runId,
      key: ProcessingStageKey.RANKED,
      label: 'Ranked',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending',
      order: 5,
    },
    {
      runId,
      key: ProcessingStageKey.MOSS,
      label: 'Indexed in Moss',
      status: ProcessingStageStatus.PENDING,
      detail: 'Queued',
      order: 6,
    },
    {
      runId,
      key: ProcessingStageKey.REVIEW,
      label: 'Ready for Review',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending',
      order: 7,
    },
  ];

  return rows;
}

async function createRunContext(
  file: File,
  buffer: Buffer,
  checksum: string
): Promise<CreatedRunContext> {
  const organization = await prisma.organization.upsert({
    where: { slug: 'veritan-biologics' },
    update: {},
    create: {
      name: 'Veritan Biologics',
      slug: 'veritan-biologics',
    },
  });
  const protocolCode = protocolCodeFromFile(file.name, checksum);
  const runKey = `run_${randomBytes(4).toString('hex')}`;
  const safeFileName = cleanFileName(file.name);
  const uploadDir = path.join(process.cwd(), 'storage', 'protocol-uploads', runKey);
  const uploadPath = path.join(uploadDir, safeFileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, buffer);

  const created = await prisma.$transaction(async (tx) => {
    const protocol = await tx.protocol.create({
      data: {
        organizationId: organization.id,
        protocolCode,
        title: titleFromFileName(file.name),
        status: ProtocolStatus.PARSING,
      },
      select: { id: true },
    });
    const document = await tx.protocolDocument.create({
      data: {
        protocolId: protocol.id,
        fileName: safeFileName,
        fileSizeBytes: BigInt(file.size),
        mimeType: file.type || 'application/pdf',
        storageUrl: uploadPath,
        checksum,
      },
      select: { id: true },
    });
    const run = await tx.processingRun.create({
      data: {
        runKey,
        protocolId: protocol.id,
        status: ProcessingRunStatus.RUNNING,
        stageLabel: 'Parsing protocol with Unsiloed',
        summary: asJson({
          upload: {
            fileName: safeFileName,
            sizeBytes: file.size,
            sha256: checksum,
            storagePath: uploadPath,
          },
        }),
      },
      select: { id: true },
    });

    await tx.processingStage.createMany({ data: stageRows(run.id) });
    await tx.auditEvent.create({
      data: {
        organizationId: organization.id,
        protocolId: protocol.id,
        runId: run.id,
        action: 'protocol.uploaded',
        entityType: 'ProtocolDocument',
        entityId: document.id,
        payload: asJson({ fileName: safeFileName, sizeBytes: file.size, sha256: checksum }),
      },
    });

    return { protocolId: protocol.id, documentId: document.id, runId: run.id };
  });

  return {
    ...created,
    protocolCode,
    runKey,
    uploadPath,
  };
}

async function markRunFailed(context: CreatedRunContext, message: string, details?: unknown) {
  await prisma.$transaction(async (tx) => {
    const existingRun = await tx.processingRun.findUnique({
      where: { id: context.runId },
      select: { summary: true },
    });
    const summary = asRecord(existingRun?.summary);

    await tx.protocol.update({
      where: { id: context.protocolId },
      data: { status: ProtocolStatus.FAILED },
    });
    await tx.processingRun.update({
      where: { id: context.runId },
      data: {
        status: ProcessingRunStatus.FAILED,
        stageLabel: 'Parsing failed',
        completedAt: new Date(),
        errorMessage: message,
        summary: asJson({
          ...summary,
          error: {
            message,
            details: errorDetails(details),
            failedAt: new Date().toISOString(),
          },
        }),
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      data: {
        status: ProcessingStageStatus.ERROR,
        detail: message.slice(0, 240),
        completedAt: new Date(),
      },
    });
    await tx.auditEvent.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        action: 'protocol.parse_failed',
        entityType: 'ProcessingRun',
        entityId: context.runId,
        payload: asJson({ message, details }),
      },
    });
  });
}

async function persistParseResult(context: CreatedRunContext, result: UnsiloedParseResult) {
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
      });
    }

    if (briefSections.length) {
      await tx.protocolBriefSection.createMany({
        data: briefSections.map((section) => ({
          protocolId: context.protocolId,
          runId: context.runId,
          sectionKey: section.sectionKey,
          sectionLabel: section.sectionLabel,
          value: section.value ?? '',
          confidence: section.confidence,
          status: section.status,
        })),
      });
    }

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

    await tx.exportArtifact.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        format: ExportFormat.JSON,
        label: 'Unsiloed result.json',
        description: 'Raw Unsiloed parse response persisted after protocol upload.',
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

    await tx.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      data: {
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
    });
    await tx.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.BRIEF } },
      data: {
        status: briefSections.length ? ProcessingStageStatus.WARN : ProcessingStageStatus.SKIPPED,
        detail: briefSections.length
          ? `${briefSections.length} inferred sections need review`
          : 'No protocol fields inferred',
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.MOSS } },
      data: {
        status: ProcessingStageStatus.ACTIVE,
        detail: 'Protocol chunks queued',
        startedAt: completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.REVIEW } },
      data: {
        status: ProcessingStageStatus.ACTIVE,
        detail: 'Parsed protocol ready for review',
        startedAt: completedAt,
      },
    });

    await tx.processingRun.update({
      where: { id: context.runId },
      data: {
        status: ProcessingRunStatus.COMPLETED_WITH_WARNINGS,
        stageLabel: 'Parsed protocol ready for review',
        completedAt,
        summary: asJson({
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
          },
          outputs: {
            resultJsonPath,
            outputMarkdownPath,
          },
          upload: {
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
        action: 'protocol.parsed',
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

export async function POST(request: Request) {
  const apiKey = process.env.UNSILOED_API_KEY;

  if (!apiKey) {
    return jsonError('UNSILOED_API_KEY is not configured on the server.', 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError('Upload must be multipart/form-data with a file field.');
  }

  const uploaded = formData.get('file');

  if (!(uploaded instanceof File)) {
    return jsonError('Missing PDF upload. Include the document in the "file" field.');
  }

  if (uploaded.size <= 0) {
    return jsonError('The uploaded PDF is empty.');
  }

  if (uploaded.size > MAX_UPLOAD_BYTES) {
    return jsonError('The uploaded PDF exceeds the 100 MB Unsiloed limit.');
  }

  const buffer = Buffer.from(await uploaded.arrayBuffer());

  if (!isPdf(uploaded, buffer)) {
    return jsonError('Only PDF protocol uploads are supported for this workflow.');
  }

  const safeFileName = cleanFileName(uploaded.name);
  const checksum = createHash('sha256').update(buffer).digest('hex');
  const context = await createRunContext(uploaded, buffer, checksum);

  try {
    const jobId = await submitToUnsiloed(
      safeFileName,
      uploaded.type || 'application/pdf',
      buffer,
      apiKey
    );
    await prisma.processingRun.update({
      where: { id: context.runId },
      data: {
        summary: asJson({
          upload: {
            fileName: safeFileName,
            sizeBytes: uploaded.size,
            sha256: checksum,
            storagePath: context.uploadPath,
          },
          unsiloed: {
            jobId,
            status: 'Starting',
          },
        }),
      },
    });
    await prisma.processingStage.update({
      where: { runId_key: { runId: context.runId, key: ProcessingStageKey.PARSED } },
      data: { detail: `Unsiloed job ${jobId}` },
    });
    await prisma.auditEvent.create({
      data: {
        protocolId: context.protocolId,
        runId: context.runId,
        action: 'protocol.parse_submitted',
        entityType: 'ProcessingRun',
        entityId: context.runId,
        payload: asJson({
          unsiloedJobId: jobId,
          fileName: safeFileName,
          storagePath: context.uploadPath,
        }),
      },
    });

    const result = await pollUnsiloedParse(jobId, apiKey);
    const persisted = await persistParseResult(context, result);

    return NextResponse.json({
      protocol: {
        id: context.protocolId,
        protocolCode: context.protocolCode,
        title: persisted.profile.title,
        sponsor: persisted.profile.sponsor,
        phase: persisted.profile.phase,
        indication: persisted.profile.indication,
      },
      run: {
        id: context.runId,
        runKey: context.runKey,
      },
      unsiloed: {
        jobId: persisted.unsiloedJobId,
        totalChunks: persisted.totalChunks,
        pageCount: persisted.pageCount,
      },
      outputs: {
        resultJsonPath: persisted.resultJsonPath,
        outputMarkdownPath: persisted.outputMarkdownPath,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Protocol parsing failed.';
    await markRunFailed(context, message, error);

    return jsonError(message, 502, {
      protocolCode: context.protocolCode,
      runKey: context.runKey,
    });
  }
}
