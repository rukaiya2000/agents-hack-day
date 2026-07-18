import * as React from 'react';

/**
 * Props for the quiet enterprise Button.
 *
 * @startingPoint section="Core" subtitle="Primary / secondary / ghost / danger button" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. `primary` = single teal action per view. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Quiet enterprise button. Use exactly one `primary` per surface; everything
 * else is `secondary` or `ghost`. `danger` is reserved for destructive,
 * compliance-sensitive actions.
 */
export function Button(props: ButtonProps): JSX.Element;
