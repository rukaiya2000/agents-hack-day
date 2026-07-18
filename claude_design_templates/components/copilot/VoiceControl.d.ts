import * as React from 'react';

export interface VoiceControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Session state. */
  state?: 'idle' | 'listening' | 'thinking';
  /** Live transcript snippet shown to the right. */
  transcript?: string;
  /** Elapsed time label, e.g. "0:12". */
  elapsed?: string;
  /** Toggle mic on/off. */
  onToggle?: () => void;
}

/**
 * Ambient voice session control — quiet mic toggle, live waveform, state label,
 * elapsed timer. Instrument-like, not a gimmick. Waveform animates only while
 * `listening` and respects reduced-motion.
 */
export function VoiceControl(props: VoiceControlProps): JSX.Element;
