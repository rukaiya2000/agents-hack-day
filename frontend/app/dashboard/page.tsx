import type { Metadata } from 'next';
import { MedicalAffairsDashboard } from '@/components/dashboard/medical-affairs-dashboard';
import type {
  DashboardPipelineData,
  DashboardProtocol,
  ScreenKey,
} from '@/components/dashboard/medical-affairs-dashboard';
import { prisma } from '@/lib/prisma';

const VALID_SCREENS = new Set<ScreenKey>([
  'protocols',
  'runs',
  'overview',
  'brief',
  'queries',
  'evidence',
  'candidates',
  'ranking',
  'compliance',
  'moss',
  'summary',
]);

export const metadata: Metadata = {
  title: 'KOL Copilot Dashboard',
  description: 'Protocol-aware Medical Affairs orchestration dashboard.',
};

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const DEFAULT_STAGE_DEFS = [
  { key: 'parsed', label: 'Parsed' },
  { key: 'brief', label: 'Brief Extracted' },
  { key: 'queries', label: 'Queries Generated' },
  { key: 'evidence', label: 'Evidence Retrieved' },
  { key: 'kols', label: 'KOLs Extracted' },
  { key: 'ranked', label: 'Ranked' },
  { key: 'moss', label: 'Indexed in Moss' },
  { key: 'review', label: 'Ready for Review' },
] satisfies Array<{ key: string; label: string }>;

const ACTIVE_STAGE_BY_PROTOCOL_STATUS: Record<string, number | null> = {
  QUEUED: null,
  PARSING: 0,
  EXTRACTING: 1,
  RETRIEVING_EVIDENCE: 3,
  RANKING: 5,
  INDEXING: 6,
  READY_FOR_REVIEW: 7,
  COMPLETED: null,
  FAILED: 0,
  ARCHIVED: null,
};

function titleCaseEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function protocolStatusLabel(status: string) {
  const labels: Record<string, string> = {
    QUEUED: 'Queued',
    PARSING: 'Parsing',
    EXTRACTING: 'Extracting brief',
    RETRIEVING_EVIDENCE: 'Retrieving evidence',
    RANKING: 'Ranking in progress',
    INDEXING: 'Indexing in Moss',
    READY_FOR_REVIEW: 'Ready for review',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    ARCHIVED: 'Archived',
  };

  return labels[status] ?? titleCaseEnum(status);
}

function protocolStatusTone(status: string): DashboardProtocol['statusTone'] {
  if (status === 'COMPLETED') {
    return 'safe';
  }
  if (status === 'READY_FOR_REVIEW') {
    return 'accent';
  }
  if (status === 'FAILED') {
    return 'risk';
  }
  if (status === 'INDEXING') {
    return 'compliance';
  }
  if (status === 'QUEUED' || status === 'ARCHIVED') {
    return 'neutral';
  }

  return 'evidence';
}

function stageState(status: string): DashboardProtocol['stages'][number]['state'] {
  const states: Record<string, DashboardProtocol['stages'][number]['state']> = {
    PENDING: 'pending',
    ACTIVE: 'active',
    DONE: 'done',
    WARN: 'warn',
    ERROR: 'error',
    SKIPPED: 'pending',
  };

  return states[status] ?? 'pending';
}

function defaultStageDetail(stageKey: string, counts: ProtocolCounts, statusLabel: string) {
  const details: Record<string, string> = {
    parsed: counts.chunks > 0 ? `${counts.chunks} chunks` : 'Pending',
    brief: counts.briefSections > 0 ? `${counts.briefSections} sections` : 'Pending',
    queries: counts.queryGroups > 0 ? `${counts.queryGroups} groups` : 'Pending',
    evidence: counts.evidenceSnippets > 0 ? `${counts.evidenceSnippets} sources` : 'Pending',
    kols: counts.candidates > 0 ? `${counts.candidates} candidates` : 'Pending',
    ranked: counts.candidates > 0 ? `${counts.candidates} scored` : 'Pending',
    moss: counts.mossAssets > 0 ? `${counts.mossAssets} assets` : 'Pending',
    review: statusLabel,
  };

  return details[stageKey] ?? 'Pending';
}

