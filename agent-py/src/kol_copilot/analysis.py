from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import sys
from typing import Any

from agents import Agent, AsyncOpenAI, RunConfig, Runner, set_default_openai_client
from agents.model_settings import ModelSettings

from .env import load_project_env
from .schemas import (
    AgenticAnalysisResult,
    KolCandidate,
    PipelineEvidenceSnippet,
    PipelineSearchQueryGroup,
    ProtocolProfile,
)
from .tools import (
    build_context_from_env,
    build_msl_brief,
    retrieve_and_rank_kols,
    scan_compliance,
)
from .web_research import bright_data_configured, build_research_tools

logger = logging.getLogger(__name__)


INSTRUCTIONS = """
You are KOL Copilot's agentic Medical Affairs research orchestrator.

Goal:
- Given a Phase 3 or launch-readiness protocol profile, generate every
  structured asset needed to populate the dashboard Pipeline: protocol brief,
  search query groups, public evidence snippets, KOL candidates, explainable
  ranking, compliance notes, and a compliant MSL pre-call brief for the top KOL.

Research behavior:
- Search exhaustively across public scientific and institutional sources:
  ClinicalTrials.gov, PubMed, guideline bodies, congress programs, society
  pages, institution bios, Open Payments/transparency pages where applicable,
  and reputable publication or trial registry pages.
- Use hosted web search and, when available, Bright Data SERP plus Unlocker API
  tools. Use SERP for broad discovery and Unlocker for reading likely source
  pages.
- Use the protocol as the job description. Prioritize indication, intervention
  class, phase, patient population, endpoints, geography, inclusion/exclusion
  criteria, and relevant specialties.
- Prefer qualified investigators, authors, guideline contributors, congress
  faculty, site leaders, and emerging scientific experts over generic celebrity
  rankings.

Evidence and ranking:
- Every KOL must include citations with source URL, title, evidence type, and a
  short evidence snippet.
- Return 5-8 KOLs and 12-20 evidence snippets. Keep citation snippets under 280
  characters, KOL rationales under 600 characters, suggested next actions under
  280 characters, and audit trail entries under 240 characters.
- Put URLs only in citation or evidence URL fields. Do not put Markdown links,
  bracketed citations, or raw source lists inside protocol fields, rationales,
  actions, or audit entries.
- Score KOLs with this MVP model: 30% protocol match, 25% trial investigator
  experience, 20% publication relevance, 10% institution/site relevance, 10%
  congress/guideline influence, 5% recency, minus compliance/conflict risk
  adjustments.
- Return scores on the exact ScoreBreakdown fields. The final total should be
  comparable across KOLs.

Compliance:
- Medical Affairs mode is always on.
- Do not use prescribing volume, prescription behavior, sales potential,
  commercial adoption, or pre-approval promotional targeting as a rationale.
- Suggested actions must be non-promotional scientific exchange, evidence
  generation, site feasibility, advisory insight, or protocol-relevant education.
- If evidence is thin or a conflict signal is found, include a compliance note.

Output:
- Return only structured output matching the requested schema.
- Keep the answer concise but make the structured fields complete enough for
  the dashboard to render without additional interpretation.
- Set analysis_source to "openai_agents_sdk", is_fallback to false, and
  fallback_reason to null.
"""


REPAIR_INSTRUCTIONS = """
You are KOL Copilot's strict structured-output repair agent.

You receive raw text from a previous OpenAI Agents SDK run that already searched
for protocol-relevant KOLs but failed final JSON validation. Convert only the
information present in the raw text into the requested structured schema.

Rules:
- Do not invent KOLs, citations, URLs, claims, or scores.
- Include only complete candidates with a name, score, rationale, and at least
  one citation-like evidence source in the raw text.
- Keep 3-8 candidates and 8-20 evidence snippets.
- Keep snippets under 260 characters and rationales under 500 characters.
- Remove Markdown links from field text; put URLs in url fields.
- Set analysis_source to "openai_agents_sdk_repaired", is_fallback to false,
  and fallback_reason to null.
- Return only structured output matching the requested schema.
"""


def _trim(value: str, limit: int) -> str:
    if len(value) <= limit:
        return value
    return value[:limit].rstrip() + "..."


def _query_groups(protocol: ProtocolProfile) -> list[PipelineSearchQueryGroup]:
    indication = protocol.indication
    intervention = protocol.intervention
    specialties = " OR ".join(protocol.relevant_specialties[:3])
    endpoint = protocol.endpoints[0] if protocol.endpoints else "clinical endpoint"

    return [
        PipelineSearchQueryGroup(
            name="Protocol match and trial investigators",
            source_targets=["ClinicalTrials.gov", "PubMed"],
            queries=[
                f'"{indication}" "{intervention}" phase 3 investigator',
                f'"{indication}" "{endpoint}" principal investigator clinical trial',
            ],
            result_count=None,
        ),
        PipelineSearchQueryGroup(
            name="Publication relevance",
            source_targets=["PubMed", "journal pages"],
            queries=[
                f'"{indication}" "{intervention}" immunogenicity publication author',
                f'"{indication}" "{endpoint}" ({specialties}) author',
            ],
            result_count=None,
        ),
        PipelineSearchQueryGroup(
            name="Guidelines, congress, and society influence",
            source_targets=["guidelines", "congress", "society pages"],
            queries=[
                f'"{indication}" guideline author "{endpoint}"',
                f'"{indication}" congress speaker "{intervention}"',
            ],
            result_count=None,
        ),
        PipelineSearchQueryGroup(
            name="Institution, site, and transparency checks",
            source_targets=["institution bios", "Open Payments", "site records"],
            queries=[
                f'"{indication}" investigator institution clinical research site',
                f'"{indication}" KOL Open Payments transparency',
            ],
            result_count=None,
        ),
    ]


