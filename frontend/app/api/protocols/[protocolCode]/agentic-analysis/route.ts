import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  BriefSectionStatus,
  BriefStatus,
  CandidateStatus,
  CitationUsage,
  ComplianceFlagStatus,
  ComplianceRuleResult,
  ComplianceSeverity,
  EvidenceSourceType,
  EvidenceStrength,
  ExpertStatus,
  ExportFormat,
  ExportStatus,
  MossAssetType,
  MossIndexStatus,
  Prisma,
  ProcessingRunStatus,
  ProcessingStageKey,
  ProcessingStageStatus,
  ProtocolStatus,
  QueryGroupStatus,
  RankingRunStatus,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type RouteContext = {
  params: Promise<{ protocolCode: string }>;
};

type AgenticCitation = {
  title: string;
  source: string;
  url: string;
  evidence_type: string;
  snippet: string;
};

type AgenticKol = {
  name: string;
  institution: string;
  specialty: string;
  geography: string;
  score: number;
  score_breakdown: Record<string, number>;
  rationale: string;
  suggested_next_action: string;
  citations: AgenticCitation[];
  compliance_flags?: string[];
};

type AgenticAnalysis = {
  answer: string;
  analysis_source?: string;
  is_fallback?: boolean;
  fallback_reason?: string | null;
  protocol: {
    protocol_id: string;
    title: string;
    indication: string;
    intervention: string;
    phase: string;
    population: string;
    geography: string[];
    endpoints: string[];
    inclusion_criteria: string[];
    exclusion_criteria: string[];
    relevant_specialties: string[];
  };
  search_query_groups: Array<{
    name: string;
    source_targets: string[];
    queries: string[];
    result_count: number | null;
    status: string;
  }>;
  evidence: Array<{
    title: string;
    source: string;
    url: string;
    evidence_type: string;
    snippet: string;
    score: number;
    strength: string;
    linked_kols: string[];
    published_at?: string | null;
  }>;
  top_kols: AgenticKol[];
  compliance_notes: Array<{ severity: string; message: string }>;
  msl_brief: {
    expert_name: string;
    scientific_background: string;
    relevance_rationale: string;
    suggested_questions: string[];
    compliance_warnings: string[];
    citations: AgenticCitation[];
  } | null;
  audit_trail: string[];
};

type MossIndexAssetReport = {
  asset_type: string;
  label: string;
  index_name: string;
  document_ids: string[];
  doc_count: number;
};

type MossIndexingReport = {
  ok: boolean;
  model_id?: string;
  indexes?: Record<
    string,
    {
      index_name: string;
      operation: string;
      doc_count: number;
      job_id?: string | null;
      load_error?: string | null;
    }
  >;
  assets: MossIndexAssetReport[];
  document_count: number;
};

function jsonError(message: string, status = 400, details?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...details }, { status });
}

function allowFallbackAnalysis() {
  return process.env.KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS === '1';
}

function analysisSource(analysis: AgenticAnalysis) {
  return analysis.analysis_source ?? 'openai_agents_sdk';
}

function isFallbackAnalysis(analysis: AgenticAnalysis) {
  return (
    analysis.is_fallback === true ||
    analysisSource(analysis).toLowerCase().includes('fallback') ||
    analysis.audit_trail.some((entry) => /fallback|seed dataset|deterministic/i.test(entry))
  );
}

function truncateText(value: string, limit: number) {
  return value.length <= limit ? value : `${value.slice(0, limit).trimEnd()}...`;
}

function asJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function hashKey(value: string) {
  return createHash('sha1').update(value).digest('hex').slice(0, 20);
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return slug || `expert-${randomBytes(3).toString('hex')}`;
}

