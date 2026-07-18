from __future__ import annotations

import os
import re
from typing import Any

from moss import MossClient, QueryOptions

from .env import load_project_env
from .pipeline_store import load_agentic_analysis
from .schemas import (
    Citation,
    ComplianceNote,
    KolAgentContext,
    KolCandidate,
    MslBrief,
    ProtocolProfile,
    ScoreBreakdown,
)

PROMOTIONAL_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"likely to prescribe",
        r"drive commercial adoption",
        r"target (this )?(doctor|physician|provider)",
        r"before approval",
        r"prescribing volume",
        r"script volume",
    ]
]


SEED_EXPERTS: list[dict[str, Any]] = [
    {
        "name": "Dr. Elena Marquez",
        "institution": "Northeast Academic Vaccine Center",
        "specialty": "Infectious disease and vaccinology",
        "geography": "United States",
        "signals": [
            "Phase 3 adult vaccine trial investigator experience",
            "Immunogenicity endpoint publications",
            "COVID-19 vaccine safety monitoring committee participation",
            "Academic medical center site leadership",
        ],
        "score": {
            "protocol_match": 28,
            "trial_experience": 23,
            "publication_relevance": 18,
            "institution_site_relevance": 9,
            "congress_guideline_influence": 7,
            "recency": 5,
            "compliance_adjustment": 0,
        },
        "citations": [
            {
                "title": "Synthetic demo profile: adult vaccine trial investigator",
                "source": "KOL Copilot seed dataset",
                "url": "synthetic://kol-copilot/experts/elena-marquez",
                "evidence_type": "trial investigator",
                "snippet": "Seed evidence marks Dr. Marquez as an adult vaccine investigator with immunogenicity endpoint experience.",
            },
            {
                "title": "ClinicalTrials.gov reference protocol NCT04816669",
                "source": "ClinicalTrials.gov",
                "url": "https://clinicaltrials.gov/study/NCT04816669",
                "evidence_type": "protocol",
                "snippet": "Reference protocol focuses on BNT162b2 safety, tolerability, and immunogenicity.",
            },
        ],
    },
    {
        "name": "Dr. Marcus Chen",
        "institution": "Midwest Center for Clinical Immunology",
        "specialty": "Clinical immunology",
        "geography": "United States",
        "signals": [
            "Immunogenicity assay publications",
            "Adult respiratory virus vaccine research",
            "Investigator-initiated translational immunology studies",
        ],
        "score": {
            "protocol_match": 25,
            "trial_experience": 18,
            "publication_relevance": 20,
            "institution_site_relevance": 8,
            "congress_guideline_influence": 6,
            "recency": 5,
            "compliance_adjustment": 0,
        },
        "citations": [
            {
                "title": "Synthetic demo profile: immunogenicity publication author",
                "source": "KOL Copilot seed dataset",
                "url": "synthetic://kol-copilot/experts/marcus-chen",
                "evidence_type": "publication",
                "snippet": "Seed evidence emphasizes immunogenicity assay and adult respiratory virus vaccine publications.",
            }
        ],
    },
    {
        "name": "Dr. Priya Raman",
        "institution": "Western Research Hospital",
        "specialty": "Infectious disease clinical trials",
        "geography": "United States",
        "signals": [
            "High-enrolling adult vaccine site principal investigator",
            "Protocol feasibility and site operations expertise",
            "Recent congress panelist on vaccine trial diversity",
        ],
        "score": {
            "protocol_match": 24,
            "trial_experience": 24,
            "publication_relevance": 13,
            "institution_site_relevance": 10,
            "congress_guideline_influence": 8,
            "recency": 5,
            "compliance_adjustment": 0,
        },
        "citations": [
            {
                "title": "Synthetic demo profile: vaccine site PI",
                "source": "KOL Copilot seed dataset",
                "url": "synthetic://kol-copilot/experts/priya-raman",
                "evidence_type": "site investigator",
                "snippet": "Seed evidence marks Dr. Raman as a high-enrolling adult vaccine site principal investigator.",
            }
        ],
    },
]


def default_protocol_profile(protocol_id: str | None = None) -> ProtocolProfile:
    if protocol_id:
        analysis = load_agentic_analysis(protocol_id)
        if analysis:
            return analysis.protocol

    profile = ProtocolProfile()
    if protocol_id:
        profile.protocol_id = protocol_id
    return profile


def scan_compliance(text: str) -> list[ComplianceNote]:
    notes: list[ComplianceNote] = []
    for pattern in PROMOTIONAL_PATTERNS:
        if pattern.search(text):
            notes.append(
                ComplianceNote(
                    severity="block",
                    message=(
                        "Detected language that could imply promotional targeting, "
                        "prescribing-volume use, or pre-approval commercial intent."
                    ),
                )
            )
            break

    if not notes:
        notes.append(
            ComplianceNote(
                severity="info",
                message=(
                    "Medical Affairs mode: keep engagement scientific, non-promotional, "
                    "citation-backed, and separated from commercial targeting."
                ),
            )
        )
    return notes


async def _query_moss_documents(
    context: KolAgentContext, index_name: str, query: str, *, top_k: int
) -> list[dict[str, Any]]:
    if not context.moss_project_id or not context.moss_project_key:
        return []

    client = MossClient(context.moss_project_id, context.moss_project_key)
    try:
        await client.load_index(index_name)
        result = await client.query(index_name, query, QueryOptions(top_k=top_k))
    except Exception:
        return []

    docs: list[dict[str, Any]] = []
    for doc in getattr(result, "docs", None) or []:
        docs.append(
            {
                "text": (getattr(doc, "text", "") or "").strip(),
                "score": getattr(doc, "score", None),
                "metadata": getattr(doc, "metadata", None) or {},
            }
        )
    return docs


