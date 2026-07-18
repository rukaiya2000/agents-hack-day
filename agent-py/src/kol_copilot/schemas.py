from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel, Field


class ProtocolProfile(BaseModel):
    """Structured protocol attributes that drive KOL retrieval."""

    protocol_id: str = "nct04816669-bnt162b2"
    title: str = "BNT162b2 RNA-based COVID-19 vaccine Phase 3 protocol"
    indication: str = "COVID-19 prevention"
    intervention: str = "BNT162b2 RNA-based COVID-19 vaccine"
    phase: str = "Phase 3"
    population: str = "Healthy adults, including adults 18-55"
    geography: list[str] = Field(default_factory=lambda: ["United States"])
    endpoints: list[str] = Field(
        default_factory=lambda: ["safety", "tolerability", "immunogenicity"]
    )
    inclusion_criteria: list[str] = Field(default_factory=list)
    exclusion_criteria: list[str] = Field(default_factory=list)
    relevant_specialties: list[str] = Field(
        default_factory=lambda: [
            "infectious disease",
            "vaccinology",
            "immunology",
            "clinical trial investigators",
        ]
    )


class Citation(BaseModel):
    title: str
    source: str
    url: str
    evidence_type: str
    snippet: str


class ScoreBreakdown(BaseModel):
    protocol_match: float = Field(ge=0, le=30)
    trial_experience: float = Field(ge=0, le=25)
    publication_relevance: float = Field(ge=0, le=20)
    institution_site_relevance: float = Field(ge=0, le=10)
    congress_guideline_influence: float = Field(ge=0, le=10)
    recency: float = Field(ge=0, le=5)
    compliance_adjustment: float = Field(default=0)

    @property
    def total(self) -> float:
        return round(
            self.protocol_match
            + self.trial_experience
            + self.publication_relevance
            + self.institution_site_relevance
            + self.congress_guideline_influence
            + self.recency
            + self.compliance_adjustment,
            1,
        )


class KolCandidate(BaseModel):
    name: str
    institution: str
    specialty: str
    geography: str
    score: float
    score_breakdown: ScoreBreakdown
    rationale: str
    suggested_next_action: str
    citations: list[Citation]
    compliance_flags: list[str] = Field(default_factory=list)


class ComplianceNote(BaseModel):
    severity: str = Field(description="info, warning, or block")
    message: str


class MslBrief(BaseModel):
    expert_name: str
    scientific_background: str
    relevance_rationale: str
    suggested_questions: list[str]
    compliance_warnings: list[str]
    citations: list[Citation]


class KolQueryResult(BaseModel):
    """Structured output returned to LiveKit and the frontend."""

    answer: str
    protocol: ProtocolProfile
    top_kols: list[KolCandidate]
    compliance_notes: list[ComplianceNote]
    msl_brief: MslBrief | None = None
    audit_trail: list[str] = Field(default_factory=list)


class PipelineSearchQueryGroup(BaseModel):
    name: str
    source_targets: list[str] = Field(default_factory=list)
    queries: list[str]
    result_count: int | None = None
    status: str = "approved"


class PipelineEvidenceSnippet(BaseModel):
    title: str
    source: str
    url: str
    evidence_type: str
    snippet: str
    score: float = Field(default=75, ge=0, le=100)
    strength: str = Field(default="moderate", description="weak, moderate, or strong")
    linked_kols: list[str] = Field(default_factory=list)
    published_at: str | None = None


class AgenticAnalysisResult(BaseModel):
    """Full pipeline payload produced by the agentic analysis job."""

    answer: str
    analysis_source: str = Field(default="openai_agents_sdk")
    is_fallback: bool = False
    fallback_reason: str | None = None
    protocol: ProtocolProfile
    search_query_groups: list[PipelineSearchQueryGroup]
    evidence: list[PipelineEvidenceSnippet]
    top_kols: list[KolCandidate]
    compliance_notes: list[ComplianceNote]
    msl_brief: MslBrief | None = None
    audit_trail: list[str] = Field(default_factory=list)


@dataclass(slots=True)
class KolAgentContext:
    user_id: str
    protocol_id: str
    protocol_profile: ProtocolProfile
    moss_project_id: str | None = None
    moss_project_key: str | None = None
    protocol_index_name: str = "protocols"
    expert_index_name: str = "kol_experts"
    metadata: dict[str, Any] | None = None
