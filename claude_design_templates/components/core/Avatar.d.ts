import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name; initials are derived (Dr./Prof. prefixes stripped). */
  name: string;
  /** Pixel size of the square monogram. Default 36. */
  size?: number;
  /** Force a tint, or `auto` (hashed from name). */
  tone?: 'auto' | 'accent' | 'evidence' | 'neutral';
}

/**
 * Expert monogram. Initials on a tinted rounded square — intentionally not a
 * photo, to keep the tool scientific rather than social.
 */
export function Avatar(props: AvatarProps): JSX.Element;
