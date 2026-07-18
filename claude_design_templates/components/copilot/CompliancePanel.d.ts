import * as React from 'react';

export interface ComplianceItem {
  label: string;
  /** Pass/active when true (default). false renders an amber caution glyph. */
  ok?: boolean;
}

export interface CompliancePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mode name shown in the header. Default "Medical Affairs". */
  mode?: string;
  /** Active guardrail statements. */
  items: ComplianceItem[];
  auditAvailable?: boolean;
}

/**
 * The persistent compliance guardrail module. Amber-keyed but calm — it states
 * the active Medical Affairs rules (citation-required, firewall, no targeting)
 * without alarm. Keep copy non-promotional.
 */
export function CompliancePanel(props: CompliancePanelProps): JSX.Element;