function protocolStageRows(runId: string, chunkCount: number, briefCount: number) {
  const now = new Date();
  return [
    {
      runId,
      key: ProcessingStageKey.PARSED,
      label: 'Parsed',
      status: chunkCount ? ProcessingStageStatus.DONE : ProcessingStageStatus.WARN,
      detail: chunkCount ? `${chunkCount} chunks` : 'No protocol chunks found',
      order: 0,
      completedAt: now,
    },
    {
      runId,
      key: ProcessingStageKey.BRIEF,
      label: 'Brief Extracted',
      status: briefCount ? ProcessingStageStatus.DONE : ProcessingStageStatus.ACTIVE,
      detail: briefCount ? `${briefCount} sections` : 'Agent deriving protocol brief',
      order: 1,
      startedAt: now,
      completedAt: briefCount ? now : null,
    },
    {
      runId,
      key: ProcessingStageKey.QUERIES,
      label: 'Queries Generated',
      status: ProcessingStageStatus.ACTIVE,
      detail: 'Agent generating exhaustive search plan',
      order: 2,
      startedAt: now,
    },
    {
      runId,
      key: ProcessingStageKey.EVIDENCE,
      label: 'Evidence Retrieved',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending web research',
      order: 3,
    },
    {
      runId,
      key: ProcessingStageKey.KOLS,
      label: 'KOLs Extracted',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending evidence synthesis',
      order: 4,
    },
    {
      runId,
      key: ProcessingStageKey.RANKED,
      label: 'Ranked',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending scoring',
      order: 5,
    },
    {
      runId,
      key: ProcessingStageKey.MOSS,
      label: 'Indexed in Moss',
      status: ProcessingStageStatus.PENDING,
      detail: 'Pending structured asset write',
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
}

function evidenceSourceType(value: string): EvidenceSourceType {
  const lower = value.toLowerCase();
  if (lower.includes('publication') || lower.includes('pubmed') || lower.includes('journal')) {
    return EvidenceSourceType.PUBLICATION;
  }
  if (lower.includes('trial') || lower.includes('clinicaltrials')) {
    return EvidenceSourceType.TRIAL_REGISTRY;
  }
  if (lower.includes('guideline')) {
    return EvidenceSourceType.GUIDELINE;
  }
  if (lower.includes('congress') || lower.includes('speaker') || lower.includes('conference')) {
    return EvidenceSourceType.CONGRESS;
  }
  if (lower.includes('payment') || lower.includes('transparency')) {
    return EvidenceSourceType.TRANSPARENCY_RECORD;
  }
  if (lower.includes('institution') || lower.includes('bio')) {
    return EvidenceSourceType.INSTITUTION_PROFILE;
  }
  return EvidenceSourceType.OTHER;
}

function evidenceStrength(value: string | undefined, score: number): EvidenceStrength {
  const lower = value?.toLowerCase();
  if (lower === 'strong' || score >= 85) {
    return EvidenceStrength.STRONG;
  }
  if (lower === 'weak' || score < 65) {
    return EvidenceStrength.WEAK;
  }
  return EvidenceStrength.MODERATE;
}

const SCORE_COMPONENT_MAX: Record<string, number> = {
  protocol_match: 30,
  trial_experience: 25,
  publication_relevance: 20,
  institution_site_relevance: 10,
  congress_guideline_influence: 10,
  recency: 5,
};

function normalizePercentScore(value: number | null | undefined) {
  const score = Number(value ?? 0);
  if (!Number.isFinite(score)) {
    return 0;
  }
  return score > 0 && score <= 1 ? score * 100 : score;
}

function normalizeComponentScore(dimensionKey: string, value: number | null | undefined) {
  const score = Number(value ?? 0);
  if (!Number.isFinite(score)) {
    return 0;
  }
  const max = SCORE_COMPONENT_MAX[dimensionKey] ?? 100;
  return score > 0 && score <= 1 ? score * max : score;
}

function candidateStatus(candidate: AgenticKol): CandidateStatus {
  return candidate.compliance_flags?.length ? CandidateStatus.REVIEW : CandidateStatus.VALIDATED;
}

function complianceSeverity(value: string): ComplianceSeverity {
  const lower = value.toLowerCase();
  if (lower.includes('critical') || lower.includes('block')) {
    return ComplianceSeverity.CRITICAL;
  }
  if (lower.includes('high')) {
    return ComplianceSeverity.HIGH;
  }
  if (lower.includes('warning') || lower.includes('medium')) {
    return ComplianceSeverity.MEDIUM;
  }
  return ComplianceSeverity.LOW;
}

function dateOrNull(value?: string | null) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function mossAssetType(value: string): MossAssetType {
  return Object.values(MossAssetType).includes(value as MossAssetType)
    ? (value as MossAssetType)
    : MossAssetType.EVIDENCE_CHUNK;
}

function fallbackMossAssetReports(analysis: AgenticAnalysis): MossIndexAssetReport[] {
  const protocolDocCount =
    1 +
    analysis.search_query_groups.length +
    (analysis.compliance_notes.length ? 1 : 0) +
    (analysis.audit_trail.length ? 1 : 0);
  const evidenceDocCount = analysis.evidence.reduce(
    (sum, item) => sum + Math.max(item.linked_kols.length, 1),
    0
  );
  const citationDocCount =
    analysis.top_kols.reduce((sum, candidate) => sum + candidate.citations.length, 0) +
    (analysis.msl_brief?.citations.length ?? 0);

  return [
    {
      asset_type: MossAssetType.PROTOCOL_CHUNK,
      label: 'Protocol summary, search plan, compliance, and audit',
      index_name: process.env.MOSS_PROTOCOL_INDEX_NAME ?? 'protocols',
      document_ids: [],
      doc_count: protocolDocCount,
    },
    {
      asset_type: MossAssetType.EVIDENCE_CHUNK,
      label: 'Evidence chunks',
      index_name: process.env.MOSS_EXPERT_INDEX_NAME ?? 'kol_experts',
      document_ids: [],
      doc_count: evidenceDocCount,
    },
    {
      asset_type: MossAssetType.EXPERT_PROFILE,
      label: 'KOL profiles',
      index_name: process.env.MOSS_EXPERT_INDEX_NAME ?? 'kol_experts',
      document_ids: [],
      doc_count: analysis.top_kols.length,
    },
    {
      asset_type: MossAssetType.RANKING_METADATA,
      label: 'Ranking metadata',
      index_name: process.env.MOSS_EXPERT_INDEX_NAME ?? 'kol_experts',
      document_ids: [],
      doc_count: analysis.top_kols.length,
    },
    {
      asset_type: MossAssetType.SOURCE_CITATION,
      label: 'Source citations',
      index_name: process.env.MOSS_EXPERT_INDEX_NAME ?? 'kol_experts',
      document_ids: [],
      doc_count: citationDocCount,
    },
    {
      asset_type: MossAssetType.BRIEF,
      label: 'MSL brief',
      index_name: process.env.MOSS_EXPERT_INDEX_NAME ?? 'kol_experts',
      document_ids: [],
      doc_count: analysis.msl_brief ? 1 : 0,
    },
  ];
}

async function createAnalysisRun(protocolId: string, chunkCount: number, briefCount: number) {
  const runKey = `run_agentic_${randomBytes(4).toString('hex')}`;
  return await prisma.$transaction(async (tx) => {
    const run = await tx.processingRun.create({
      data: {
        runKey,
        protocolId,
        status: ProcessingRunStatus.RUNNING,
        stageLabel: 'Running OpenAI agentic KOL analysis',
        summary: asJson({
          workflow: 'agentic-analysis',
          launchedAt: new Date().toISOString(),
        }),
      },
      select: { id: true, runKey: true },
    });

    await tx.processingStage.createMany({
      data: protocolStageRows(run.id, chunkCount, briefCount),
    });
    await tx.protocol.update({
      where: { id: protocolId },
      data: { status: ProtocolStatus.RETRIEVING_EVIDENCE },
    });
    await tx.auditEvent.create({
      data: {
        protocolId,
        runId: run.id,
        action: 'agentic_analysis.started',
        entityType: 'ProcessingRun',
        entityId: run.id,
        payload: asJson({ runKey }),
      },
    });

    return run;
  });
}

function phaseLabel(phase: string | null) {
  if (!phase) {
    return 'Phase not specified';
  }
  return phase.toLowerCase().startsWith('phase') ? phase : `Phase ${phase}`;
}

function protocolProfile(protocol: NonNullable<Awaited<ReturnType<typeof loadProtocol>>>) {
  const endpointSections = protocol.briefSections
    .filter((section) => /endpoint/i.test(`${section.sectionKey} ${section.sectionLabel}`))
    .map((section) => section.value)
    .filter(Boolean);

  return {
    protocol_id: protocol.protocolCode,
    title: protocol.title,
    indication: protocol.indication ?? 'Indication not specified',
    intervention: protocol.intervention ?? 'Intervention not specified',
    phase: phaseLabel(protocol.phase),
    population: protocol.patientPopulation ?? 'Patient population not specified',
    geography: protocol.geographies.length ? protocol.geographies : ['Not specified'],
    endpoints: endpointSections.length ? endpointSections : ['Protocol-defined endpoints'],
    inclusion_criteria: [],
    exclusion_criteria: [],
    relevant_specialties: protocol.relevantSpecialties.length
      ? protocol.relevantSpecialties
      : ['Medical Affairs', 'Clinical trial investigators'],
  };
}

async function loadProtocol(protocolCode: string) {
  return await prisma.protocol.findFirst({
    where: { protocolCode },
    include: {
      chunks: {
        orderBy: { chunkIndex: 'asc' },
        take: 24,
      },
      briefSections: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

function pythonExecutable(agentDir: string) {
  const configured = process.env.KOL_COPILOT_PYTHON;
  if (configured) {
    return configured;
  }

  const local = path.join(agentDir, '.venv', 'bin', 'python');
  return existsSync(local) ? local : 'python';
}

async function runPythonAgent(payload: Record<string, unknown>): Promise<AgenticAnalysis> {
  const agentDir = path.resolve(process.cwd(), '..', 'agent-py');
  const agentSrc = path.join(agentDir, 'src');
  const python = pythonExecutable(agentDir);
  const timeoutMs = Number(process.env.KOL_COPILOT_AGENT_TIMEOUT_MS ?? 290000);

  return await new Promise((resolve, reject) => {
    const child = spawn(python, ['-m', 'kol_copilot.analysis'], {
      cwd: agentDir,
      env: {
        ...process.env,
        PYTHONPATH: process.env.PYTHONPATH
          ? `${agentSrc}${path.delimiter}${process.env.PYTHONPATH}`
          : agentSrc,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('OpenAI agentic analysis timed out.'));
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr || `Python agent exited with status ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout) as AgenticAnalysis);
      } catch (error) {
        reject(
          new Error(
            `Python agent returned invalid JSON: ${
              error instanceof Error ? error.message : 'parse failed'
            }\n${stderr}`
          )
        );
      }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

async function runMossIndexer(payload: Record<string, unknown>): Promise<MossIndexingReport> {
  const agentDir = path.resolve(process.cwd(), '..', 'agent-py');
  const agentSrc = path.join(agentDir, 'src');
  const python = pythonExecutable(agentDir);
  const timeoutMs = Number(process.env.KOL_COPILOT_MOSS_TIMEOUT_MS ?? 120000);

  return await new Promise((resolve, reject) => {
    const child = spawn(python, ['-m', 'kol_copilot.moss_indexer'], {
      cwd: agentDir,
      env: {
        ...process.env,
        PYTHONPATH: process.env.PYTHONPATH
          ? `${agentSrc}${path.delimiter}${process.env.PYTHONPATH}`
          : agentSrc,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('Moss indexing timed out.'));
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr || `Moss indexer exited with status ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout) as MossIndexingReport);
      } catch (error) {
        reject(
          new Error(
            `Moss indexer returned invalid JSON: ${
              error instanceof Error ? error.message : 'parse failed'
            }\n${stderr}`
          )
        );
      }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

async function persistAgenticAnalysis({
  protocolId,
  protocolCode,
  runId,
  runKey,
  analysis,
}: {
  protocolId: string;
  protocolCode: string;
  runId: string;
  runKey: string;
  analysis: AgenticAnalysis;
}) {
  const completedAt = new Date();
  const model = await prisma.rankingModel.upsert({
    where: { name_version: { name: 'KOL Copilot MVP', version: 'agentic-v1' } },
    update: { isDefault: true },
    create: {
      name: 'KOL Copilot MVP',
      version: 'agentic-v1',
      description:
        'Protocol-aware Medical Affairs KOL ranking: protocol match, trials, publications, site relevance, influence, recency, and compliance adjustment.',
      isDefault: true,
      dimensions: {
        create: [
          { key: 'protocol_match', label: 'Protocol match', weight: 0.3, order: 0 },
          {
            key: 'trial_experience',
            label: 'Trial investigator experience',
            weight: 0.25,
            order: 1,
          },
          { key: 'publication_relevance', label: 'Publication relevance', weight: 0.2, order: 2 },
          {
            key: 'institution_site_relevance',
            label: 'Institution / site relevance',
            weight: 0.1,
            order: 3,
          },
          {
            key: 'congress_guideline_influence',
            label: 'Congress / guideline influence',
            weight: 0.1,
            order: 4,
          },
          { key: 'recency', label: 'Recency', weight: 0.05, order: 5 },
        ],
      },
    },
    select: { id: true },
  });

  const outputDir = path.join(process.cwd(), 'storage', 'protocol-runs', runKey);
  const snapshotDir = path.join(process.cwd(), 'storage', 'agentic-analysis');
  const resultJsonPath = path.join(outputDir, 'agentic-analysis.json');
  const snapshotPath = path.join(snapshotDir, `${protocolCode}.json`);

  await mkdir(outputDir, { recursive: true });
  await mkdir(snapshotDir, { recursive: true });
  await writeFile(resultJsonPath, `${JSON.stringify(analysis, null, 2)}\n`);
  await writeFile(snapshotPath, `${JSON.stringify(analysis, null, 2)}\n`);

  let mossIndexing: MossIndexingReport | null = null;
  let mossIndexingError: string | null = null;
  try {
    mossIndexing = await runMossIndexer({
      protocol_id: protocolCode,
      run_id: runId,
      run_key: runKey,
      analysis,
    });
  } catch (error) {
    mossIndexingError = truncateText(
      error instanceof Error ? error.message : 'Moss indexing failed.',
      1400
    );
  }
  const mossAssetReports = mossIndexing?.assets?.length
    ? mossIndexing.assets
    : fallbackMossAssetReports(analysis);
  const mossStatus = mossIndexingError ? MossIndexStatus.FAILED : MossIndexStatus.EMBEDDED;

  await prisma.$transaction(async (tx) => {
    await tx.protocol.update({
      where: { id: protocolId },
      data: {
        title: analysis.protocol.title,
        indication: analysis.protocol.indication,
        intervention: analysis.protocol.intervention,
        patientPopulation: analysis.protocol.population,
        geographies: analysis.protocol.geography,
        relevantSpecialties: analysis.protocol.relevant_specialties,
        status: ProtocolStatus.READY_FOR_REVIEW,
      },
    });

    const briefRows = [
      ['study_title', 'Study title', analysis.protocol.title],
      ['indication', 'Indication', analysis.protocol.indication],
      ['intervention', 'Intervention', analysis.protocol.intervention],
      ['patient_population', 'Patient population', analysis.protocol.population],
      ['geography', 'Geography', analysis.protocol.geography.join(' / ')],
      ['endpoints', 'Endpoints', analysis.protocol.endpoints.join(' / ')],
      [
        'relevant_specialties',
        'Relevant specialties',
        analysis.protocol.relevant_specialties.join(' / '),
      ],
    ];
    for (const [sectionKey, sectionLabel, value] of briefRows) {
      await tx.protocolBriefSection.upsert({
        where: { protocolId_sectionKey: { protocolId, sectionKey } },
        update: {
          runId,
          sectionLabel,
          value,
          confidence: 0.9,
          status: BriefSectionStatus.VALIDATED,
        },
        create: {
          protocolId,
          runId,
          sectionKey,
          sectionLabel,
          value,
          confidence: 0.9,
          status: BriefSectionStatus.VALIDATED,
        },
      });
    }

    for (const group of analysis.search_query_groups) {
      const queryGroup = await tx.searchQueryGroup.create({
        data: {
          protocolId,
          runId,
          name: group.name,
          status:
            group.status?.toLowerCase() === 'edited'
              ? QueryGroupStatus.EDITED
              : QueryGroupStatus.APPROVED,
          sourceTargets: group.source_targets,
          resultCount: group.result_count,
          generatedFrom: asJson({ agentic: true }),
        },
        select: { id: true },
      });
      if (group.queries.length) {
        await tx.searchQuery.createMany({
          data: group.queries.map((query) => ({
            queryGroupId: queryGroup.id,
            text: query,
            sourceTargets: group.source_targets,
            resultCount: group.result_count,
            executedAt: completedAt,
          })),
        });
      }
    }

    const evidenceByKol = new Map<string, string[]>();
    for (const item of analysis.evidence) {
      const score = normalizePercentScore(item.score);
      const type = evidenceSourceType(`${item.evidence_type} ${item.source}`);
      const externalId = item.url || hashKey(`${item.source}:${item.title}`);
      const source = await tx.evidenceSource.upsert({
        where: { type_externalId: { type, externalId } },
        update: {
          title: item.title,
          host: item.source,
          sourceUrl: item.url || null,
          publishedAt: dateOrNull(item.published_at),
          accessedAt: completedAt,
        },
        create: {
          type,
          title: item.title,
          host: item.source,
          sourceUrl: item.url || null,
          externalId,
          publishedAt: dateOrNull(item.published_at),
          accessedAt: completedAt,
          metadata: asJson({ evidenceType: item.evidence_type }),
        },
        select: { id: true },
      });
      const snippet = await tx.evidenceSnippet.create({
        data: {
          sourceId: source.id,
          protocolId,
          runId,
          text: item.snippet,
          score,
          strength: evidenceStrength(item.strength, score),
          metadata: asJson({
            title: item.title,
            url: item.url,
            linkedKols: item.linked_kols,
          }),
        },
        select: { id: true },
      });
      for (const kolName of item.linked_kols) {
        evidenceByKol.set(kolName, [...(evidenceByKol.get(kolName) ?? []), snippet.id]);
      }
    }

    const rankingRun = await tx.rankingRun.create({
      data: {
        protocolId,
        processingRunId: runId,
        modelId: model.id,
        status: RankingRunStatus.COMPLETE,
        config: asJson({
          source: 'openai-agents-sdk',
          weights: {
            protocol_match: 0.3,
            trial_experience: 0.25,
            publication_relevance: 0.2,
            institution_site_relevance: 0.1,
            congress_guideline_influence: 0.1,
            recency: 0.05,
          },
        }),
        completedAt,
      },
      select: { id: true },
    });

    const candidateIdsByName = new Map<string, { candidateId: string; expertId: string }>();
    for (const [index, candidate] of analysis.top_kols.entries()) {
      const candidateScore = normalizePercentScore(candidate.score);
      const expert = await tx.expert.upsert({
        where: { slug: slugify(candidate.name) },
        update: {
          name: candidate.name,
          primarySpecialty: candidate.specialty,
          geography: candidate.geography,
          profileSummary: candidate.rationale,
          status: ExpertStatus.VALIDATED,
        },
        create: {
          slug: slugify(candidate.name),
          name: candidate.name,
          primarySpecialty: candidate.specialty,
          geography: candidate.geography,
          profileSummary: candidate.rationale,
          status: ExpertStatus.VALIDATED,
        },
        select: { id: true },
      });
      const protocolCandidate = await tx.protocolExpertCandidate.upsert({
        where: { protocolId_expertId: { protocolId, expertId: expert.id } },
        update: {
          runId,
          rank: index + 1,
          score: candidateScore,
          sourcesCount: candidate.citations.length,
          flagsCount: candidate.compliance_flags?.length ?? 0,
          status: candidateStatus(candidate),
          rationale: candidate.rationale,
        },
        create: {
          protocolId,
          runId,
          expertId: expert.id,
          rank: index + 1,
          score: candidateScore,
          sourcesCount: candidate.citations.length,
          flagsCount: candidate.compliance_flags?.length ?? 0,
          status: candidateStatus(candidate),
          rationale: candidate.rationale,
        },
        select: { id: true },
      });
      candidateIdsByName.set(candidate.name, {
        candidateId: protocolCandidate.id,
        expertId: expert.id,
      });

      for (const snippetId of evidenceByKol.get(candidate.name) ?? []) {
        await tx.expertEvidence.upsert({
          where: {
            expertId_evidenceSnippetId: { expertId: expert.id, evidenceSnippetId: snippetId },
          },
          update: { relevanceNote: candidate.rationale, confidence: 0.85 },
          create: {
            expertId: expert.id,
            evidenceSnippetId: snippetId,
            relevanceNote: candidate.rationale,
            confidence: 0.85,
          },
        });
      }

      const rankingResult = await tx.expertRankingResult.create({
        data: {
          rankingRunId: rankingRun.id,
          candidateId: protocolCandidate.id,
          expertId: expert.id,
          rank: index + 1,
          score: candidateScore,
          rationale: candidate.rationale,
        },
        select: { id: true },
      });

      const scoreRows = [
        ['protocol_match', 'Protocol match', 0.3],
        ['trial_experience', 'Trial investigator experience', 0.25],
        ['publication_relevance', 'Publication relevance', 0.2],
        ['institution_site_relevance', 'Institution / site relevance', 0.1],
        ['congress_guideline_influence', 'Congress / guideline influence', 0.1],
        ['recency', 'Recency', 0.05],
      ] as const;
      await tx.scoreComponent.createMany({
        data: scoreRows.map(([dimensionKey, label, weight]) => {
          const componentScore = normalizeComponentScore(
            dimensionKey,
            candidate.score_breakdown[dimensionKey]
          );
          return {
            rankingResultId: rankingResult.id,
            candidateId: protocolCandidate.id,
            dimensionKey,
            label,
            weight,
            rawScore: componentScore,
            weightedScore: componentScore,
            explanation: candidate.rationale,
          };
        }),
      });

      for (const citation of candidate.citations) {
        const createdCitation = await tx.citation.create({
          data: {
            protocolId,
            title: citation.title,
            url: citation.url || null,
            label: citation.source,
            usage: CitationUsage.RANKING_RATIONALE,
            quotedText: citation.snippet,
            accessedAt: completedAt,
          },
          select: { id: true },
        });
        await tx.candidateCitation.create({
          data: {
            candidateId: protocolCandidate.id,
            citationId: createdCitation.id,
            note: citation.evidence_type,
            weight: 1,
          },
        });
      }

      for (const flag of candidate.compliance_flags ?? []) {
        await tx.complianceFlag.create({
          data: {
            protocolId,
            candidateId: protocolCandidate.id,
            expertId: expert.id,
            severity: ComplianceSeverity.MEDIUM,
            type: 'Candidate compliance note',
            detail: flag,
            status: ComplianceFlagStatus.OPEN,
          },
        });
      }
    }

    const complianceCheck = await tx.complianceCheck.create({
      data: {
        protocolId,
        runId,
        checkerVersion: 'agentic-v1',
        result: analysis.compliance_notes.some((note) => note.severity !== 'info')
          ? ComplianceRuleResult.WARN
          : ComplianceRuleResult.PASS,
        findings: asJson(analysis.compliance_notes),
      },
      select: { id: true },
    });
    for (const note of analysis.compliance_notes.filter((item) => item.severity !== 'info')) {
      await tx.complianceFlag.create({
        data: {
          complianceCheckId: complianceCheck.id,
          protocolId,
          severity: complianceSeverity(note.severity),
          type: 'Medical Affairs guardrail',
          detail: note.message,
          status: ComplianceFlagStatus.OPEN,
        },
      });
    }

    let briefId: string | null = null;
    if (analysis.msl_brief) {
      const candidate =
        candidateIdsByName.get(analysis.msl_brief.expert_name) ??
        [...candidateIdsByName.values()][0];
      const brief = await tx.mslBrief.create({
        data: {
          protocolId,
          runId,
          candidateId: candidate?.candidateId,
          expertId: candidate?.expertId,
          status: BriefStatus.GENERATED,
          title: `MSL pre-call brief: ${analysis.msl_brief.expert_name}`,
          summary: analysis.msl_brief.relevance_rationale,
          complianceWarning: analysis.msl_brief.compliance_warnings.join('\n'),
          generatedAt: completedAt,
        },
        select: { id: true },
      });
      briefId = brief.id;
      await tx.mslBriefSection.createMany({
        data: [
          {
            briefId: brief.id,
            sectionKey: 'scientific_background',
            heading: 'Scientific background',
            content: analysis.msl_brief.scientific_background,
            order: 0,
          },
          {
            briefId: brief.id,
            sectionKey: 'relevance_rationale',
            heading: 'Relevance rationale',
            content: analysis.msl_brief.relevance_rationale,
            order: 1,
          },
          {
            briefId: brief.id,
            sectionKey: 'compliance_warnings',
            heading: 'Compliance warnings',
            content: analysis.msl_brief.compliance_warnings.join('\n'),
            order: 2,
          },
        ],
      });
      await tx.suggestedQuestion.createMany({
        data: analysis.msl_brief.suggested_questions.map((question, index) => ({
          briefId: brief.id,
          question,
          rationale: 'Non-promotional scientific exchange question generated by KOL Copilot.',
          order: index,
          isApproved: false,
        })),
      });
      for (const citation of analysis.msl_brief.citations) {
        const createdCitation = await tx.citation.create({
          data: {
            protocolId,
            title: citation.title,
            url: citation.url || null,
            label: citation.source,
            usage: CitationUsage.BRIEF_CLAIM,
            quotedText: citation.snippet,
            accessedAt: completedAt,
          },
          select: { id: true },
        });
        await tx.briefCitation.create({
          data: {
            briefId: brief.id,
            citationId: createdCitation.id,
            claimText: citation.evidence_type,
          },
        });
      }
    }

    for (const asset of mossAssetReports) {
      const totalChunks = asset.doc_count || asset.document_ids.length;
      const createdAsset = await tx.mossIndexAsset.create({
        data: {
          protocolId,
          runId,
          assetType: mossAssetType(asset.asset_type),
          label: asset.label,
          totalChunks,
          embeddedChunks: mossIndexingError ? 0 : totalChunks,
          failedChunks: mossIndexingError ? totalChunks : 0,
          status: mossStatus,
        },
        select: { id: true },
      });
      if (!mossIndexingError && asset.document_ids.length) {
        await tx.mossIndexItem.createMany({
          data: asset.document_ids.map((documentId) => ({
            assetId: createdAsset.id,
            protocolId,
            runId,
            assetType: mossAssetType(asset.asset_type),
            objectType: asset.asset_type.toLowerCase(),
            objectId: documentId,
            mossDocumentId: documentId,
            namespace: asset.index_name,
            status: MossIndexStatus.EMBEDDED,
            metadata: asJson({
              label: asset.label,
              indexName: asset.index_name,
              modelId: mossIndexing?.model_id ?? null,
              indexOperation: mossIndexing?.indexes?.[asset.index_name]?.operation ?? null,
              loadError: mossIndexing?.indexes?.[asset.index_name]?.load_error ?? null,
            }),
            embeddedAt: completedAt,
          })),
        });
      }
    }

    await tx.exportArtifact.create({
      data: {
        protocolId,
        runId,
        briefId,
        format: ExportFormat.JSON,
        label: 'Agentic analysis snapshot',
        description:
          'OpenAI Agents SDK structured output containing protocol brief, search plan, evidence, KOL ranking, compliance notes, and MSL brief.',
        storageUrl: resultJsonPath,
        status: ExportStatus.READY,
      },
    });

    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.BRIEF } },
      data: {
        status: ProcessingStageStatus.DONE,
        detail: `${briefRows.length} sections`,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.QUERIES } },
      data: {
        status: ProcessingStageStatus.DONE,
        detail: `${analysis.search_query_groups.length} groups`,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.EVIDENCE } },
      data: {
        status: ProcessingStageStatus.DONE,
        detail: `${analysis.evidence.length} sources`,
        startedAt: completedAt,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.KOLS } },
      data: {
        status: ProcessingStageStatus.DONE,
        detail: `${analysis.top_kols.length} candidates`,
        startedAt: completedAt,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.RANKED } },
      data: {
        status: ProcessingStageStatus.DONE,
        detail: `${analysis.top_kols.length} scored`,
        startedAt: completedAt,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.MOSS } },
      data: {
        status: mossIndexingError ? ProcessingStageStatus.ERROR : ProcessingStageStatus.DONE,
        detail: mossIndexingError
          ? truncateText(`Moss indexing failed: ${mossIndexingError}`, 240)
          : `${mossIndexing?.document_count ?? 0} structured documents available to LiveKit`,
        startedAt: completedAt,
        completedAt,
      },
    });
    await tx.processingStage.update({
      where: { runId_key: { runId, key: ProcessingStageKey.REVIEW } },
      data: {
        status: ProcessingStageStatus.ACTIVE,
        detail: 'Ready for Medical Affairs review',
        startedAt: completedAt,
      },
    });
    await tx.processingRun.update({
      where: { id: runId },
      data: {
        status: ProcessingRunStatus.COMPLETED,
        stageLabel: 'Agentic analysis ready for review',
        completedAt,
        summary: asJson({
          answer: analysis.answer,
          analysisSource: analysisSource(analysis),
          isFallback: isFallbackAnalysis(analysis),
          fallbackReason: analysis.fallback_reason ?? null,
          auditTrail: analysis.audit_trail,
          counts: {
            queryGroups: analysis.search_query_groups.length,
            evidence: analysis.evidence.length,
            candidates: analysis.top_kols.length,
            citations: analysis.top_kols.reduce(
              (sum, candidate) => sum + candidate.citations.length,
              0
            ),
            mossDocuments: mossIndexing?.document_count ?? 0,
          },
          mossIndexing: mossIndexing
            ? {
                ok: true,
                documentCount: mossIndexing.document_count,
                indexes: mossIndexing.indexes,
              }
            : {
                ok: false,
                error: mossIndexingError,
              },
          outputs: { resultJsonPath, snapshotPath },
        }),
      },
    });
    await tx.auditEvent.create({
      data: {
        protocolId,
        runId,
        action: 'agentic_analysis.completed',
        entityType: 'ProcessingRun',
        entityId: runId,
        payload: asJson({
          resultJsonPath,
          snapshotPath,
          auditTrail: analysis.audit_trail,
          mossIndexing: mossIndexing
            ? {
                ok: true,
                documentCount: mossIndexing.document_count,
                indexes: mossIndexing.indexes,
              }
            : {
                ok: false,
                error: mossIndexingError,
              },
        }),
      },
    });
  });

  return { resultJsonPath, snapshotPath, mossIndexing, mossIndexingError };
}

