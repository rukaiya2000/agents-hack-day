import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Uppercase mono key, e.g. "PHASE". Optional. */
  label?: string;
  /** The attribute value, e.g. "3". */
  value: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'neutral' | 'accent';
}

/**
 * Protocol attribute chip — a key→value token for abstracting a clinical
 * protocol into scannable facts. Group them in a wrap row.
 */
export function Tag(props: TagProps): JSX.Element;
