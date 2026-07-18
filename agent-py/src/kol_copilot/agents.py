from __future__ import annotations

import os

from agents import Agent, RunContextWrapper, function_tool

from .pipeline_store import load_agentic_analysis
from .schemas import KolAgentContext, KolQueryResult
from .tools import build_msl_brief, retrieve_and_rank_kols, scan_compliance


@function_tool
async def get_protocol_profile(
    context: RunContextWrapper[KolAgentContext],
) -> dict:
    """Return the structured protocol attributes currently in scope."""

    return context.context.protocol_profile.model_dump()


@function_tool
async def get_agentic_analysis_assets(
    context: RunContextWrapper[KolAgentContext],
) -> dict:
    """Return stored protocol, evidence, KOL, ranking, and brief assets if available."""

    analysis = load_agentic_analysis(context.context.protocol_id)
    if not analysis:
        return {
            "available": False,
            "message": "No stored agentic analysis snapshot is available for this protocol.",
        }

    return {
        "available": True,
        "analysis": analysis.model_dump(mode="json"),
    }


@function_tool
async def retrieve_ranked_kols(
    context: RunContextWrapper[KolAgentContext],
    query: str,
    limit: int = 5,
) -> list[dict]:
    """Retrieve and rank scientifically relevant KOLs for the protocol.

    Args:
        query: The user's KOL discovery or comparison request.
        limit: Maximum number of KOL candidates to return.
    """

    candidates = await retrieve_and_rank_kols(context.context, query, limit=limit)
    return [candidate.model_dump() for candidate in candidates]


@function_tool
def check_medical_affairs_compliance(text: str) -> list[dict]:
    """Check text for Medical Affairs compliance issues.

    Args:
        text: Proposed answer, rationale, outreach angle, or MSL brief text.
    """

    return [note.model_dump() for note in scan_compliance(text)]


@function_tool
async def draft_msl_pre_call_brief(
    context: RunContextWrapper[KolAgentContext],
    expert_name: str,
    query: str,
) -> dict:
    """Draft a compliant MSL pre-call brief for a selected expert.

    Args:
        expert_name: Expert to brief.
        query: User request or scientific focus for the brief.
    """

    candidates = await retrieve_and_rank_kols(context.context, query, limit=8)
    selected = next(
        (
            candidate
            for candidate in candidates
            if expert_name.lower() in candidate.name.lower()
            or candidate.name.lower() in expert_name.lower()
        ),
        candidates[0],
    )
    return build_msl_brief(selected, context.context.protocol_profile).model_dump()


def build_kol_copilot_agent() -> Agent[KolAgentContext]:
    return Agent[KolAgentContext](
        name="KOL Copilot",
        model=os.getenv("OPENAI_KOL_MODEL", "gpt-5.2"),
        instructions=(
            "You are KOL Copilot, a protocol-aware Medical Affairs co-pilot. "
            "Use the protocol profile as the job description and the evidence "
            "tools as the talent pool. Identify, rank, compare, and brief KOLs "
            "using evidence only. Every recommendation must be citation-backed. "
            "Call get_agentic_analysis_assets first when the user asks about "
            "a completed dashboard pipeline, protocol PDF, KOL shortlist, "
            "ranking rationale, evidence source, or MSL brief. "
            "Never use prescribing volume, sales potential, commercial adoption, "
            "or pre-approval promotional targeting as a rationale. If the user "
            "asks for an MSL brief, include scientific background, relevance "
            "rationale, non-promotional questions, citations, and compliance "
            "warnings. Keep the answer concise enough for voice, but return the "
            "full structured result for the UI."
        ),
        tools=[
            get_protocol_profile,
            get_agentic_analysis_assets,
            retrieve_ranked_kols,
            check_medical_affairs_compliance,
            draft_msl_pre_call_brief,
        ],
        output_type=KolQueryResult,
    )
