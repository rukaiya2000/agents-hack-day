'use client';

import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectionState, TokenSource } from 'livekit-client';
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronDown,
  ClipboardCheck,
  Database,
  Download,
  FileCheck2,
  FileSearch,
  FileText,
  Gauge,
  Home,
  Library,
  Mic,
  Network,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Upload,
  Users,
  X,
} from 'lucide-react';
import {
  useAgent,
  useSession,
  useSessionContext,
  useSessionMessages,
} from '@livekit/components-react';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import {
  AgentControlBar,
  type AgentControlBarControls,
} from '@/components/agents-ui/agent-control-bar';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { MossResultsPanel } from '@/components/app/moss-results-panel';
import { useMossContextEvents } from '@/hooks/useMossContextEvents';
import styles from './medical-affairs-dashboard.module.css';

const LOGO_SRC = '/kol-copilot-logo-mark.svg';

export type ScreenKey =
  | 'protocols'
  | 'runs'
  | 'overview'
  | 'brief'
  | 'queries'
  | 'evidence'
  | 'candidates'
  | 'ranking'
  | 'compliance'
  | 'moss'
  | 'summary';

type Tone = 'accent' | 'evidence' | 'compliance' | 'risk' | 'safe' | 'neutral';
type State = 'done' | 'warn' | 'active' | 'pending' | 'error';
type IconName = keyof typeof ICONS;
type DashboardIcon = typeof AlertTriangle;
type UploadPhase = 'idle' | 'invalid' | 'uploading' | 'parsing' | 'ready' | 'error';
type UploadProtocolFile = { name: string; sizeMB: number; ext: string };
type Stage = { key: string; label: string; state: State; detail: string };
type VoiceCallState = 'closed' | 'starting' | 'live' | 'ended' | 'error';

export type DashboardProtocol = {
  id: string;
  nct: string;
  run: string | null;
  title: string;
  sponsor: string;
  phase: string;
  indication: string;
  geo: string[];
  enrollment: string;
  status: string;
  statusTone: Tone;
  updated: string;
  active: boolean;
  stages: Stage[];
};

export type DashboardStatusCard = {
  key: string;
  label: string;
  value: string;
  sub: string;
  tone: Tone;
  icon: IconName;
  screen: ScreenKey;
};

export type DashboardBriefRow = {
  section: string;
  value: string;
  confidence: number;
  chunk: string;
  status: string;
};

export type DashboardQueryGroup = {
  name: string;
  status: string;
  results: number | null;
  sources: string;
  queries: string[];
};

export type DashboardEvidenceItem = {
  id: string;
  type: string;
  title: string;
  host: string;
  date: string;
  score: number;
  strength: string;
  snippet: string;
  kols: string[];
};

export type DashboardCandidate = {
  id: string;
  rank: number;
  name: string;
  institution: string;
  specialty: string;
  geo: string;
  score: number;
  sources: number;
  flags: number;
  status: string;
  rationale: string;
  dimensions: number[];
};

export type DashboardRankingDimension = {
  label: string;
  weight: string;
};

export type DashboardGuardrail = {
  label: string;
  ok: boolean;
};

export type DashboardComplianceFlag = {
  severity: string;
  kol: string;
  type: string;
  detail: string;
  status: string;
};

export type DashboardMossAsset = {
  label: string;
  chunks: number;
  embedded: number;
  failed: number;
  state: State;
};

export type DashboardExportItem = {
  fmt: string;
  label: string;
  desc: string;
};

export type DashboardVoiceQa = {
  q: string;
  a: string;
  chips: string[];
};

export type DashboardPipelineData = {
  isReady: boolean;
  analysisSource?: string | null;
  isFallback?: boolean;
  fallbackReason?: string | null;
  analysisError?: string | null;
  statusCards: DashboardStatusCard[];
  brief: DashboardBriefRow[];
  queryGroups: DashboardQueryGroup[];
  evidence: DashboardEvidenceItem[];
  candidates: DashboardCandidate[];
  rankingDimensions: DashboardRankingDimension[];
  guardrails: DashboardGuardrail[];
  complianceFlags: DashboardComplianceFlag[];
  mossAssets: DashboardMossAsset[];
  exports: DashboardExportItem[];
  voiceQa: DashboardVoiceQa[];
};

type UploadCompleteResult = {
  protocol: {
    id: string;
    protocolCode: string;
    title: string;
    sponsor: string | null;
    phase: string | null;
    indication: string | null;
  };
  run: {
    id: string;
    runKey: string;
  };
  unsiloed: {
    jobId: string;
    totalChunks: number;
    pageCount: number | null;
  };
  outputs: {
    resultJsonPath: string;
    outputMarkdownPath: string;
  };
};

const ICONS = {
  alert: AlertTriangle,
  brief: FileCheck2,
  candidates: Users,
  check: Check,
  compliance: ShieldCheck,
  dashboard: Gauge,
  database: Database,
  download: Download,
  evidence: FileSearch,
  file: FileText,
  home: Home,
  library: Library,
  mic: Mic,
  moss: Network,
  queries: Search,
  ranking: BarChart3,
  refresh: RefreshCw,
  runs: ClipboardCheck,
  shield: ShieldAlert,
  sliders: SlidersHorizontal,
  summary: BookOpenCheck,
  target: Target,
  upload: Upload,
} satisfies Record<string, DashboardIcon>;

const navGroups: Array<{
  group: string;
  items: Array<{ key: ScreenKey; label: string; icon: IconName; count?: string; tone?: Tone }>;
}> = [
  {
    group: 'Library',
    items: [
      { key: 'protocols', label: 'Protocols', icon: 'library' },
      { key: 'runs', label: 'Processing runs', icon: 'runs' },
    ],
  },
  {
    group: 'Pipeline',
    items: [
      { key: 'overview', label: 'Run overview', icon: 'dashboard' },
      { key: 'brief', label: 'Protocol brief', icon: 'brief' },
      { key: 'queries', label: 'Search queries', icon: 'queries' },
      { key: 'evidence', label: 'Evidence', icon: 'evidence' },
      { key: 'candidates', label: 'KOL candidates', icon: 'candidates' },
      { key: 'ranking', label: 'Ranking', icon: 'sliders' },
    ],
  },
  {
    group: 'Governance',
    items: [
      { key: 'compliance', label: 'Compliance review', icon: 'shield', tone: 'risk' },
      { key: 'moss', label: 'Moss index', icon: 'moss', tone: 'compliance' },
      { key: 'summary', label: 'Summary / export', icon: 'summary' },
    ],
  },
];

const demoProtocols: DashboardProtocol[] = [
  {
    id: 'RSV-PreF-301',
    nct: 'NCT05...421',
    run: 'run_8f2a91',
    title: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults Aged 60+',
    sponsor: 'Veritan Biologics',
    phase: '3',
    indication: 'RSV / LRTD',
    geo: ['US', 'EU', 'JP', 'AU'],
    enrollment: '24,800',
    status: 'Ready for review',
    statusTone: 'accent' as Tone,
    updated: '2026-06-06 09:42 UTC',
    active: true,
    stages: [
      { key: 'parsed', label: 'Parsed', state: 'done', detail: '312 chunks' },
      { key: 'brief', label: 'Brief Extracted', state: 'done', detail: '12 sections' },
      { key: 'queries', label: 'Queries Generated', state: 'done', detail: '7 groups' },
      { key: 'evidence', label: 'Evidence Retrieved', state: 'done', detail: '148 sources' },
      { key: 'kols', label: 'KOLs Extracted', state: 'done', detail: '64 candidates' },
      { key: 'ranked', label: 'Ranked', state: 'done', detail: '64 scored' },
      { key: 'moss', label: 'Indexed in Moss', state: 'warn', detail: '3 retrying' },
      { key: 'review', label: 'Ready for Review', state: 'active', detail: 'Awaiting sign-off' },
    ] satisfies Stage[],
  },
  {
    id: 'ONC-KRAS-204',
    nct: 'NCT06...118',
    run: 'run_7c1e08',
    title: 'A Phase 2 Study of a KRAS G12C Inhibitor in Previously Treated NSCLC',
    sponsor: 'Helix Oncology',
    phase: '2',
    indication: 'NSCLC / KRAS G12C',
    geo: ['US', 'EU'],
    enrollment: '410',
    status: 'Ranking in progress',
    statusTone: 'evidence' as Tone,
    updated: '14 min ago',
    active: false,
    stages: [
      { key: 'parsed', label: 'Parsed', state: 'done', detail: '268 chunks' },
      { key: 'brief', label: 'Brief Extracted', state: 'done', detail: '12 sections' },
      { key: 'queries', label: 'Queries Generated', state: 'done', detail: '6 groups' },
      { key: 'evidence', label: 'Evidence Retrieved', state: 'done', detail: '96 sources' },
      { key: 'kols', label: 'KOLs Extracted', state: 'done', detail: '41 candidates' },
      { key: 'ranked', label: 'Ranked', state: 'active', detail: 'Scoring 41...' },
      { key: 'moss', label: 'Indexed in Moss', state: 'pending', detail: 'Queued' },
      { key: 'review', label: 'Ready for Review', state: 'pending', detail: 'Pending' },
    ] satisfies Stage[],
  },
  {
    id: 'NEU-AD-118',
    nct: 'NCT06...552',
    run: 'run_6b9d77',
    title: "A Phase 2 Study of an Anti-Amyloid Antibody in Early Alzheimer's Disease",
    sponsor: 'Cortexa Therapeutics',
    phase: '2',
    indication: "Early Alzheimer's",
    geo: ['US'],
    enrollment: '720',
    status: 'Retrieving evidence',
    statusTone: 'evidence' as Tone,
    updated: '3 h ago',
    active: false,
    stages: [
      { key: 'parsed', label: 'Parsed', state: 'done', detail: '301 chunks' },
      { key: 'brief', label: 'Brief Extracted', state: 'done', detail: '12 sections' },
      { key: 'queries', label: 'Queries Generated', state: 'done', detail: '7 groups' },
      { key: 'evidence', label: 'Evidence Retrieved', state: 'active', detail: '52 / 110 sources' },
      { key: 'kols', label: 'KOLs Extracted', state: 'pending', detail: 'Pending' },
      { key: 'ranked', label: 'Ranked', state: 'pending', detail: 'Pending' },
      { key: 'moss', label: 'Indexed in Moss', state: 'pending', detail: 'Pending' },
      { key: 'review', label: 'Ready for Review', state: 'pending', detail: 'Pending' },
    ] satisfies Stage[],
  },
  {
    id: 'IMM-PSO-330',
    nct: 'NCT06...907',
    run: null,
    title: 'A Phase 3 Study of an IL-23 Inhibitor in Moderate-to-Severe Plaque Psoriasis',
    sponsor: 'Aurelia Bio',
    phase: '3',
    indication: 'Plaque psoriasis',
    geo: ['EU', 'JP'],
    enrollment: '1,150',
    status: 'Queued',
    statusTone: 'neutral' as Tone,
    updated: 'yesterday',
    active: false,
    stages: [
      { key: 'parsed', label: 'Parsed', state: 'pending', detail: 'Queued' },
      { key: 'brief', label: 'Brief Extracted', state: 'pending', detail: 'Pending' },
      { key: 'queries', label: 'Queries Generated', state: 'pending', detail: 'Pending' },
      { key: 'evidence', label: 'Evidence Retrieved', state: 'pending', detail: 'Pending' },
      { key: 'kols', label: 'KOLs Extracted', state: 'pending', detail: 'Pending' },
      { key: 'ranked', label: 'Ranked', state: 'pending', detail: 'Pending' },
      { key: 'moss', label: 'Indexed in Moss', state: 'pending', detail: 'Pending' },
      { key: 'review', label: 'Ready for Review', state: 'pending', detail: 'Pending' },
    ] satisfies Stage[],
  },
];