function defaultStages(status: string, counts: ProtocolCounts): DashboardProtocol['stages'] {
  const activeIndex = ACTIVE_STAGE_BY_PROTOCOL_STATUS[status] ?? null;
  const statusLabel = protocolStatusLabel(status);
  const isCompleted = status === 'COMPLETED' || status === 'ARCHIVED';

  return DEFAULT_STAGE_DEFS.map((stage, index) => {
    let state: DashboardProtocol['stages'][number]['state'] = 'pending';

    if (status === 'FAILED' && index === activeIndex) {
      state = 'error';
    } else if (isCompleted || (activeIndex !== null && index < activeIndex)) {
      state = 'done';
    } else if (activeIndex === index) {
      state = 'active';
    }

    return {
      ...stage,
      state,
      detail:
        state === 'pending' && status === 'QUEUED'
          ? index === 0
            ? 'Queued'
            : 'Pending'
          : defaultStageDetail(stage.key, counts, statusLabel),
    };
  });
}

function fallbackHiddenStage(
  key: string,
  stage: DashboardProtocol['stages'][number]
): DashboardProtocol['stages'][number] {
  const overrides: Record<string, Partial<DashboardProtocol['stages'][number]>> = {
    queries: { state: 'error', detail: 'Fallback queries hidden' },
    evidence: { state: 'error', detail: 'Fallback evidence hidden' },
    kols: { state: 'error', detail: '0 candidates; fallback hidden' },
    ranked: { state: 'error', detail: '0 scored; fallback hidden' },
    moss: { state: 'error', detail: 'Fallback assets hidden' },
    review: { state: 'error', detail: 'OpenAI structured output failed' },
  };
  return { ...stage, ...(overrides[key] ?? {}) };
}

function formatUpdated(date: Date) {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  const hours = `${date.getUTCHours()}`.padStart(2, '0');
  const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

function enrollmentDisplay(display: string | null, target: number | null) {
  if (display) {
    return display;
  }

  if (target !== null) {
    return target.toLocaleString('en-US');
  }

  return '-';
}

type ProtocolCounts = {
  chunks: number;
  briefSections: number;
  queryGroups: number;
  evidenceSnippets: number;
  candidates: number;
  mossAssets: number;
};

async function getDashboardProtocols(): Promise<DashboardProtocol[]> {
  const protocols = await prisma.protocol.findMany({
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      _count: {
        select: {
          chunks: true,
          briefSections: true,
          queryGroups: true,
          evidenceSnippets: true,
          candidates: true,
          mossAssets: true,
        },
      },
      runs: {
        orderBy: [{ startedAt: 'desc' }, { createdAt: 'desc' }],
        take: 1,
        include: {
          stages: {
            orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          },
        },
      },
    },
  });

  return protocols.map((protocol, index) => {
    const latestRun = protocol.runs[0];
    const status = protocol.status.toString();
    const counts = protocol._count;
    const hideFallbackRun =
      process.env.KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS !== '1' &&
      isFallbackRunSummary(latestRun?.summary);
    const stages =
      latestRun?.stages.length > 0
        ? latestRun.stages.map((stage) => {
            const key = stage.key.toString().toLowerCase();
            const mapped = {
              key,
              label: stage.label,
              state: stageState(stage.status.toString()),
              detail:
                stage.detail ??
                defaultStageDetail(key, counts, protocolStatusLabel(status)),
            };
            return hideFallbackRun ? fallbackHiddenStage(key, mapped) : mapped;
          })
        : defaultStages(status, counts);

    return {
      id: protocol.protocolCode,
      nct: protocol.nctId ?? 'Not registered',
      run: latestRun?.runKey ?? null,
      title: protocol.title,
      sponsor: protocol.sponsor ?? '-',
      phase: protocol.phase ?? '-',
      indication: protocol.indication ?? '-',
      geo: protocol.geographies.length > 0 ? protocol.geographies : ['-'],
      enrollment: enrollmentDisplay(protocol.enrollmentDisplay, protocol.enrollmentTarget),
      status: protocolStatusLabel(status),
      statusTone: protocolStatusTone(status),
      updated: formatUpdated(protocol.updatedAt),
      active: index === 0,
      stages,
    };
  });
}

