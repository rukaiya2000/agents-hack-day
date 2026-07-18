import * as React from 'react';

export interface CitationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reference label — "1", "NEJM 2024", etc. */
  refId: React.ReactNode;
  /** Article / source title (full shape only). */
  title?: React.ReactNode;
  /** Journal or registry. */
  source?: React.ReactNode;
  year?: React.ReactNode;
  /** Why this evidence is relevant to the protocol. */
  relevance?: React.ReactNode;
  /** Inline mono pill instead of a full row. */
  compact?: boolean;
  onClick?: React.MouseEventHandler;
}

/**
 * Evidence reference. Use `compact` for inline [ref] pills in answer text;
 * the full shape is a list row with serif title, mono source·year, and a
 * relevance note. Always indigo-accented.
 */
export function Citation(props: CitationProps): JSX.Element;