def _evidence_from_candidates(
    candidates: list[KolCandidate],
) -> list[PipelineEvidenceSnippet]:
    evidence: list[PipelineEvidenceSnippet] = []
    seen: set[str] = set()
    for candidate in candidates:
        for citation in candidate.citations:
            key = f"{citation.url}|{citation.title}|{candidate.name}"
            if key in seen:
                continue
            seen.add(key)
            evidence.append(
                PipelineEvidenceSnippet(
                    title=citation.title,
                    source=citation.source,
                    url=citation.url,
                    evidence_type=citation.evidence_type,
                    snippet=citation.snippet,
                    score=min(100, max(60, candidate.score)),
                    strength="strong" if candidate.score >= 85 else "moderate",
                    linked_kols=[candidate.name],
                )
            )
    return evidence


async def _fallback_agentic_analysis(
    *,
    protocol: ProtocolProfile,
    query: str,
    user_id: str,
    reason: str,
) -> AgenticAnalysisResult:
    fallback_reason = _trim(reason, 1200)
    context = build_context_from_env(
        user_id=user_id,
        protocol_id=protocol.protocol_id,
        protocol_profile=protocol,
    )
    candidates = await retrieve_and_rank_kols(context, query, limit=8)
    brief = build_msl_brief(candidates[0], protocol) if candidates else None
    compliance_notes = scan_compliance(query)

    return AgenticAnalysisResult(
        answer=(
            "Generated a structured KOL Copilot pipeline result using the local "
            "fallback workflow. Live web research was not completed."
        ),
        analysis_source="local_fallback",
        is_fallback=True,
        fallback_reason=fallback_reason,
        protocol=protocol,
        search_query_groups=_query_groups(protocol),
        evidence=_evidence_from_candidates(candidates),
        top_kols=candidates,
        compliance_notes=compliance_notes,
        msl_brief=brief,
        audit_trail=[
            "Used deterministic KOL Copilot fallback.",
            fallback_reason,
            "Pipeline output follows the OpenAI Agents structured-output schema.",
        ],
    )


def _build_agent() -> Agent:
    tools = build_research_tools()
    tool_audit = [
        "OpenAI hosted web search enabled"
        if os.getenv("OPENAI_ENABLE_HOSTED_WEB_SEARCH", "1") != "0"
        else "OpenAI hosted web search disabled",
        "Bright Data SERP/Unlocker enabled"
        if bright_data_configured()
        else "Bright Data SERP/Unlocker not configured",
    ]
    return Agent(
        name="KOL Copilot Agentic Analysis",
        instructions=f"{INSTRUCTIONS}\n\nTool availability:\n- "
        + "\n- ".join(tool_audit),
        tools=tools,
        model=os.getenv("OPENAI_KOL_MODEL", "gpt-5.2"),
        model_settings=ModelSettings(
            tool_choice="auto",
            max_tokens=int(os.getenv("OPENAI_KOL_MAX_OUTPUT_TOKENS", "16000")),
        ),
        output_type=AgenticAnalysisResult,
    )


def _build_repair_agent() -> Agent:
    return Agent(
        name="KOL Copilot Agentic Analysis Repair",
        instructions=REPAIR_INSTRUCTIONS,
        tools=[],
        model=os.getenv(
            "OPENAI_KOL_REPAIR_MODEL", os.getenv("OPENAI_KOL_MODEL", "gpt-5.2")
        ),
        model_settings=ModelSettings(
            max_tokens=int(os.getenv("OPENAI_KOL_REPAIR_MAX_OUTPUT_TOKENS", "12000")),
        ),
        output_type=AgenticAnalysisResult,
    )


def _configure_openai_client() -> None:
    timeout = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "300"))
    retries = int(os.getenv("OPENAI_MAX_RETRIES", "3"))
    set_default_openai_client(AsyncOpenAI(timeout=timeout, max_retries=retries))


def _coerce_agent_output(value: Any) -> AgenticAnalysisResult:
    if isinstance(value, AgenticAnalysisResult):
        return value
    if isinstance(value, dict):
        return AgenticAnalysisResult.model_validate(value)
    return AgenticAnalysisResult.model_validate_json(str(value))


def _looks_repairable(error: Exception) -> bool:
    text = str(error)
    return (
        "Invalid JSON" in text
        and '"top_kols"' in text
        and '"evidence"' in text
        and '"search_query_groups"' in text
    )