const runs = [
  {
    id: 'run_8f2a91',
    protocol: 'RSV-PreF-301',
    started: '2026-06-06 09:12',
    duration: '30m',
    stage: 'Ready for review',
    state: 'warn' as State,
    by: 'a.okoye',
  },
  {
    id: 'run_8f2a44',
    protocol: 'RSV-PreF-301',
    started: '2026-06-04 14:03',
    duration: '28m',
    stage: 'Completed',
    state: 'done' as State,
    by: 'system',
  },
  {
    id: 'run_7c1e08',
    protocol: 'ONC-KRAS-204',
    started: '2026-06-06 08:20',
    duration: '-',
    stage: 'Ranking',
    state: 'active' as State,
    by: 'm.singh',
  },
  {
    id: 'run_6b9d77',
    protocol: 'NEU-AD-118',
    started: '2026-06-06 06:55',
    duration: '-',
    stage: 'Evidence retrieval',
    state: 'active' as State,
    by: 'system',
  },
];

const statusCards = [
  {
    key: 'kols',
    label: 'KOLs found',
    value: '64',
    sub: '18 shortlisted',
    tone: 'accent' as Tone,
    icon: 'candidates' as IconName,
    screen: 'candidates' as ScreenKey,
  },
  {
    key: 'evidence',
    label: 'Evidence sources',
    value: '148',
    sub: 'across 6 source types',
    tone: 'evidence' as Tone,
    icon: 'evidence' as IconName,
    screen: 'evidence' as ScreenKey,
  },
  {
    key: 'missing',
    label: 'Missing-data warnings',
    value: '5',
    sub: '2 affect ranking',
    tone: 'compliance' as Tone,
    icon: 'alert' as IconName,
    screen: 'brief' as ScreenKey,
  },
  {
    key: 'flags',
    label: 'Compliance flags',
    value: '2',
    sub: 'open / reviewer required',
    tone: 'risk' as Tone,
    icon: 'shield' as IconName,
    screen: 'compliance' as ScreenKey,
  },
  {
    key: 'moss',
    label: 'Moss index',
    value: '97%',
    sub: '3 chunks retrying',
    tone: 'compliance' as Tone,
    icon: 'database' as IconName,
    screen: 'moss' as ScreenKey,
  },
];

const brief = [
  {
    section: 'Study title',
    value: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults Aged 60+',
    confidence: 99,
    chunk: 'Section 1.1 / p.1',
    status: 'validated',
  },
  {
    section: 'Indication',
    value: 'Respiratory Syncytial Virus - lower respiratory tract disease',
    confidence: 96,
    chunk: 'Section 2.1 / p.4',
    status: 'validated',
  },
  {
    section: 'Intervention',
    value: 'Bivalent RSV prefusion-F subunit vaccine, single intramuscular dose',
    confidence: 95,
    chunk: 'Section 3.2 / p.9',
    status: 'validated',
  },
  {
    section: 'Patient population',
    value: 'Community-dwelling, immunocompetent adults aged 60+',
    confidence: 94,
    chunk: 'Section 4.1 / p.13',
    status: 'validated',
  },
  {
    section: 'Primary endpoint',
    value: 'Vaccine efficacy against RSV-confirmed LRTD with at least two signs',
    confidence: 97,
    chunk: 'Section 6.1 / p.22',
    status: 'validated',
  },
  {
    section: 'Relevant specialties',
    value: 'Vaccinology / Infectious Disease / Geriatric Medicine / Pulmonology',
    confidence: 72,
    chunk: 'Derived',
    status: 'review',
  },
];

const queryGroups = [
  {
    name: 'Disease state + trial investigator',
    status: 'approved',
    results: 41,
    sources: 'ClinicalTrials.gov, PubMed',
    queries: [
      '"RSV" AND "lower respiratory tract disease" AND principal investigator',
      'RSV prefusion vaccine trial investigator adults 60+',
    ],
  },
  {
    name: 'Intervention class + publication author',
    status: 'edited',
    results: 53,
    sources: 'PubMed',
    queries: ['prefusion F subunit vaccine author', 'AS01 adjuvant RSV immunogenicity author'],
  },
  {
    name: 'Endpoint keywords + expert',
    status: 'approved',
    results: 34,
    sources: 'PubMed, congress pages',
    queries: ['neutralizing titers RSV day 30 expert', 'RSV-confirmed LRTD efficacy author'],
  },
  {
    name: 'Congress speakers',
    status: 'regenerating',
    results: null,
    sources: 'Congress pages',
    queries: ['IDWeek RSV session speaker 2024-2025', 'ESWI RSV symposium faculty'],
  },
];

const evidence = [
  {
    id: 'e1',
    type: 'Publication',
    title: 'Efficacy of a bivalent RSV prefusion F vaccine in older adults',
    host: 'N Engl J Med',
    date: '2024-03',
    score: 96,
    strength: 'strong',
    snippet:
      'A single dose conferred efficacy against RSV-confirmed LRTD with at least two signs in adults aged 60 years or older.',
    kols: ['Dr. Elena Marchetti'],
  },
  {
    id: 'e2',
    type: 'Publication',
    title: 'Neutralizing antibody responses to RSV prefusion F immunization',
    host: 'Lancet Infect Dis',
    date: '2023-11',
    score: 91,
    strength: 'strong',
    snippet:
      'Day-30 neutralizing titers rose against RSV-A and RSV-B subgroups after prefusion-F immunization.',
    kols: ['Prof. Hideo Tanaka', 'Dr. Elena Marchetti'],
  },
  {
    id: 'e3',
    type: 'Trial registry',
    title: 'Phase 3 RSV prefusion-F efficacy study - site investigators',
    host: 'ClinicalTrials.gov',
    date: '2022-08',
    score: 89,
    strength: 'strong',
    snippet:
      'Listed as coordinating principal investigator across 14 EU sites for the pivotal efficacy cohort.',
    kols: ['Dr. Elena Marchetti'],
  },
  {
    id: 'e4',
    type: 'Guideline',
    title: 'Immunization of older adults against RSV - advisory statement',
    host: 'ACIP / society',
    date: '2024-06',
    score: 84,
    strength: 'moderate',
    snippet:
      'Contributing author to the working group recommendation on RSV vaccination for adults 60+.',
    kols: ['Dr. Amara Okonkwo'],
  },
  {
    id: 'e5',
    type: 'Congress',
    title: 'IDWeek 2025 - RSV in the aging immune system',
    host: 'IDWeek',
    date: '2025-10',
    score: 78,
    strength: 'moderate',
    snippet:
      'Invited faculty; presented on immunosenescence and prefusion-F durability in older adults.',
    kols: ['Prof. Hideo Tanaka'],
  },
];

