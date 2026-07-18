import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase overline in the header rail. */
  eyebrow?: React.ReactNode;
  /** Header title. Renders the header rail when present. */
  title?: React.ReactNode;
  /** Right-aligned header actions (buttons / badges). */
  actions?: React.ReactNode;
  /** Teal selected ring — for the active item in a comparison set. */
  selected?: boolean;
  /** Adds hover elevation + pointer. */
  interactive?: boolean;
  /** Body padding in px. Default 16. */
  padding?: number;
  children?: React.ReactNode;
}

/**
 * The fundamental surface: white, hairline border, optional header rail.
 * Feels premium through structure and alignment, not elevation.
 */
export function Card(props: CardProps): JSX.Element;
