import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone — maps to the meaning palette. */
  tone?: 'neutral' | 'accent' | 'evidence' | 'compliance' | 'risk' | 'safe';
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Leading status dot. */
  dot?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Compact status/label pill. Prefer `soft` for ambient status, `solid` only
 * when a single state must dominate. Tone communicates meaning — don't pick by color.
 */
export function Badge(props: BadgeProps): JSX.Element;