const candidates = [
  {
    id: 'marchetti',
    rank: 1,
    name: 'Dr. Elena Marchetti',
    institution: 'Karolinska Institutet',
    specialty: 'Vaccinology',
    geo: 'EU / Sweden',
    score: 92.4,
    sources: 37,
    flags: 0,
    status: 'validated',
    rationale:
      "Direct Phase 3 prefusion-F trial leadership and authorship on the protocol's primary efficacy endpoint.",
    dimensions: [19.2, 24.0, 18.5, 9.4, 12.8, 8.5],
  },
  {
    id: 'tanaka',
    rank: 2,
    name: 'Prof. Hideo Tanaka',
    institution: 'University of Tokyo',
    specialty: 'Infectious Disease',
    geo: 'APAC / Japan',
    score: 88.1,
    sources: 29,
    flags: 1,
    status: 'review',
    rationale:
      'Related adult RSV Phase 3 experience and a strong publication record on the immunogenicity endpoint.',
    dimensions: [18.1, 20.0, 19.0, 8.6, 13.4, 9.0],
  },
  {
    id: 'okonkwo',
    rank: 3,
    name: 'Dr. Amara Okonkwo',
    institution: 'Johns Hopkins',
    specialty: 'Geriatric Medicine',
    geo: 'US',
    score: 84.6,
    sources: 22,
    flags: 0,
    status: 'validated',
    rationale:
      'Authored geriatric immunization guidance relevant to the 60+ population and related LRTD research.',
    dimensions: [17.4, 17.5, 17.6, 9.0, 14.1, 9.0],
  },
  {
    id: 'andersson',
    rank: 4,
    name: 'Dr. Lars Andersson',
    institution: 'Lund University',
    specialty: 'Vaccinology',
    geo: 'EU / Sweden',
    score: 81.2,
    sources: 19,
    flags: 0,
    status: 'validated',
    rationale: 'Authored durability and booster-interval modeling for prefusion-F responses.',
    dimensions: [16.8, 16.0, 18.0, 8.0, 11.4, 11.0],
  },
  {
    id: 'delacroix',
    rank: 5,
    name: 'Prof. Marie Delacroix',
    institution: 'Institut Pasteur',
    specialty: 'Pulmonology',
    geo: 'EU / France',
    score: 76.8,
    sources: 14,
    flags: 1,
    status: 'review',
    rationale:
      'Characterized lower-respiratory sequelae relevant to the endpoint; below two-source threshold.',
    dimensions: [15.0, 12.0, 16.5, 7.8, 10.5, 8.0],
  },
];

const rankingDimensions = [
  { label: 'Protocol match', weight: '20%' },
  { label: 'Trial investigator experience', weight: '25%' },
  { label: 'Publication relevance', weight: '20%' },
  { label: 'Institution / site relevance', weight: '10%' },
  { label: 'Guideline / congress influence', weight: '15%' },
  { label: 'Recency', weight: '10%' },
];

const guardrails = [
  { label: 'No promotional language', ok: true },
  { label: 'Do not rank by prescribing volume', ok: true },
  { label: 'No investigational safety or efficacy claims', ok: true },
  { label: 'Frame outreach as non-promotional scientific exchange', ok: true },
  { label: 'Every recommendation carries supporting evidence', ok: false },
];

const complianceFlags = [
  {
    severity: 'high',
    kol: 'Dr. Grace Mwangi',
    type: 'Transparency / payment note',
    detail:
      'Open Payments record indicates a consulting relationship in the indication area. Disclose and route to reviewer before outreach.',
    status: 'open',
  },
  {
    severity: 'medium',
    kol: 'Prof. Marie Delacroix',
    type: 'Missing source citation',
    detail:
      'Ranking rationale references trial sequelae, but the linked evidence count is below the two-source threshold.',
    status: 'open',
  },
  {
    severity: 'low',
    kol: 'Prof. Hideo Tanaka',
    type: 'Unsupported phrasing',
    detail:
      'Draft brief used "leading expert"; rewritten to "scientifically relevant, evidence-supported".',
    status: 'resolved',
  },
];

const mossAssets = [
  { label: 'Protocol chunks', chunks: 312, embedded: 312, failed: 0, state: 'done' as State },
  { label: 'Evidence chunks', chunks: 148, embedded: 148, failed: 0, state: 'done' as State },
  { label: 'KOL profiles', chunks: 64, embedded: 61, failed: 3, state: 'error' as State },
  { label: 'Ranking metadata', chunks: 64, embedded: 64, failed: 0, state: 'done' as State },
  { label: 'Source citations', chunks: 148, embedded: 148, failed: 0, state: 'done' as State },
];

const exports = [
  {
    fmt: 'PDF',
    label: 'Review packet',
    desc: 'Brief, top KOLs, evidence appendix, and compliance notes.',
  },
  {
    fmt: 'CSV',
    label: 'Candidates',
    desc: 'All 64 candidates with scores and source counts.',
  },
  {
    fmt: 'JSON',
    label: 'Structured export',
    desc: 'Brief, queries, evidence, ranking, and audit trail.',
  },
];

const voiceQa = [
  {
    q: 'Why is Dr. Marchetti ranked #1?',
    a: 'Dr. Elena Marchetti scores 92.4 because she was coordinating principal investigator across 14 EU sites and first-authored evidence on the protocol primary LRTD endpoint in adults 60+.',
    chips: ['3 citations', 'Guardrail check passed'],
  },
  {
    q: 'Which KOLs have direct Phase 3 trial experience?',
    a: 'Two candidates have direct Phase 3 prefusion-F experience: Dr. Marchetti and Prof. Tanaka. Dr. Okonkwo is relevant through geriatric immunization guidance but no pivotal trial role was found.',
    chips: ['2 citations', 'Scientific relevance only'],
  },
  {
    q: 'Draft a compliant MSL pre-call brief for Dr. Tanaka',
    a: 'Generated a non-promotional pre-call brief with related trial experience, recent immunogenicity publications, suggested scientific-exchange topics, and source-linked claims.',
    chips: ['Non-promotional', 'Audit logged'],
  },
];

const demoPipelineData: DashboardPipelineData = {
  isReady: true,
  analysisSource: 'demo_fixture',
  isFallback: false,
  fallbackReason: null,
  analysisError: null,
  statusCards,
  brief,
  queryGroups,
  evidence,
  candidates,
  rankingDimensions,
  guardrails,
  complianceFlags,
  mossAssets,
  exports,
  voiceQa,
};

function navCount(screen: ScreenKey, pipelineData: DashboardPipelineData) {
  switch (screen) {
    case 'evidence':
      return `${pipelineData.evidence.length}`;
    case 'candidates':
      return `${pipelineData.candidates.length}`;
    case 'compliance':
      return `${pipelineData.complianceFlags.filter((flag) => flag.status !== 'resolved').length}`;
    case 'moss': {
      const total = pipelineData.mossAssets.reduce((sum, asset) => sum + asset.chunks, 0);
      const embedded = pipelineData.mossAssets.reduce((sum, asset) => sum + asset.embedded, 0);
      return total ? `${Math.round((embedded / total) * 100)}%` : '0';
    }
    default:
      return null;
  }
}

function IconToken({ name, size = 16 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} aria-hidden="true" />;
}