async def _repair_agentic_output(
    *,
    protocol: ProtocolProfile,
    query: str,
    error: Exception,
) -> AgenticAnalysisResult:
    repair_prompt = {
        "task": "Repair the previous OpenAI Agents SDK output into valid KOL Copilot structured output.",
        "protocol_profile": protocol.model_dump(mode="json"),
        "original_query": query,
        "raw_failed_output": _trim(str(error), 50000),
    }
    result = await Runner.run(
        _build_repair_agent(),
        json.dumps(repair_prompt, indent=2),
        max_turns=int(os.getenv("OPENAI_KOL_REPAIR_MAX_TURNS", "4")),
        run_config=RunConfig(
            tracing_disabled=os.getenv("OPENAI_TRACING_DISABLED", "1") == "1"
        ),
    )
    repaired = _coerce_agent_output(result.final_output)
    repaired.analysis_source = "openai_agents_sdk_repaired"
    repaired.is_fallback = False
    repaired.fallback_reason = None
    repaired.audit_trail = [
        "Repaired invalid OpenAI Agents SDK structured output into schema-valid pipeline assets.",
        *repaired.audit_trail,
    ]
    return repaired


async def run_agentic_analysis(
    *,
    protocol: ProtocolProfile,
    query: str,
    user_id: str = "dashboard",
    protocol_excerpt: str = "",
    max_turns: int | None = None,
) -> AgenticAnalysisResult:
    if not os.getenv("OPENAI_API_KEY"):
        return await _fallback_agentic_analysis(
            protocol=protocol,
            query=query,
            user_id=user_id,
            reason="OPENAI_API_KEY was not set.",
        )

    _configure_openai_client()
    agent = _build_agent()
    prompt = {
        "task": query,
        "protocol_profile": protocol.model_dump(mode="json"),
        "protocol_excerpt": protocol_excerpt[:30000],
        "required_candidate_count": 8,
        "required_evidence_count": "12-20 concise snippets when web tools are available",
        "output_limits": {
            "answer_chars": 600,
            "top_kols": "5-8",
            "evidence": "12-20",
            "citation_snippet_chars": 280,
            "kol_rationale_chars": 600,
            "suggested_next_action_chars": 280,
            "audit_entry_chars": 240,
        },
        "required_output": (
            "Populate search_query_groups, evidence, top_kols, compliance_notes, "
            "msl_brief, audit_trail, analysis_source, is_fallback, and fallback_reason. "
            "Cite every substantive recommendation through citation objects only."
        ),
    }

    try:
        result = await Runner.run(
            agent,
            json.dumps(prompt, indent=2),
            max_turns=max_turns or int(os.getenv("OPENAI_KOL_MAX_TURNS", "24")),
            run_config=RunConfig(
                tracing_disabled=os.getenv("OPENAI_TRACING_DISABLED", "1") == "1"
            ),
        )
        final_output = result.final_output
        return _coerce_agent_output(final_output)
    except Exception as exc:
        repair_error: Exception | None = None
        if _looks_repairable(exc):
            try:
                return await _repair_agentic_output(
                    protocol=protocol,
                    query=query,
                    error=exc,
                )
            except Exception as repair_exc:
                repair_error = repair_exc
                logger.warning("OpenAI agentic analysis repair failed: %s", repair_exc)

        if os.getenv("KOL_COPILOT_STRICT_OPENAI") == "1":
            raise
        reason = f"OpenAI agentic analysis unavailable: {type(exc).__name__}: {exc}"
        if repair_error:
            reason = (
                f"{reason}\nOpenAI repair pass failed: "
                f"{type(repair_error).__name__}: {repair_error}"
            )
        return await _fallback_agentic_analysis(
            protocol=protocol,
            query=query,
            user_id=user_id,
            reason=reason,
        )


def _load_payload() -> dict[str, Any]:
    raw = sys.stdin.read()
    if raw.strip():
        return json.loads(raw)
    return {}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run KOL Copilot agentic analysis.")
    parser.add_argument("--max-turns", type=int, default=None)
    parser.add_argument("--log-level", default=os.getenv("LOG_LEVEL", "WARNING"))
    return parser.parse_args()


def configure_logging(level_name: str) -> None:
    level = getattr(logging, level_name.upper(), logging.WARNING)
    logging.basicConfig(
        level=level, format="%(asctime)s %(levelname)s %(name)s - %(message)s"
    )


def main() -> None:
    load_project_env()
    args = parse_args()
    configure_logging(args.log_level)
    payload = _load_payload()
    protocol = ProtocolProfile.model_validate(payload["protocol_profile"])
    result = asyncio.run(
        run_agentic_analysis(
            protocol=protocol,
            query=payload.get("query")
            or "Run protocol-aware KOL discovery and ranking.",
            user_id=payload.get("user_id") or "dashboard",
            protocol_excerpt=payload.get("protocol_excerpt") or "",
            max_turns=args.max_turns,
        )
    )
    print(json.dumps(result.model_dump(mode="json"), indent=2))


if __name__ == "__main__":
    main()