async function markFailed(protocolId: string, runId: string, message: string) {
  const safeMessage = truncateText(message, 1400);
  await prisma.$transaction([
    prisma.protocol.update({
      where: { id: protocolId },
      data: { status: ProtocolStatus.FAILED },
    }),
    prisma.processingRun.update({
      where: { id: runId },
      data: {
        status: ProcessingRunStatus.FAILED,
        stageLabel: 'Agentic analysis failed',
        completedAt: new Date(),
        errorMessage: safeMessage,
      },
    }),
    prisma.processingStage.updateMany({
      where: { runId, status: ProcessingStageStatus.ACTIVE },
      data: {
        status: ProcessingStageStatus.ERROR,
        detail: safeMessage.slice(0, 240),
        completedAt: new Date(),
      },
    }),
    prisma.auditEvent.create({
      data: {
        protocolId,
        runId,
        action: 'agentic_analysis.failed',
        entityType: 'ProcessingRun',
        entityId: runId,
        payload: asJson({ message: safeMessage }),
      },
    }),
  ]);
}

export async function POST(request: Request, context: RouteContext) {
  const { protocolCode } = await context.params;
  const decodedProtocolCode = decodeURIComponent(protocolCode);
  const protocol = await loadProtocol(decodedProtocolCode);

  if (!protocol) {
    return jsonError(`Protocol ${decodedProtocolCode} was not found.`, 404);
  }

  const body = (await request.json().catch(() => ({}))) as { query?: string; userId?: string };
  const profile = protocolProfile(protocol);
  const query =
    body.query ||
    'Run agentic Medical Affairs analysis: generate protocol-derived search queries, retrieve public KOL evidence exhaustively, rank qualified experts, and draft a compliant MSL brief.';
  const protocolExcerpt = protocol.chunks
    .map((chunk) => chunk.text)
    .join('\n\n')
    .slice(0, 50000);
  const run = await createAnalysisRun(
    protocol.id,
    protocol.chunks.length,
    protocol.briefSections.length
  );

  try {
    const analysis = await runPythonAgent({
      protocol_profile: profile,
      protocol_excerpt: protocolExcerpt,
      query,
      user_id: body.userId || 'dashboard',
    });
    if (isFallbackAnalysis(analysis) && !allowFallbackAnalysis()) {
      const reason =
        analysis.fallback_reason ||
        analysis.audit_trail.find((entry) => /unavailable|failed|invalid|error/i.test(entry)) ||
        'OpenAI Agents SDK did not return a valid researched KOL payload.';
      throw new Error(
        truncateText(
          `OpenAI agentic analysis failed before valid KOLs were stored. ${reason}`,
          1400
        )
      );
    }
    const outputs = await persistAgenticAnalysis({
      protocolId: protocol.id,
      protocolCode: protocol.protocolCode,
      runId: run.id,
      runKey: run.runKey,
      analysis,
    });

    return NextResponse.json({
      protocol: {
        id: protocol.id,
        protocolCode: protocol.protocolCode,
        title: analysis.protocol.title,
      },
      run,
      counts: {
        queryGroups: analysis.search_query_groups.length,
        evidence: analysis.evidence.length,
        candidates: analysis.top_kols.length,
      },
      outputs,
      auditTrail: analysis.audit_trail,
    });
  } catch (error) {
    const message = truncateText(
      error instanceof Error ? error.message : 'Agentic analysis failed.',
      1400
    );
    await markFailed(protocol.id, run.id, message);
    return jsonError(message, 502, { runKey: run.runKey });
  }
}