function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: Tone | State | string;
  children: ReactNode;
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function ActionButton({
  children,
  variant = 'secondary',
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`action action--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ScreenHead({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actions?: ReactNode;
}) {
  return (
    <div className="shead">
      <div>
        <div className="shead__ey">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {actions ? <div className="shead__actions">{actions}</div> : null}
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  actions,
  children,
  noBody = false,
}: {
  eyebrow?: string;
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  noBody?: boolean;
}) {
  return (
    <section className="panel">
      {title || actions ? (
        <div className="panel__head">
          <div>
            {eyebrow ? <div className="panel__eyebrow">{eyebrow}</div> : null}
            {title ? <div className="panel__title">{title}</div> : null}
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </div>
      ) : null}
      {noBody ? children : <div className="panel__body">{children}</div>}
    </section>
  );
}

function Note({ tone, icon, children }: { tone: Tone; icon: IconName; children: ReactNode }) {
  return (
    <div className={`note note--${tone}`}>
      <IconToken name={icon} />
      <div>{children}</div>
    </div>
  );
}

function MiniBar({
  value,
  max = 100,
  tone = 'evidence',
}: {
  value: number;
  max?: number;
  tone?: Tone;
}) {
  return (
    <span className="mbar">
      <span className="mbar__track">
        <span
          className={`mbar__fill mbar__fill--${tone}`}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
      </span>
      <span className="mbar__value">{value}</span>
    </span>
  );
}

function StageDot({ state }: { state: State }) {
  return (
    <span className={`stage-dot stage-dot--${state}`}>
      {state === 'done' ? <Check size={11} aria-hidden="true" /> : null}
      {state === 'warn' || state === 'error' ? (
        <AlertTriangle size={10} aria-hidden="true" />
      ) : null}
      {state === 'active' ? <span /> : null}
    </span>
  );
}

const ACCEPTED_PROTOCOL_EXTENSIONS = ['pdf'];
const MAX_PROTOCOL_MB = 100;
const PARSE_STEPS = [
  { label: 'Uploading PDF to KOL Copilot', count: 'stored' },
  { label: 'Submitting document to Unsiloed', count: 'job queued' },
  { label: 'Polling parse job', count: 'structured chunks' },
  { label: 'Writing chunks and artifacts', count: 'database + output files' },
];

function formatUploadSize(sizeMB: number) {
  return sizeMB >= 1 ? `${sizeMB.toFixed(1)} MB` : `${Math.max(1, Math.round(sizeMB * 1024))} KB`;
}

function UploadProtocolModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (result: UploadCompleteResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const alive = useRef(true);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [file, setFile] = useState<UploadProtocolFile | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadCompleteResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      alive.current = false;
      window.removeEventListener('keydown', handleKeyDown);
      timers.current.forEach(clearTimeout);
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [onClose]);

  const clearAsyncState = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const pushTimer = (timer: ReturnType<typeof setTimeout>) => {
    timers.current.push(timer);
    return timer;
  };

  const startUpload = async (candidate: File) => {
    clearAsyncState();
    setPhase('uploading');
    setProgress(0);
    setStepIndex(0);
    setUploadResult(null);

    const ext = candidate.name.split('.').pop()?.toLowerCase() ?? '';
    const sizeMB = candidate.size / (1024 * 1024);

    if (!ACCEPTED_PROTOCOL_EXTENSIONS.includes(ext)) {
      setError(`"${candidate.name}" is not a supported format. Upload a PDF protocol.`);
      setPhase('invalid');
      return;
    }

    if (sizeMB > MAX_PROTOCOL_MB) {
      setError(
        `"${candidate.name}" is ${formatUploadSize(sizeMB)} - over the ${MAX_PROTOCOL_MB} MB limit.`
      );
      setPhase('invalid');
      return;
    }

    setError('');
    setFile({ name: candidate.name, sizeMB, ext });

    pushTimer(setTimeout(() => alive.current && setPhase('parsing'), 650));
    PARSE_STEPS.forEach((_, index) => {
      pushTimer(
        setTimeout(
          () => {
            if (alive.current) {
              setStepIndex(Math.min(index, PARSE_STEPS.length - 1));
            }
          },
          700 + index * 1300
        )
      );
    });
    progressTimer.current = setInterval(() => {
      setProgress((current) => Math.min(92, current + 5));
    }, 350);

    try {
      const body = new FormData();
      body.append('file', candidate);

      const response = await fetch('/api/protocols/upload', {
        method: 'POST',
        body,
      });
      const payload = (await response.json().catch(() => null)) as
        | (UploadCompleteResult & { error?: string })
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? `Upload failed with ${response.status}`);
      }

      if (!payload?.protocol?.protocolCode || !payload?.run?.runKey) {
        throw new Error('Upload completed, but the server response was missing protocol metadata.');
      }

      if (!alive.current) {
        return;
      }

      clearAsyncState();
      setProgress(100);
      setStepIndex(PARSE_STEPS.length);
      setUploadResult(payload);
      setPhase('ready');
    } catch (caught) {
      if (!alive.current) {
        return;
      }

      clearAsyncState();
      setProgress(0);
      setError(caught instanceof Error ? caught.message : 'Upload failed.');
      setPhase('error');
    }
  };

  const acceptBrowserFile = (candidate?: File | null) => {
    if (!candidate) {
      return;
    }

    void startUpload(candidate);
  };

  const openPicker = () => inputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptBrowserFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDrag(false);
    acceptBrowserFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openPicker();
  };

  return (
    <div
      className="umodal-scrim"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="umodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="umodal__head">
          <span className="umi">
            <Upload size={17} />
          </span>
          <div className="umodal__copy">
            <h2 id="upload-title">Upload protocol</h2>
            <div className="sub">
              {phase === 'ready'
                ? 'Parsed / ready to start run'
                : phase === 'parsing'
                  ? 'Extracting protocol intelligence...'
                  : phase === 'uploading'
                    ? 'Uploading...'
                    : 'Phase 3 clinical protocol / PDF'}
            </div>
          </div>
          <button
            type="button"
            className="iconbtn"
            aria-label="Close upload modal"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="umodal__body">
          {(phase === 'idle' || phase === 'invalid' || phase === 'error') && (
            <>
              <div
                className={`dropzone${drag ? 'is-drag' : ''}${phase === 'invalid' || phase === 'error' ? 'is-error' : ''}`}
                role="button"
                tabIndex={0}
                onClick={openPicker}
                onKeyDown={handleKeyDown}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDrag(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDrag(false);
                }}
                onDrop={handleDrop}
              >
                <span className="dropzone__ic">
                  {phase === 'invalid' || phase === 'error' ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <Upload size={22} />
                  )}
                </span>
                <h3>
                  {drag ? (
                    'Drop to begin parsing'
                  ) : (
                    <>
                      Drag & drop, or <b>browse</b>
                    </>
                  )}
                </h3>
                <p>Parsing starts on upload and the result is stored with the processing run.</p>
                <div className="formats">PDF / max {MAX_PROTOCOL_MB} MB / single file</div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </div>

              {phase === 'invalid' || phase === 'error' ? (
                <div className="umodal__note">
                  <Note tone="risk" icon="alert">
                    {error}
                  </Note>
                </div>
              ) : null}
            </>
          )}

          {phase === 'uploading' && file ? (
            <>
              <div className="ufile">
                <span className="ufile__ic">{file.ext.toUpperCase().slice(0, 3)}</span>
                <div className="ufile__copy">
                  <div className="ufile__nm">{file.name}</div>
                  <div className="ufile__meta">
                    {formatUploadSize(file.sizeMB)} / uploading {progress}%
                  </div>
                </div>
                <span className="spinner" />
              </div>
              <div className="uprog">
                <i style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : null}

          {phase === 'parsing' && file ? (
            <>
              <div className="ufile">
                <span className="ufile__ic">{file.ext.toUpperCase().slice(0, 3)}</span>
                <div className="ufile__copy">
                  <div className="ufile__nm">{file.name}</div>
                  <div className="ufile__meta">{formatUploadSize(file.sizeMB)} / uploaded</div>
                </div>
                <Badge tone="safe">Uploaded</Badge>
              </div>
              <div className="usteps">
                {PARSE_STEPS.map((step, index) => {
                  const state =
                    index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending';
                  return (
                    <div key={step.label} className={`ustep ustep--${state}`}>
                      <span className="ustep__dot">
                        {state === 'done' ? <Check size={12} /> : null}
                        {state === 'active' ? <span className="spinner spinner--small" /> : null}
                      </span>
                      <span className="ustep__lab">{step.label}</span>
                      {state === 'done' ? <span className="ustep__ct">{step.count}</span> : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {phase === 'ready' ? (
            <>
              <Note tone="safe" icon="check">
                Protocol parsed into {uploadResult?.unsiloed.totalChunks ?? 0} chunks and saved to
                the database. Unsiloed artifacts were written to result.json and output.md.
              </Note>
              <div className="uprev">
                <div className="full">
                  <dt>Study title</dt>
                  <dd>{uploadResult?.protocol.title ?? 'Uploaded protocol'}</dd>
                </div>
                <div>
                  <dt>Sponsor</dt>
                  <dd>{uploadResult?.protocol.sponsor ?? 'Needs review'}</dd>
                </div>
                <div>
                  <dt>Phase</dt>
                  <dd>
                    {uploadResult?.protocol.phase
                      ? `Phase ${uploadResult.protocol.phase}`
                      : 'Needs review'}
                  </dd>
                </div>
                <div>
                  <dt>Indication</dt>
                  <dd>{uploadResult?.protocol.indication ?? 'Needs review'}</dd>
                </div>
                <div>
                  <dt>Unsiloed job</dt>
                  <dd>{uploadResult?.unsiloed.jobId ?? '-'}</dd>
                </div>
                <div className="full">
                  <dt>Stored output</dt>
                  <dd>{uploadResult?.outputs.outputMarkdownPath ?? '-'}</dd>
                </div>
              </div>
              <div className="umodal__note">
                <Note tone="compliance" icon="alert">
                  Inferred protocol fields are marked for Medical Affairs review before downstream
                  evidence retrieval or MSL brief generation.
                </Note>
              </div>
            </>
          ) : null}
        </div>

        <div className="umodal__foot">
          {phase === 'ready' ? (
            <>
              <ShieldCheck size={14} className="foot-muted-icon" />
              <span className="foot-note">
                DB persisted / chunks queued for Moss / audit logged
              </span>
              <ActionButton onClick={onClose}>Cancel</ActionButton>
              <ActionButton
                variant="primary"
                onClick={() => {
                  if (uploadResult) {
                    onComplete(uploadResult);
                  }
                }}
              >
                <Target size={14} />
                Open protocol
              </ActionButton>
            </>
          ) : phase === 'uploading' || phase === 'parsing' ? (
            <>
              <span className="foot-note">
                {phase === 'uploading'
                  ? 'Transferring...'
                  : 'Unsiloed parsing can take a few minutes...'}
              </span>
              <ActionButton onClick={onClose}>Cancel</ActionButton>
            </>
          ) : (
            <>
              <ShieldCheck size={14} className="foot-muted-icon" />
              <span className="foot-note">
                Non-promotional / stored under this Medical Affairs workspace
              </span>
              <ActionButton onClick={onClose}>Cancel</ActionButton>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ProtocolHeader({
  activeProtocol,
  protocols,
  protocolId,
  setProtocolId,
  voiceOpen,
  setVoiceOpen,
  voiceCallState,
}: {
  activeProtocol: DashboardProtocol;
  protocols: DashboardProtocol[];
  protocolId: string;
  setProtocolId: (id: string) => void;
  voiceOpen: boolean;
  setVoiceOpen: (open: boolean) => void;
  voiceCallState: VoiceCallState;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const voiceLabel =
    voiceCallState === 'live'
      ? 'Call live'
      : voiceCallState === 'starting'
        ? 'Starting'
        : voiceCallState === 'error'
          ? 'Voice error'
          : voiceCallState === 'ended'
            ? 'Call ended'
            : voiceOpen
              ? 'Voice on'
              : 'Ask copilot';

  return (
    <div className="phead">
      <div className="phead__main">
        <div className="phead__topline">
          <div className="pswitch">
            <button
              type="button"
              className="pswitch__btn"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span>{activeProtocol.id}</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            {menuOpen ? (
              <div className="pmenu">
                <div className="pmenu__head">Switch protocol</div>
                {protocols.map((protocol) => (
                  <button
                    key={protocol.id}
                    type="button"
                    className="pmenu__item"
                    aria-current={protocol.id === protocolId}
                    onClick={() => {
                      setProtocolId(protocol.id);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="pmenu__tick">
                      {protocol.id === protocolId ? <Check size={14} /> : null}
                    </span>
                    <span className="pmenu__copy">
                      <span className="pmenu__id">{protocol.id}</span>
                      <span className="pmenu__meta">
                        {protocol.sponsor} / Ph {protocol.phase} / {protocol.indication}
                      </span>
                    </span>
                    <Badge tone={protocol.statusTone}>{protocol.status}</Badge>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <span className="phead__nct">{activeProtocol.nct}</span>
        </div>
        <div className="phead__title">{activeProtocol.title}</div>
        <div className="tagrow">
          <span className="tag">Sponsor: {activeProtocol.sponsor}</span>
          <span className="tag tag--accent">Phase {activeProtocol.phase}</span>
          <span className="tag">Indication: {activeProtocol.indication}</span>
          <span className="tag">Geo: {activeProtocol.geo.join(' / ')}</span>
          <span className="tag">Enroll: {activeProtocol.enrollment}</span>
        </div>
      </div>
      <div className="phead__right">
        <button
          type="button"
          className={`voicebtn${voiceOpen ? 'is-on' : ''}`}
          aria-pressed={voiceOpen}
          onClick={() => setVoiceOpen(!voiceOpen)}
        >
          <Mic size={15} />
          {voiceLabel}
        </button>
        <Badge tone={activeProtocol.statusTone}>{activeProtocol.status}</Badge>
        <div className="phead__ts">Updated {activeProtocol.updated}</div>
      </div>
    </div>
  );
}

function StageRail({ stages }: { stages: Stage[] }) {
  return (
    <div className="stages">
      {stages.map((stage) => (
        <div key={stage.key} className={`stage stage--${stage.state}`}>
          <StageDot state={stage.state} />
          <span className="stage__txt">
            <span className="stage__name">{stage.label}</span>
            <span className="stage__detail">{stage.detail}</span>
          </span>
          <span className="stage__line" />
        </div>
      ))}
    </div>
  );
}

function OverviewScreen({
  activeProtocol,
  go,
  pipelineData,
  analysisRunning,
  analysisError,
  parseRefreshRunning,
  parseRefreshError,
  onRefreshParsedData,
  onRunAgenticAnalysis,
}: {
  activeProtocol: DashboardProtocol;
  go: (screen: ScreenKey) => void;
  pipelineData: DashboardPipelineData;
  analysisRunning: boolean;
  analysisError: string;
  parseRefreshRunning: boolean;
  parseRefreshError: string;
  onRefreshParsedData: () => void;
  onRunAgenticAnalysis: () => void;
}) {
  const visibleAnalysisError =
    parseRefreshError || analysisError || pipelineData.analysisError || '';

  return (
    <div className="page">
      <ScreenHead
        eyebrow={`Processing run / ${activeProtocol.run ?? 'queued'}`}
        title="Run overview"
        desc={`Protocol-aware processing for ${activeProtocol.id}. Current status: ${activeProtocol.status}.`}
        actions={
          <>
            <ActionButton onClick={onRefreshParsedData} disabled={parseRefreshRunning}>
              <RefreshCw size={14} />
              {parseRefreshRunning ? 'Pulling parse' : 'Pull Unsiloed result'}
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={onRunAgenticAnalysis}
              disabled={analysisRunning || parseRefreshRunning}
            >
              {analysisRunning ? <RefreshCw size={14} /> : <Target size={14} />}
              {analysisRunning ? 'Running analysis' : 'Run Agentic Analysis'}
            </ActionButton>
            <ActionButton onClick={() => go('summary')}>
              <Download size={14} />
              Export summary
            </ActionButton>
          </>
        }
      />
      {visibleAnalysisError ? (
        <div className="stack stack--tight">
          <Note tone="risk" icon="alert">
            {visibleAnalysisError}
          </Note>
        </div>
      ) : null}
      {pipelineData.isFallback ? (
        <div className="stack stack--tight">
          <Note tone="compliance" icon="alert">
            Demo fallback data is visible because fallback analysis mode is enabled. These KOLs are
            not presented as researched OpenAI Agents SDK output.
          </Note>
        </div>
      ) : null}
      <div className="statgrid">
        {pipelineData.statusCards.map((card) => (
          <button key={card.key} type="button" className="stat" onClick={() => go(card.screen)}>
            <span className={`stat__ic stat__ic--${card.tone}`}>
              <IconToken name={card.icon} />
            </span>
            <span className="stat__lab">{card.label}</span>
            <span className="stat__val">{card.value}</span>
            <span className="stat__sub">{card.sub}</span>
          </button>
        ))}
      </div>
      <div className="cols cols--2">
        <Panel
          eyebrow="Pipeline"
          title="Workflow stages"
          actions={<Badge tone="warn">2 items need attention</Badge>}
        >
          <div className="stage-list">
            {activeProtocol.stages.map((stage) => (
              <div key={stage.key} className="stage-row">
                <StageDot state={stage.state} />
                <div>
                  <div className="stage-row__label">{stage.label}</div>
                  <div className="stage-row__detail">{stage.detail}</div>
                </div>
                <Badge tone={stage.state}>
                  {stage.state === 'done'
                    ? 'Complete'
                    : stage.state === 'warn'
                      ? 'Warnings'
                      : stage.state === 'active'
                        ? 'In review'
                        : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
        <div className="stack">
          <Panel eyebrow="Attention" title="Needs your review">
            <div className="stack stack--tight">
              <Note tone="risk" icon="shield">
                2 open compliance flags: a transparency note and one sub-threshold evidence count.
                <button type="button" className="link-button" onClick={() => go('compliance')}>
                  Open compliance review
                </button>
              </Note>
              <Note tone="compliance" icon="database">
                3 KOL profiles failed to embed in Moss and are retrying.
                <button type="button" className="link-button" onClick={() => go('moss')}>
                  Inspect index
                </button>
              </Note>
              <Note tone="compliance" icon="alert">
                5 missing-data warnings in the brief; 2 affect ranking.
                <button type="button" className="link-button" onClick={() => go('brief')}>
                  Review brief
                </button>
              </Note>
            </div>
          </Panel>
          <Panel eyebrow="Governance" title="Active guardrails">
            <GuardrailList guardrails={pipelineData.guardrails} />
          </Panel>
        </div>
      </div>
      <Panel
        eyebrow="Shortlist"
        title="Top protocol-matched KOLs"
        actions={<ActionButton onClick={() => go('ranking')}>Open ranking</ActionButton>}
      >
        {pipelineData.candidates.length ? (
          <div className="kolgrid">
            {pipelineData.candidates.slice(0, 3).map((candidate) => (
              <article key={candidate.id} className="kolcard">
                <div className="kolcard__top">
                  <span className="rank">0{candidate.rank}</span>
                  <div>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.institution}</p>
                  </div>
                  <strong>{candidate.score}</strong>
                </div>
                <div className="tagrow">
                  <span className="tag">{candidate.specialty}</span>
                  <span className="tag">{candidate.geo}</span>
                  <Badge tone={candidate.status === 'validated' ? 'safe' : 'compliance'}>
                    {candidate.status}
                  </Badge>
                </div>
                <p>{candidate.rationale}</p>
              </article>
            ))}
          </div>
        ) : (
          <Note tone="risk" icon="alert">
            {pipelineData.analysisError ??
              'No researched KOL candidates are available yet. Run Agentic Analysis to store valid OpenAI Agents SDK results.'}
          </Note>
        )}
      </Panel>
    </div>
  );
}

function ProtocolsScreen({
  activeProtocolId,
  protocols,
  protocolLoadError,
  setProtocolId,
  go,
}: {
  activeProtocolId: string;
  protocols: DashboardProtocol[];
  protocolLoadError?: string | null;
  setProtocolId: (id: string) => void;
  go: (screen: ScreenKey) => void;
}) {
  return (
    <div className="page page--wide">
      <ScreenHead
        eyebrow="Library"
        title="Protocols"
        desc="Select a protocol to scope the processing run, or upload a Phase 3 protocol to begin extraction."
        actions={
          <Link href="/dashboard?screen=protocols&upload=1" className="action action--primary">
            <Upload size={14} />
            Upload protocol
          </Link>
        }
      />
      {protocolLoadError ? (
        <Note tone="risk" icon="database">
          {protocolLoadError}
        </Note>
      ) : null}
      <Panel noBody>
        <table className="tbl">
          <thead>
            <tr>
              <th>Protocol ID</th>
              <th>Sponsor</th>
              <th>Phase</th>
              <th>Indication</th>
              <th>Geography</th>
              <th>Status</th>
              <th className="num">Updated</th>
            </tr>
          </thead>
          <tbody>
            {protocols.length > 0 ? (
              protocols.map((protocol) => (
                <tr
                  key={protocol.id}
                  aria-selected={protocol.id === activeProtocolId}
                  onClick={() => {
                    setProtocolId(protocol.id);
                    go('overview');
                  }}
                >
                  <td className="mono accent-text">{protocol.id}</td>
                  <td>{protocol.sponsor}</td>
                  <td className="mono">{protocol.phase}</td>
                  <td>{protocol.indication}</td>
                  <td className="mono muted">{protocol.geo.join(' / ')}</td>
                  <td>
                    <Badge tone={protocol.statusTone}>{protocol.status}</Badge>
                  </td>
                  <td className="num muted">{protocol.updated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="muted">
                  No protocols found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function RunsScreen({ go }: { go: (screen: ScreenKey) => void }) {
  return (
    <div className="page page--wide">
      <ScreenHead
        eyebrow="Activity"
        title="Processing runs"
        desc="Every orchestration run across the protocol library with stage, duration, and outcome."
        actions={
          <ActionButton>
            <RefreshCw size={14} />
            Refresh
          </ActionButton>
        }
      />
      <Panel noBody>
        <table className="tbl">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Protocol</th>
              <th>Started</th>
              <th className="num">Duration</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Triggered by</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                aria-selected={run.id === 'run_8f2a91'}
                onClick={() => go('overview')}
              >
                <td className="mono accent-text">{run.id}</td>
                <td className="mono">{run.protocol}</td>
                <td className="mono muted">{run.started}</td>
                <td className="num muted">{run.duration}</td>
                <td>{run.stage}</td>
                <td>
                  <Badge tone={run.state}>{run.state === 'active' ? 'Running' : run.state}</Badge>
                </td>
                <td className="mono muted">{run.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function BriefScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page">
      <ScreenHead
        eyebrow="Protocol parsing"
        title="Protocol brief"
        desc="Extracted study attributes used as the job description for retrieval, ranking, and compliant brief generation."
      />
      <Panel noBody>
        <table className="tbl">
          <thead>
            <tr>
              <th>Section</th>
              <th>Extracted value</th>
              <th>Confidence</th>
              <th>Source chunk</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pipelineData.brief.map((row) => (
              <tr key={row.section}>
                <td className="mono">{row.section}</td>
                <td>{row.value}</td>
                <td>
                  <MiniBar
                    value={row.confidence}
                    tone={row.confidence > 90 ? 'safe' : 'compliance'}
                  />
                </td>
                <td>
                  <button type="button" className="chunk">
                    <FileText size={10} />
                    {row.chunk}
                  </button>
                </td>
                <td>
                  <Badge tone={row.status === 'validated' ? 'safe' : 'compliance'}>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function QueriesScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page">
      <ScreenHead
        eyebrow="Retrieval plan"
        title="Search queries"
        desc="Protocol-derived query groups for trial registries, publications, congress activity, guidelines, and expert bios."
      />
      <div className="querygrid">
        {pipelineData.queryGroups.map((group) => (
          <Panel
            key={group.name}
            eyebrow={group.sources}
            title={group.name}
            actions={
              <Badge
                tone={
                  group.status === 'approved'
                    ? 'safe'
                    : group.status === 'edited'
                      ? 'evidence'
                      : 'accent'
                }
              >
                {group.status}
              </Badge>
            }
          >
            <div className="querycard">
              <div className="querycard__meta">
                <span>{group.results ?? 'running'} results</span>
              </div>
              {group.queries.map((query) => (
                <code key={query}>{query}</code>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function EvidenceScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page page--wide">
      <ScreenHead
        eyebrow="Evidence retrieval"
        title="Evidence"
        desc="Source snippets that support KOL relevance, ranking rationale, and generated MSL-ready outputs."
        actions={
          <div className="searchbox">
            <Search size={14} />
            <span>Search evidence</span>
          </div>
        }
      />
      <div className="cols cols--ev">
        <Panel noBody>
          <table className="tbl">
            <thead>
              <tr>
                <th>Source</th>
                <th>Evidence</th>
                <th>KOLs</th>
                <th className="num">Score</th>
              </tr>
            </thead>
            <tbody>
              {pipelineData.evidence.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="mono accent-text">{item.type}</div>
                    <div className="muted">{item.host}</div>
                    <div className="mono muted">{item.date}</div>
                  </td>
                  <td>
                    <div className="evidence-title">{item.title}</div>
                    <p className="evidence-snippet">{item.snippet}</p>
                    <Badge tone={item.strength === 'strong' ? 'safe' : 'evidence'}>
                      {item.strength}
                    </Badge>
                  </td>
                  <td>{item.kols.join(', ')}</td>
                  <td className="num">
                    <MiniBar value={item.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel eyebrow="Traceability" title="Citation policy">
          <div className="stack stack--tight">
            <Note tone="safe" icon="check">
              Recommendations require source-linked evidence before they can appear in MSL-ready
              output.
            </Note>
            <Note tone="evidence" icon="evidence">
              Evidence is grouped by publications, trial records, guidelines, congress activity,
              institutional profiles, and transparency signals.
            </Note>
            <div className="metric-list">
              <span>ClinicalTrials.gov</span>
              <strong>38</strong>
              <span>PubMed</span>
              <strong>71</strong>
              <span>Congress / guidelines</span>
              <strong>25</strong>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CandidatesScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page page--wide">
      <ScreenHead
        eyebrow="Expert extraction"
        title="KOL candidates"
        desc="Candidate experts extracted from evidence snippets and normalized into Medical Affairs-ready profile rows."
      />
      {pipelineData.isFallback ? (
        <Note tone="compliance" icon="alert">
          Demo fallback KOLs are visible because fallback analysis mode is enabled. These rows are
          not presented as researched OpenAI Agents SDK output.
        </Note>
      ) : null}
      {!pipelineData.candidates.length ? (
        <Panel>
          <Note tone="risk" icon="alert">
            {pipelineData.analysisError ??
              'No valid researched KOL candidates are stored for this protocol. Run Agentic Analysis after the OpenAI structured-output path is available.'}
          </Note>
        </Panel>
      ) : (
        <Panel noBody>
          <table className="tbl">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Institution</th>
                <th>Specialty</th>
                <th>Geography</th>
                <th className="num">Sources</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelineData.candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="mono">#{candidate.rank}</td>
                  <td className="accent-text">{candidate.name}</td>
                  <td>{candidate.institution}</td>
                  <td>{candidate.specialty}</td>
                  <td className="mono muted">{candidate.geo}</td>
                  <td className="num">{candidate.sources}</td>
                  <td>
                    <Badge tone={candidate.status === 'validated' ? 'safe' : 'compliance'}>
                      {candidate.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function RankingScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page page--wide">
      <ScreenHead
        eyebrow="Explainable scoring"
        title="Ranking"
        desc="Hardcoded MVP weights expose why one expert outranks another without relying on commercial prescribing signals."
      />
      <Panel noBody>
        <table className="matrix">
          <thead>
            <tr>
              <th>KOL</th>
              {pipelineData.rankingDimensions.map((dimension) => (
                <th key={dimension.label}>
                  {dimension.label}
                  <span>{dimension.weight}</span>
                </th>
              ))}
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {pipelineData.candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <strong>{candidate.name}</strong>
                  <p>{candidate.rationale}</p>
                </td>
                {candidate.dimensions.map((value, index) => (
                  <td key={`${candidate.id}-${pipelineData.rankingDimensions[index].label}`}>
                    <MiniBar value={value} max={index === 1 ? 25 : index === 4 ? 15 : 20} />
                  </td>
                ))}
                <td className="num total">{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function GuardrailList({ guardrails }: { guardrails: DashboardGuardrail[] }) {
  return (
    <div className="guard-list">
      {guardrails.map((guardrail) => (
        <div
          key={guardrail.label}
          className={guardrail.ok ? 'guard guard--ok' : 'guard guard--warn'}
        >
          {guardrail.ok ? <Check size={14} /> : <AlertTriangle size={14} />}
          <span>{guardrail.label}</span>
        </div>
      ))}
    </div>
  );
}

function ComplianceScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page">
      <ScreenHead
        eyebrow="Governance"
        title="Compliance review"
        desc="Medical Affairs guardrails keep recommendations non-promotional, cited, and separated from commercial targeting."
      />
      <div className="cols cols--2">
        <Panel eyebrow="Rules" title="Guardrail checks">
          <GuardrailList guardrails={pipelineData.guardrails} />
        </Panel>
        <Panel eyebrow="Open items" title="Reviewer flags">
          <div className="stack stack--tight">
            {pipelineData.complianceFlags.map((flag) => (
              <article key={`${flag.kol}-${flag.type}`} className={`flag flag--${flag.severity}`}>
                <div className="flag__top">
                  <Badge tone={flag.status === 'resolved' ? 'safe' : 'risk'}>{flag.status}</Badge>
                  <span>{flag.severity}</span>
                </div>
                <h3>{flag.type}</h3>
                <strong>{flag.kol}</strong>
                <p>{flag.detail}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MossScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page">
      <ScreenHead
        eyebrow="Moss index"
        title="Index health"
        desc="Protocol chunks, evidence snippets, profile summaries, ranking metadata, and citations pushed to the semantic index."
      />
      <Panel eyebrow="Embedding status" title="Assets">
        <div className="moss-list">
          {pipelineData.mossAssets.map((asset) => {
            const percent = Math.round((asset.embedded / asset.chunks) * 100);
            return (
              <div key={asset.label} className="moss-row">
                <div>
                  <strong>{asset.label}</strong>
                  <span>
                    {asset.embedded} / {asset.chunks} embedded
                    {asset.failed ? ` / ${asset.failed} failed` : ''}
                  </span>
                </div>
                <div className={`meter meter--${asset.state}`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <Badge tone={asset.state}>
                  {asset.state === 'error' ? 'Retrying' : asset.state}
                </Badge>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function SummaryScreen({ pipelineData }: { pipelineData: DashboardPipelineData }) {
  return (
    <div className="page">
      <ScreenHead
        eyebrow="Export"
        title="Summary / export"
        desc="Review packet options for Medical Affairs sign-off, downstream MSL preparation, and audit trails."
      />
      <div className="cols cols--2">
        <Panel eyebrow="Exports" title="Available packets">
          <div className="export-list">
            {pipelineData.exports.map((item) => (
              <button key={item.fmt} type="button" className="export-card">
                <span>{item.fmt}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Warnings" title="Before sign-off">
          <div className="stack stack--tight">
            <Note tone="compliance" icon="alert">
              Relevant specialties and scientific themes are derived, not directly stated in the
              protocol.
            </Note>
            <Note tone="risk" icon="shield">
              One candidate remains below the two-source evidence threshold.
            </Note>
            <Note tone="compliance" icon="database">
              Three KOL profiles are retrying in Moss.
            </Note>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StageGate({
  activeProtocol,
  go,
}: {
  activeProtocol: DashboardProtocol;
  go: (s: ScreenKey) => void;
}) {
  const activeStage = activeProtocol.stages.find((stage) => stage.state === 'active');

  return (
    <div className="page">
      <Panel>
        <div className="empty">
          <span className="empty__icon">
            <RefreshCw size={22} />
          </span>
          <h2>{activeStage ? `${activeStage.label} is running` : 'Run not ready for this view'}</h2>
          <p>
            {activeProtocol.id} has not reached the fully reviewable dashboard state. The complete
            evidence-backed prototype is wired for RSV-PreF-301.
          </p>
          <ActionButton variant="primary" onClick={() => go('overview')}>
            Open run overview
          </ActionButton>
        </div>
      </Panel>
    </div>
  );
}

function VoicePanel({
  activeProtocol,
  pipelineData,
  onClose,
  onCallStateChange,
}: {
  activeProtocol: DashboardProtocol;
  pipelineData: DashboardPipelineData;
  onClose: () => void;
  onCallStateChange: (state: VoiceCallState) => void;
}) {
  const tokenSource = useMemo(() => {
    return TokenSource.custom(async (options) => {
      const roomConfig =
        options.agentName || options.agentMetadata
          ? {
              agents: [
                {
                  agent_name: options.agentName ?? '',
                  metadata: options.agentMetadata,
                },
              ],
            }
          : undefined;

      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol_id: activeProtocol.id,
          protocol_context: protocolContextPayload(activeProtocol),
          room_config: roomConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    });
  }, [activeProtocol]);
  const session = useSession(tokenSource);

  return (
    <AgentSessionProvider session={session}>
      <VoicePanelSession
        activeProtocol={activeProtocol}
        pipelineData={pipelineData}
        onClose={onClose}
        onCallStateChange={onCallStateChange}
      />
    </AgentSessionProvider>
  );
}

function protocolContextPayload(protocol: DashboardProtocol) {
  return {
    id: protocol.id,
    nct: protocol.nct,
    title: protocol.title,
    sponsor: protocol.sponsor,
    phase: protocol.phase,
    indication: protocol.indication,
    geography: protocol.geo,
    enrollment: protocol.enrollment,
    status: protocol.status,
  };
}

function voiceStateLabel(connectionState: ConnectionState, isConnected: boolean) {
  if (isConnected) {
    return 'Live call';
  }
  if (connectionState === ConnectionState.Connecting) {
    return 'Starting call';
  }
  if (connectionState === ConnectionState.Reconnecting) {
    return 'Reconnecting';
  }
  return 'Call ready';
}

function VoicePanelSession({
  activeProtocol,
  pipelineData,
  onClose,
  onCallStateChange,
}: {
  activeProtocol: DashboardProtocol;
  pipelineData: DashboardPipelineData;
  onClose: () => void;
  onCallStateChange: (state: VoiceCallState) => void;
}) {
  const [activeQuestion, setActiveQuestion] = useState(pipelineData.voiceQa[0].q);
  const [chatOpen, setChatOpen] = useState(true);
  const [startError, setStartError] = useState('');
  const startRef = useRef<ReturnType<typeof useSessionContext>['start'] | null>(null);
  const endRef = useRef<ReturnType<typeof useSessionContext>['end'] | null>(null);
  const hasConnectedRef = useRef(false);
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const { state: agentState } = useAgent();
  const mossEvents = useMossContextEvents();
  const answer =
    pipelineData.voiceQa.find((item) => item.q === activeQuestion) ?? pipelineData.voiceQa[0];
  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: true,
    camera: false,
    screenShare: false,
  };

  useEffect(() => {
    startRef.current = session.start;
    endRef.current = session.end;
  }, [session.end, session.start]);

  useEffect(() => {
    const abortController = new AbortController();
    let isCancelled = false;

    setStartError('');
    onCallStateChange('starting');
    void startRef
      .current?.({
        signal: abortController.signal,
        tracks: {
          microphone: { enabled: true },
        },
      })
      .then(() => {
        if (!isCancelled) {
          onCallStateChange('live');
        }
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }
        setStartError(error instanceof Error ? error.message : 'Could not start LiveKit call.');
        onCallStateChange('error');
      });

    return () => {
      isCancelled = true;
      abortController.abort();
      void endRef.current?.();
      onCallStateChange('closed');
    };
  }, [activeProtocol.id, onCallStateChange]);

  useEffect(() => {
    if (session.isConnected) {
      hasConnectedRef.current = true;
      onCallStateChange('live');
      return;
    }

    if (session.connectionState === ConnectionState.Connecting) {
      onCallStateChange('starting');
      return;
    }

    if (
      session.connectionState === ConnectionState.Disconnected &&
      hasConnectedRef.current &&
      !startError
    ) {
      onCallStateChange('ended');
    }
  }, [onCallStateChange, session.connectionState, session.isConnected, startError]);

  const restartCall = () => {
    setStartError('');
    onCallStateChange('starting');
    void startRef
      .current?.({
        tracks: {
          microphone: { enabled: true },
        },
      })
      .then(() => {
        onCallStateChange('live');
      })
      .catch((error: unknown) => {
        setStartError(error instanceof Error ? error.message : 'Could not start LiveKit call.');
        onCallStateChange('error');
      });
  };

  return (
    <aside className="voicepanel" aria-label="Voice copilot">
      <div className="voicepanel__head">
        <span className="voicepanel__mark">
          <Image src={LOGO_SRC} alt="" width={24} height={24} />
        </span>
        <div>
          <h2>Voice copilot</h2>
          <p>
            Scoped to <b>{activeProtocol.id}</b>
          </p>
        </div>
        <span className={`voicepanel__status ${session.isConnected ? 'is-live' : ''}`}>
          {voiceStateLabel(session.connectionState, session.isConnected)}
        </span>
        <button type="button" className="iconbtn" aria-label="Close voice panel" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="voice-control">
        <span className="voice-control__button">
          <Mic size={18} />
        </span>
        <div>
          <div className="voice-control__status">
            {session.isConnected
              ? `Listening / ${agentState}`
              : voiceStateLabel(session.connectionState, false)}
          </div>
          <div className="voice-control__transcript">
            {session.isConnected
              ? `${activeProtocol.indication} / ${activeProtocol.phase}`
              : 'Preparing protocol-aware KOL call'}
          </div>
        </div>
      </div>
      <div className="voicepanel__body">
        {startError ? (
          <div className="voice-error" role="alert">
            <AlertTriangle size={15} />
            <span>{startError}</span>
          </div>
        ) : null}
        <div className="live-session">
          <div className="live-session__meta">
            <span>{session.isConnected ? 'LiveKit room connected' : 'Connecting to LiveKit'}</span>
            <b>{activeProtocol.title}</b>
          </div>
          <AgentControlBar
            variant="livekit"
            controls={controls}
            isChatOpen={chatOpen}
            isConnected={session.isConnected}
            onDisconnect={() => {
              void session.end();
              onCallStateChange('ended');
            }}
            onIsChatOpenChange={setChatOpen}
            className="voice-controlbar"
          />
          {chatOpen ? (
            <AgentChatTranscript
              agentState={agentState}
              messages={messages}
              className="voice-transcript"
            />
          ) : null}
          <MossResultsPanel events={mossEvents} className="voice-moss" />
        </div>
        <div className="suggestions">
          {pipelineData.voiceQa.map((item) => (
            <button
              key={item.q}
              type="button"
              className="vchip"
              disabled={item.q === activeQuestion}
              onClick={() => setActiveQuestion(item.q)}
            >
              {item.q}
            </button>
          ))}
        </div>
        <div className="qa">
          <div className="qa__q">
            <span>You</span>
            <p>{answer.q}</p>
          </div>
          <div className="qa__a">
            <span>KOL Copilot</span>
            <p>{answer.a}</p>
            <div className="qa__chips">
              {answer.chips.map((chip) => (
                <Badge
                  key={chip}
                  tone={chip.includes('Guardrail') || chip.includes('Non') ? 'safe' : 'evidence'}
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="voicepanel__foot">
        <div className="vinput">
          <span>
            {session.isConnected
              ? 'Microphone active for protocol-scoped questions'
              : startError
                ? 'Voice call failed'
                : 'Voice call initializing'}
          </span>
          <button
            type="button"
            aria-label="Start voice input"
            disabled={session.isConnected || session.connectionState === ConnectionState.Connecting}
            onClick={restartCall}
          >
            <Mic size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NoProtocolsScreen() {
  return (
    <div className="page">
      <Panel>
        <div className="empty">
          <span className="empty__icon">
            <Database size={22} />
          </span>
          <h2>No protocol selected</h2>
          <p>
            Add protocol records to the database or upload a Phase 3 protocol before opening the
            processing workspace.
          </p>
          <Link href="/dashboard?screen=protocols&upload=1" className="action action--primary">
            <Upload size={14} />
            Upload protocol
          </Link>
        </div>
      </Panel>
    </div>
  );
}

export function MedicalAffairsDashboard({
  initialScreen = 'overview',
  initialProtocolId,
  initialUploadOpen = false,
  protocols,
  pipelineDataByProtocol,
  protocolLoadError = null,
}: {
  initialScreen?: ScreenKey;
  initialProtocolId?: string;
  initialUploadOpen?: boolean;
  protocols?: DashboardProtocol[];
  pipelineDataByProtocol?: Record<string, DashboardPipelineData>;
  protocolLoadError?: string | null;
}) {
  const dashboardProtocols = protocols ?? demoProtocols;
  const [screen, setScreen] = useState<ScreenKey>(initialScreen);
  const [protocolId, setProtocolId] = useState(
    initialProtocolId ?? dashboardProtocols[0]?.id ?? ''
  );
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceCallState, setVoiceCallState] = useState<VoiceCallState>('closed');
  const [uploadOpen, setUploadOpen] = useState(initialUploadOpen);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [parseRefreshRunning, setParseRefreshRunning] = useState(false);
  const [parseRefreshError, setParseRefreshError] = useState('');
  const activeProtocol = useMemo(
    () =>
      dashboardProtocols.find((protocol) => protocol.id === protocolId) ??
      dashboardProtocols[0] ??
      null,
    [dashboardProtocols, protocolId]
  );
  const activePipelineData =
    (activeProtocol ? pipelineDataByProtocol?.[activeProtocol.id] : null) ??
    (activeProtocol?.id === 'RSV-PreF-301'
      ? demoPipelineData
      : { ...demoPipelineData, isReady: false });

  useEffect(() => {
    if (!dashboardProtocols.length) {
      if (protocolId) {
        setProtocolId('');
      }
      return;
    }

    if (
      initialProtocolId &&
      dashboardProtocols.some((protocol) => protocol.id === initialProtocolId)
    ) {
      setProtocolId(initialProtocolId);
      return;
    }

    if (!dashboardProtocols.some((protocol) => protocol.id === protocolId)) {
      setProtocolId(dashboardProtocols[0].id);
    }
  }, [dashboardProtocols, initialProtocolId, protocolId]);

  useEffect(() => {
    setScreen(initialScreen);
  }, [initialScreen]);

  useEffect(() => {
    setUploadOpen(initialUploadOpen);
  }, [initialUploadOpen]);

  const go = (nextScreen: ScreenKey) => {
    setScreen(nextScreen);
    const selected = protocolId ? `&protocol=${encodeURIComponent(protocolId)}` : '';
    window.history.pushState(null, '', `/dashboard?screen=${nextScreen}${selected}`);
  };
  const runAgenticAnalysis = async () => {
    if (!activeProtocol) {
      return;
    }

    setAnalysisRunning(true);
    setAnalysisError('');
    setParseRefreshError('');
    try {
      const response = await fetch(
        `/api/protocols/${encodeURIComponent(activeProtocol.id)}/agentic-analysis`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query:
              'Run agentic Medical Affairs analysis for this protocol. Search exhaustively for qualified KOLs, produce evidence-backed ranking, and generate a compliant MSL pre-call brief.',
          }),
        }
      );
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? `Agentic analysis failed with ${response.status}`);
      }
      window.location.assign(
        `/dashboard?screen=overview&protocol=${encodeURIComponent(activeProtocol.id)}`
      );
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Agentic analysis failed.');
      setAnalysisRunning(false);
    }
  };
  const refreshParsedData = async () => {
    if (!activeProtocol) {
      return;
    }

    const postRefresh = async (jobId?: string) => {
      const response = await fetch(
        `/api/protocols/${encodeURIComponent(activeProtocol.id)}/unsiloed-parse`,
        {
          method: 'POST',
          headers: jobId ? { 'Content-Type': 'application/json' } : undefined,
          body: jobId ? JSON.stringify({ jobId }) : undefined,
        }
      );
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        protocol?: { protocolCode?: string };
        requiresJobId?: boolean;
      } | null;

      return { response, payload };
    };

    setParseRefreshRunning(true);
    setParseRefreshError('');
    setAnalysisError('');
    try {
      let { response, payload } = await postRefresh();

      if (!response.ok && payload?.requiresJobId) {
        const jobId = window.prompt('Paste the existing Unsiloed parse job id');
        if (!jobId?.trim()) {
          throw new Error(payload.error ?? 'Existing Unsiloed job id is required.');
        }
        ({ response, payload } = await postRefresh(jobId.trim()));
      }

      if (!response.ok) {
        throw new Error(payload?.error ?? `Unsiloed parse refresh failed with ${response.status}`);
      }

      window.location.assign(
        `/dashboard?screen=overview&protocol=${encodeURIComponent(
          payload?.protocol?.protocolCode ?? activeProtocol.id
        )}`
      );
    } catch (error) {
      setParseRefreshError(
        error instanceof Error ? error.message : 'Unsiloed parse refresh failed.'
      );
      setParseRefreshRunning(false);
    }
  };
  const isLibrary = screen === 'protocols' || screen === 'runs';
  const canShowPipelineScreen =
    activeProtocol?.id === 'RSV-PreF-301' ||
    activePipelineData.isReady ||
    Boolean(activePipelineData.analysisError);

  function renderScreen() {
    if (screen === 'protocols') {
      return (
        <ProtocolsScreen
          activeProtocolId={protocolId}
          protocols={dashboardProtocols}
          protocolLoadError={protocolLoadError}
          setProtocolId={setProtocolId}
          go={go}
        />
      );
    }
    if (screen === 'runs') {
      return <RunsScreen go={go} />;
    }
    if (!activeProtocol) {
      return <NoProtocolsScreen />;
    }
    if (!canShowPipelineScreen && screen !== 'overview') {
      return <StageGate activeProtocol={activeProtocol} go={go} />;
    }
    switch (screen) {
      case 'brief':
        return <BriefScreen pipelineData={activePipelineData} />;
      case 'queries':
        return <QueriesScreen pipelineData={activePipelineData} />;
      case 'evidence':
        return <EvidenceScreen pipelineData={activePipelineData} />;
      case 'candidates':
        return <CandidatesScreen pipelineData={activePipelineData} />;
      case 'ranking':
        return <RankingScreen pipelineData={activePipelineData} />;
      case 'compliance':
        return <ComplianceScreen pipelineData={activePipelineData} />;
      case 'moss':
        return <MossScreen pipelineData={activePipelineData} />;
      case 'summary':
        return <SummaryScreen pipelineData={activePipelineData} />;
      case 'overview':
      default:
        return (
          <OverviewScreen
            activeProtocol={activeProtocol}
            go={go}
            pipelineData={activePipelineData}
            analysisRunning={analysisRunning}
            analysisError={analysisError}
            parseRefreshRunning={parseRefreshRunning}
            parseRefreshError={parseRefreshError}
            onRefreshParsedData={refreshParsedData}
            onRunAgenticAnalysis={runAgenticAnalysis}
          />
        );
    }
  }

  return (
    <div className={styles.root}>
      <div className="app-shell">
        <aside className="side">
          <Link href="/" className="side__brand" aria-label="KOL Copilot landing page">
            <Image src={LOGO_SRC} alt="" width={26} height={26} />
            <span>
              <span className="side__name">Copilot</span>
              <span className="side__tag">Orchestrator</span>
            </span>
          </Link>
          <div className="side__scroll">
            {navGroups.map((group) => (
              <div key={group.group} className="side__group">
                <div className="side__label">{group.group}</div>
                {group.items.map((item) => {
                  const count = item.count ?? navCount(item.key, activePipelineData);
                  return (
                    <Link
                      key={item.key}
                      href={`/dashboard?screen=${item.key}`}
                      className="navitem"
                      aria-current={screen === item.key}
                    >
                      <IconToken name={item.icon} />
                      <span>{item.label}</span>
                      {count ? (
                        <span className={`ct ct--${item.tone ?? 'neutral'}`}>{count}</span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="side__foot">
            Veritan Biologics
            <br />
            Medical Affairs / {activeProtocol?.run ?? 'no protocol'}
          </div>
        </aside>

        <main className="main">
          {!isLibrary && activeProtocol ? (
            <>
              <ProtocolHeader
                activeProtocol={activeProtocol}
                protocols={dashboardProtocols}
                protocolId={protocolId}
                setProtocolId={setProtocolId}
                voiceOpen={voiceOpen}
                setVoiceOpen={setVoiceOpen}
                voiceCallState={voiceCallState}
              />
              <StageRail stages={activeProtocol.stages} />
            </>
          ) : null}
          <div className="content">{renderScreen()}</div>
        </main>

        {voiceOpen ? (
          activeProtocol ? (
            <VoicePanel
              key={activeProtocol.id}
              activeProtocol={activeProtocol}
              pipelineData={activePipelineData}
              onClose={() => setVoiceOpen(false)}
              onCallStateChange={setVoiceCallState}
            />
          ) : null
        ) : null}
        {uploadOpen ? (
          <UploadProtocolModal
            onClose={() => setUploadOpen(false)}
            onComplete={(result) => {
              setUploadOpen(false);
              window.location.assign(
                `/dashboard?screen=overview&protocol=${encodeURIComponent(result.protocol.protocolCode)}`
              );
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