def _candidate_from_seed(
    entry: dict[str, Any], protocol: ProtocolProfile
) -> KolCandidate:
    breakdown = ScoreBreakdown(**entry["score"])
    citations = [Citation(**citation) for citation in entry["citations"]]
    signals = "; ".join(entry["signals"][:3])
    return KolCandidate(
        name=entry["name"],
        institution=entry["institution"],
        specialty=entry["specialty"],
        geography=entry["geography"],
        score=breakdown.total,
        score_breakdown=breakdown,
        rationale=(
            f"Strong match for {protocol.indication}: {signals}. The rationale is "
            "scientific relevance to the protocol, not prescribing potential."
        ),
        suggested_next_action=(
            "Prepare a non-promotional MSL scientific exchange focused on protocol "
            "fit, trial design, safety monitoring, and evidence gaps."
        ),
        citations=citations,
        compliance_flags=[],
    )


def _candidate_from_moss_doc(
    doc: dict[str, Any], protocol: ProtocolProfile
) -> KolCandidate:
    metadata = doc.get("metadata") or {}
    name = metadata.get("name") or metadata.get("expert_name") or "Retrieved expert"
    source = metadata.get("source") or "Moss evidence index"
    url = metadata.get("url") or metadata.get("source_url") or "moss://kol-evidence"
    evidence_type = metadata.get("evidence_type") or "retrieved evidence"
    score = float(doc.get("score") or 0.75)
    normalized = min(max(score, 0), 1)
    breakdown = ScoreBreakdown(
        protocol_match=round(20 + normalized * 8, 1),
        trial_experience=round(14 + normalized * 8, 1),
        publication_relevance=round(12 + normalized * 7, 1),
        institution_site_relevance=round(6 + normalized * 3, 1),
        congress_guideline_influence=round(4 + normalized * 3, 1),
        recency=4,
    )
    citation = Citation(
        title=metadata.get("title") or f"Moss evidence for {name}",
        source=source,
        url=url,
        evidence_type=evidence_type,
        snippet=doc.get("text") or "Retrieved evidence snippet.",
    )
    return KolCandidate(
        name=name,
        institution=metadata.get("institution") or "Unknown institution",
        specialty=metadata.get("specialty")
        or ", ".join(protocol.relevant_specialties[:2]),
        geography=metadata.get("geography") or ", ".join(protocol.geography),
        score=breakdown.total,
        score_breakdown=breakdown,
        rationale=(
            f"Moss retrieved evidence for {name} matched the protocol attributes "
            f"for {protocol.indication} and related expert signals."
        ),
        suggested_next_action=(
            "Review the cited evidence and prepare a non-promotional scientific "
            "exchange objective before any MSL outreach."
        ),
        citations=[citation],
        compliance_flags=[],
    )


async def retrieve_and_rank_kols(
    context: KolAgentContext, query: str, *, limit: int = 5
) -> list[KolCandidate]:
    docs = await _query_moss_documents(
        context, context.expert_index_name, query, top_k=max(limit, 5)
    )
    protocol = context.protocol_profile
    if docs:
        candidates = [_candidate_from_moss_doc(doc, protocol) for doc in docs]
    elif analysis := load_agentic_analysis(context.protocol_id):
        candidates = analysis.top_kols
    else:
        candidates = [_candidate_from_seed(entry, protocol) for entry in SEED_EXPERTS]

    return sorted(candidates, key=lambda candidate: candidate.score, reverse=True)[
        :limit
    ]


def build_msl_brief(candidate: KolCandidate, protocol: ProtocolProfile) -> MslBrief:
    return MslBrief(
        expert_name=candidate.name,
        scientific_background=(
            f"{candidate.name} is relevant to {protocol.title} based on "
            f"{candidate.specialty.lower()} experience and evidence tied to "
            f"{protocol.indication}."
        ),
        relevance_rationale=candidate.rationale,
        suggested_questions=[
            "What scientific considerations would you raise about the protocol's endpoint strategy?",
            "Which patient-population or site-feasibility issues should Medical Affairs understand?",
            "What evidence gaps would be appropriate to explore through non-promotional scientific exchange?",
        ],
        compliance_warnings=[
            "Do not discuss unapproved promotional claims.",
            "Do not use prescribing behavior, sales potential, or commercial adoption as an engagement rationale.",
            "Keep the conversation scientific, evidence-seeking, and Medical Affairs led.",
        ],
        citations=candidate.citations,
    )


def build_context_from_env(
    *, user_id: str, protocol_id: str, protocol_profile: ProtocolProfile | None = None
) -> KolAgentContext:
    load_project_env()
    return KolAgentContext(
        user_id=user_id,
        protocol_id=protocol_id,
        protocol_profile=protocol_profile or default_protocol_profile(protocol_id),
        moss_project_id=os.getenv("MOSS_PROJECT_ID"),
        moss_project_key=os.getenv("MOSS_PROJECT_KEY"),
        protocol_index_name=os.getenv("MOSS_PROTOCOL_INDEX_NAME", "protocols"),
        expert_index_name=os.getenv("MOSS_EXPERT_INDEX_NAME", "kol_experts"),
    )
