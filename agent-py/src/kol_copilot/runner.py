from __future__ import annotations

import os

from .schemas import KolQueryResult, ProtocolProfile
from .tools import (
    build_context_from_env,
    build_msl_brief,
    retrieve_and_rank_kols,
    scan_compliance,
)


def _wants_brief(user_text: str) -> bool:
    lowered = user_text.lower()
    return "brief" in lowered or "pre-call" in lowered or "precall" in lowered


def _trim_voice_text(text: str, *, max_words: int = 24) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    return " ".join(words[:max_words]).rstrip(".,;:") + "."


def voice_summary(result: KolQueryResult) -> str:
    if not result.top_kols:
        return _trim_voice_text(result.answer)

    top = result.top_kols[0]
    return (
        f"I found protocol matches. {top.name} is first at {top.institution}. "
        "I updated the cards and citations."
    )


async def _fallback_kol_query_result(
    user_text: str,
    *,
    user_id: str,
    protocol_id: str,
    protocol_profile: ProtocolProfile | None,
    audit_reason: str,
) -> KolQueryResult:
    context = build_context_from_env(
        user_id=user_id,
        protocol_id=protocol_id,
        protocol_profile=protocol_profile,
    )
    candidates = await retrieve_and_rank_kols(context, user_text, limit=5)
    compliance_notes = scan_compliance(user_text)
    brief = (
        build_msl_brief(candidates[0], context.protocol_profile)
        if _wants_brief(user_text)
        else None
    )
    return KolQueryResult(
        answer=(
            "I found protocol-relevant experts using the local KOL Copilot "
            "fallback workflow. Treat synthetic seed evidence as demo data until "
            "the Moss expert index is populated."
        ),
        protocol=context.protocol_profile,
        top_kols=candidates,
        compliance_notes=compliance_notes,
        msl_brief=brief,
        audit_trail=[
            "Used deterministic KOL Copilot fallback.",
            audit_reason,
            "Ranking used the MVP score weights from AGENTS.md.",
        ],
    )


async def run_kol_query(
    user_text: str,
    *,
    protocol_id: str = "nct04816669-bnt162b2",
    user_id: str = "anonymous",
    protocol_profile: ProtocolProfile | None = None,
    conversation_id: str | None = None,
    prefer_local: bool = False,
) -> KolQueryResult:
    """Run the OpenAI Agents KOL workflow.

    The runner is intentionally callable in-process from LiveKit. When
    ``prefer_local`` is true, ``OPENAI_API_KEY`` is absent, or the Agents SDK is
    unavailable, it returns a deterministic local result so the hackathon demo
    can still render KOL cards and compliance notes.
    """

    if prefer_local:
        return await _fallback_kol_query_result(
            user_text,
            user_id=user_id,
            protocol_id=protocol_id,
            protocol_profile=protocol_profile,
            audit_reason=(
                "Voice fast path bypassed the nested OpenAI Agents SDK for "
                "lower latency."
            ),
        )

    if not os.getenv("OPENAI_API_KEY"):
        return await _fallback_kol_query_result(
            user_text,
            user_id=user_id,
            protocol_id=protocol_id,
            protocol_profile=protocol_profile,
            audit_reason="OPENAI_API_KEY was not set.",
        )

    try:
        from agents import Runner, SQLiteSession, trace

        from .agents import build_kol_copilot_agent

        context = build_context_from_env(
            user_id=user_id,
            protocol_id=protocol_id,
            protocol_profile=protocol_profile,
        )
        agent = build_kol_copilot_agent()
        session_key = conversation_id or f"kol-copilot:{user_id}:{protocol_id}"
        session = SQLiteSession(session_key)

        with trace(workflow_name="KOL Copilot", group_id=session_key):
            result = await Runner.run(
                agent,
                user_text,
                context=context,
                session=session,
            )

        final_output = result.final_output
        if isinstance(final_output, KolQueryResult):
            return final_output
        if isinstance(final_output, dict):
            return KolQueryResult.model_validate(final_output)
        return await _fallback_kol_query_result(
            str(final_output),
            user_id=user_id,
            protocol_id=protocol_id,
            protocol_profile=protocol_profile,
            audit_reason="OpenAI Agents returned non-structured output.",
        )
    except Exception as exc:
        if os.getenv("KOL_COPILOT_STRICT_OPENAI") == "1":
            raise
        return await _fallback_kol_query_result(
            user_text,
            user_id=user_id,
            protocol_id=protocol_id,
            protocol_profile=protocol_profile,
            audit_reason=f"OpenAI Agents runner unavailable: {type(exc).__name__}: {exc}",
        )