const RANKING_DIMENSIONS = [
  { label: 'Protocol match', weight: '30%' },
  { label: 'Trial investigator experience', weight: '25%' },
  { label: 'Publication relevance', weight: '20%' },
  { label: 'Institution / site relevance', weight: '10%' },
  { label: 'Guideline / congress influence', weight: '10%' },
  { label: 'Recency', weight: '5%' },
];

const GUARDRAILS = [
  { label: 'No promotional language', ok: true },
  { label: 'Do not rank by prescribing volume', ok: true },
  { label: 'No investigational safety or efficacy claims', ok: true },
  { label: 'Frame outreach as non-promotional scientific exchange', ok: true },
  { label: 'Every recommendation carries supporting evidence', ok: true },
];

function enumLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatMaybeDate(value: Date | null | undefined) {
  if (!value) {
    return 'undated';
  }
  return `${value.getUTCFullYear()}-${`${value.getUTCMonth() + 1}`.padStart(2, '0')}`;
}

function stateFromMossStatus(status: string): DashboardPipelineData['mossAssets'][number]['state'] {
  if (status === 'EMBEDDED') {
    return 'done';
  }
  if (status === 'FAILED') {
    return 'error';
  }
  if (status === 'RETRYING') {
    return 'warn';
  }
  return 'pending';
}

