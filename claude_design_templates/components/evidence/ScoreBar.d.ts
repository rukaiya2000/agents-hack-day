import * as React from 'react';

export interface ScoreBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Component label, e.g. "Trial experience". */
  label: React.ReactNode;
  /** Score value. */
  value: number;
  /** Scale max. Default 100. */
  max?: number;
  tone?: 'accent' | 'evidence' | 'safe' | 'compliance' | 'neutral';
  /** Optional contribution note shown before the value, e.g. "× 0.30". */
  weight?: React.ReactNode;
  /** Track height in px. Default 6. */
  height?: number;
}

/**
 * One line of a KOL score breakdown — label, track, mono value. Stack several
 * to make a total score explainable as the sum of legible parts.
 */
export function ScoreBar(props: ScoreBarProps): JSX.Element;
