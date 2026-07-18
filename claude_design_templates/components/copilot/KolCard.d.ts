import * as React from 'react';

/**
 * Ranked expert card — rank, identity, total score, breakdown, rationale,
 * citation count, compliance status, and the two primary actions.
 *
 * @startingPoint section="Copilot" subtitle="Ranked KOL / KEE card with score breakdown" viewport="700x340"
 */
export interface KolCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 1-based rank in the ranked list. */
  rank: number;
  name: string;
  institution: string;
  specialty: string;
  geography?: string;
  /** Total relevance score. */
  score: number;
  scoreMax?: number;
  /** Compliance status. */
  status?: 'validated' | 'review' | 'conflict';
  /** One-line top rationale for the ranking. */
  rationale?: React.ReactNode;
  /** Citation count backing this expert. */
  citations?: number;
  /** Segments for the inline score breakdown bar. */
  breakdown?: KolScoreSegment[];
  selected?: boolean;
  onSelect?: () => void;
  onViewEvidence?: () => void;
  onGenerateBrief?: () => void;
}

/**
 * Ranked expert card — rank, identity, total score, breakdown, rationale,
 * citation count, compliance status, and the two primary actions. Dense and
 * comparison-first; never a social profile.
 */
export function KolCard(props: KolCardProps): JSX.Element;

export interface KolScoreSegment {
  label: string;
  value: number;
}