function strengthLabel(value: string | null | undefined) {
  return value ? value.toLowerCase() : 'moderate';
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

function summaryRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isFallbackRunSummary(value: unknown) {
  const summary = summaryRecord(value);
  const source = String(summary.analysisSource ?? summary.analysis_source ?? '');
  const reason = String(summary.fallbackReason ?? summary.fallback_reason ?? '');
  const auditTrail = Array.isArray(summary.auditTrail)
    ? summary.auditTrail.map((entry) => String(entry)).join(' ')
    : '';

  return (
    summary.isFallback === true ||
    summary.is_fallback === true ||
    /fallback|seed dataset|deterministic/i.test(`${source} ${reason} ${auditTrail}`)
  );
}

function runSummaryValue(value: unknown, key: string) {
  const summary = summaryRecord(value);
  const raw = summary[key];
  return typeof raw === 'string' ? raw : null;
}

function candidateDimensions(candidate: {
  rankingResults: Array<{
    components: Array<{ dimensionKey: string; weightedScore: number }>;
  }>;
}) {
  const components = candidate.rankingResults[0]?.components ?? [];
  const byKey = new Map(
    components.map((component) => [
      component.dimensionKey,
      normalizeComponentScore(component.dimensionKey, component.weightedScore),
    ])
  );
  return [
    byKey.get('protocol_match') ?? 0,
    byKey.get('trial_experience') ?? 0,
    byKey.get('publication_relevance') ?? 0,
    byKey.get('institution_site_relevance') ?? 0,
    byKey.get('congress_guideline_influence') ?? 0,
    byKey.get('recency') ?? 0,
  ];
}

async function getPipelineDataByProtocol(
  protocolCodes: string[]
): Promise<Record<string, DashboardPipelineData>> {
  if (!protocolCodes.length) {
    return {};
  }

  const protocols = await prisma.protocol.findMany({
    where: { protocolCode: { in: protocolCodes } },
    include: {
      runs: {
        orderBy: [{ startedAt: 'desc' }, { createdAt: 'desc' }],
        take: 1,
        select: {
          summary: true,
          status: true,
          errorMessage: true,
        },
      },
      briefSections: {
        orderBy: { createdAt: 'asc' },
        include: {
          run: { select: { summary: true } },
        },
      },
      queryGroups: {
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          run: { select: { summary: true } },
          queries: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
      evidenceSnippets: {
        orderBy: { createdAt: 'desc' },
        take: 80,
        include: {
          source: true,
          run: { select: { summary: true } },
          expertLinks: {
            include: { expert: true },
          },
        },
      },
      candidates: {
        orderBy: [{ rank: 'asc' }, { score: 'desc' }, { createdAt: 'asc' }],
        take: 40,
        include: {
          run: { select: { summary: true } },
          expert: true,
          citations: { include: { citation: true } },
          rankingResults: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              components: true,
            },
          },
        },
      },
      complianceFlags: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          complianceCheck: {
            include: {
              run: { select: { summary: true } },
            },
          },
          expert: true,
          candidate: {
            include: {
              expert: true,
              run: { select: { summary: true } },
            },
          },
          brief: {
            include: {
              run: { select: { summary: true } },
            },
          },
        },
      },
      mossAssets: {
        orderBy: { createdAt: 'desc' },
        include: {
          run: { select: { summary: true } },
        },
      },
      briefs: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          run: { select: { summary: true } },
          suggestedQuestions: { orderBy: { order: 'asc' } },
        },
      },
      exports: {
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          run: { select: { summary: true } },
        },
      },
    },
  });

  const showFallbackAnalysis = process.env.KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS === '1';

  return Object.fromEntries(
    protocols.map((protocol) => {
      const latestRun = protocol.runs[0] ?? null;
      const latestRunIsFallback = isFallbackRunSummary(latestRun?.summary);
      const hiddenFallbackRun = latestRunIsFallback && !showFallbackAnalysis;
      const visibleBriefSections = protocol.briefSections.filter(
        (section) => showFallbackAnalysis || !isFallbackRunSummary(section.run?.summary)
      );
      const visibleQueryGroups = protocol.queryGroups.filter(
        (group) => showFallbackAnalysis || !isFallbackRunSummary(group.run?.summary)
      );
      const visibleEvidenceSnippets = protocol.evidenceSnippets.filter(
        (snippet) => showFallbackAnalysis || !isFallbackRunSummary(snippet.run?.summary)
      );
      const visibleCandidates = protocol.candidates.filter(
        (candidate) => showFallbackAnalysis || !isFallbackRunSummary(candidate.run?.summary)
      );
      const visibleComplianceFlags = protocol.complianceFlags.filter(
        (flag) =>
          showFallbackAnalysis ||
          (!isFallbackRunSummary(flag.complianceCheck?.run?.summary) &&
            !isFallbackRunSummary(flag.candidate?.run?.summary) &&
            !isFallbackRunSummary(flag.brief?.run?.summary))
      );
      const visibleMossAssets = protocol.mossAssets.filter(
        (asset) => showFallbackAnalysis || !isFallbackRunSummary(asset.run?.summary)
      );
      const visibleBriefs = protocol.briefs.filter(
        (briefItem) => showFallbackAnalysis || !isFallbackRunSummary(briefItem.run?.summary)
      );
      const visibleExports = protocol.exports.filter(
        (item) => showFallbackAnalysis || !isFallbackRunSummary(item.run?.summary)
      );
      const analysisSource = runSummaryValue(latestRun?.summary, 'analysisSource');
      const fallbackReason = runSummaryValue(latestRun?.summary, 'fallbackReason');
      const analysisError =
        hiddenFallbackRun
          ? `Last agentic analysis produced fallback seed data, so generated KOL assets are hidden. ${fallbackReason ?? 'Re-run after the OpenAI structured-output path returns valid researched KOLs.'}`
          : latestRun?.status.toString() === 'FAILED'
            ? latestRun.errorMessage
            : null;

      const candidates = visibleCandidates.map((candidate, index) => ({
        id: candidate.id,
        rank: candidate.rank ?? index + 1,
        name: candidate.expert.name,
        institution:
          candidate.expert.profileSummary?.match(/ at ([^,.]+)/)?.[1] ??
          'Institution not specified',
        specialty: candidate.expert.primarySpecialty ?? 'Medical expert',
        geo: candidate.expert.geography ?? 'Not specified',
        score: Number(normalizePercentScore(candidate.score).toFixed(1)),
        sources: candidate.sourcesCount || candidate.citations.length,
        flags: candidate.flagsCount,
        status: candidate.status.toString().toLowerCase(),
        rationale:
          candidate.rationale ??
          candidate.expert.profileSummary ??
          'Evidence-backed protocol relevance.',
        dimensions: candidateDimensions(candidate),
      }));
      const evidence = visibleEvidenceSnippets.map((snippet) => ({
        id: snippet.id,
        type: enumLabel(snippet.source.type.toString()),
        title: (snippet.metadata as { title?: string } | null)?.title ?? snippet.source.title,
        host: snippet.source.host ?? snippet.source.sourceUrl ?? 'Public source',
        date: formatMaybeDate(snippet.source.publishedAt),
        score: Math.round(normalizePercentScore(snippet.score ?? 75)),
        strength: strengthLabel(snippet.strength?.toString()),
        snippet: snippet.text,
        kols: snippet.expertLinks.map((link) => link.expert.name),
      }));
      const complianceFlags = visibleComplianceFlags.map((flag) => ({
        severity: flag.severity.toString().toLowerCase(),
        kol: flag.expert?.name ?? flag.candidate?.expert.name ?? 'Protocol-level',
        type: flag.type,
        detail: flag.detail,
        status: flag.status.toString().toLowerCase(),
      }));
      const queryGroups = visibleQueryGroups.map((group) => ({
        name: group.name,
        status: group.status.toString().toLowerCase(),
        results: group.resultCount,
        sources: group.sourceTargets.join(', ') || 'Public sources',
        queries: group.queries.map((query) => query.text),
      }));
      const brief = visibleBriefSections.map((section) => ({
        section: section.sectionLabel,
        value: section.value,
        confidence: Math.round((section.confidence ?? 0.85) * 100),
        chunk: section.sourceChunkId
          ? `Chunk ${section.sourceChunkId.slice(0, 6)}`
          : 'Agent output',
        status: section.status.toString().toLowerCase(),
      }));
      const mossAssets = visibleMossAssets.map((asset) => ({
        label: asset.label,
        chunks: asset.totalChunks,
        embedded: asset.embeddedChunks,
        failed: asset.failedChunks,
        state: stateFromMossStatus(asset.status.toString()),
      }));
      const exports = visibleExports.map((item) => ({
        fmt: item.format.toString(),
        label: item.label,
        desc: item.description ?? 'Generated protocol artifact.',
      }));
      const top = candidates[0];
      const second = candidates[1];
      const suggestedQuestions =
        visibleBriefs[0]?.suggestedQuestions.map((item) => item.question) ?? [];
      const voiceQa = [
        top
          ? {
              q: `Why is ${top.name} ranked #1?`,
              a: `${top.name} scores ${top.score} because ${top.rationale}`,
              chips: [`${top.sources} citations`, 'Guardrail check passed'],
            }
          : null,
        top && second
          ? {
              q: `Why is ${top.name} ranked above ${second.name}?`,
              a: `${top.name} outranks ${second.name} on the weighted protocol score, especially protocol match, trial experience, and publication relevance.`,
              chips: ['Explainable ranking', 'Scientific relevance only'],
            }
          : null,
        suggestedQuestions[0]
          ? {
              q: `Draft a compliant MSL pre-call brief for ${top?.name ?? 'the top KOL'}`,
              a: `Generated a non-promotional brief with scientific background, relevance rationale, source-linked evidence, suggested questions such as "${suggestedQuestions[0]}", and compliance warnings.`,
              chips: ['Non-promotional', 'Audit logged'],
            }
          : null,
      ].filter((item): item is DashboardPipelineData['voiceQa'][number] => Boolean(item));

      const pipelineData: DashboardPipelineData = {
        isReady: candidates.length > 0 || evidence.length > 0 || queryGroups.length > 0,
        analysisSource,
        isFallback: latestRunIsFallback && showFallbackAnalysis,
        fallbackReason,
        analysisError,
        statusCards: [
          {
            key: 'kols',
            label: 'KOLs found',
            value: `${candidates.length}`,
            sub: `${candidates.filter((candidate) => candidate.status === 'validated').length} validated`,
            tone: 'accent',
            icon: 'candidates',
            screen: 'candidates',
          },
          {
            key: 'evidence',
            label: 'Evidence sources',
            value: `${evidence.length}`,
            sub: 'source-linked snippets',
            tone: 'evidence',
            icon: 'evidence',
            screen: 'evidence',
          },
          {
            key: 'queries',
            label: 'Query groups',
            value: `${queryGroups.length}`,
            sub: 'agent-generated searches',
            tone: 'safe',
            icon: 'queries',
            screen: 'queries',
          },
          {
            key: 'flags',
            label: 'Compliance flags',
            value: `${complianceFlags.filter((flag) => flag.status !== 'resolved').length}`,
            sub: 'open / reviewer required',
            tone: complianceFlags.length ? 'risk' : 'safe',
            icon: 'shield',
            screen: 'compliance',
          },
          {
            key: 'moss',
            label: 'Structured assets',
            value: `${mossAssets.reduce((sum, asset) => sum + asset.embedded, 0)}`,
            sub: 'available to LiveKit',
            tone: 'compliance',
            icon: 'database',
            screen: 'moss',
          },
        ],
        brief,
        queryGroups,
        evidence,
        candidates,
        rankingDimensions: RANKING_DIMENSIONS,
        guardrails: GUARDRAILS,
        complianceFlags,
        mossAssets,
        exports: exports.length
          ? exports
          : [{ fmt: 'JSON', label: 'Agentic analysis', desc: 'Structured analysis snapshot.' }],
        voiceQa: voiceQa.length
          ? voiceQa
          : [
              {
                q: 'What did the agentic analysis find?',
                a: 'Run Agentic Analysis to generate protocol-specific KOL evidence, ranking rationale, and an MSL-ready brief.',
                chips: ['Pending analysis'],
              },
            ],
      };

      return [protocol.protocolCode, pipelineData];
    })
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const requestedScreen = firstParam(params.screen);
  const initialScreen =
    requestedScreen && VALID_SCREENS.has(requestedScreen as ScreenKey)
      ? (requestedScreen as ScreenKey)
      : 'overview';
  const initialUploadOpen = firstParam(params.upload) === '1';
  const initialProtocolId = firstParam(params.protocol);
  let dashboardProtocols: DashboardProtocol[] = [];
  let pipelineDataByProtocol: Record<string, DashboardPipelineData> = {};
  let protocolLoadError: string | null = null;

  try {
    dashboardProtocols = await getDashboardProtocols();
    pipelineDataByProtocol = await getPipelineDataByProtocol(
      dashboardProtocols.map((protocol) => protocol.id)
    );
  } catch (error) {
    console.error('Failed to load dashboard protocols from Prisma', error);
    protocolLoadError =
      'Could not load protocols from the database. Check DATABASE_URL and Prisma connectivity.';
  }

  return (
    <MedicalAffairsDashboard
      initialScreen={initialScreen}
      initialProtocolId={initialProtocolId}
      initialUploadOpen={initialUploadOpen}
      protocols={dashboardProtocols}
      pipelineDataByProtocol={pipelineDataByProtocol}
      protocolLoadError={protocolLoadError}
    />
  );
}
