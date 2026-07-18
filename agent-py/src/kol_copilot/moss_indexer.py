from __future__ import annotations

import argparse
import asyncio
import hashlib
import inspect
import json
import os
import sys
from dataclasses import dataclass
from typing import Any

from moss import DocumentInfo, MossClient, MutationOptions

from .env import load_project_env
from .schemas import AgenticAnalysisResult, Citation, MslBrief

DEFAULT_MODEL_ID = "moss-minilm"
DEFAULT_PROTOCOL_INDEX = "protocols"
DEFAULT_EXPERT_INDEX = "kol_experts"


@dataclass(slots=True)
class MossAssetDocumentSet:
    asset_type: str
    label: str
    index_name: str
    docs: list[DocumentInfo]


def _slug(value: str) -> str:
    normalized = "".join(char.lower() if char.isalnum() else "-" for char in value)
    parts = [part for part in normalized.split("-") if part]
    return "-".join(parts)[:80] or "item"


def _hash(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:16]


def _metadata(**values: Any) -> dict[str, str]:
    metadata: dict[str, str] = {}
    for key, value in values.items():
        if value is None:
            continue
        if isinstance(value, str):
            metadata[key] = value
        elif isinstance(value, (int, float, bool)):
            metadata[key] = str(value)
        else:
            metadata[key] = json.dumps(value, sort_keys=True)
    return metadata


def _doc(doc_id: str, text: str, **metadata: Any) -> DocumentInfo:
    return DocumentInfo(id=doc_id, text=text.strip(), metadata=_metadata(**metadata))


def _citation_key(candidate_name: str, usage: str, citation: Citation) -> str:
    return _hash(
        "|".join(
            [
                candidate_name,
                usage,
                citation.title,
                citation.source,
                citation.url,
                citation.evidence_type,
            ]
        )
    )


def _protocol_documents(
    analysis: AgenticAnalysisResult, protocol_id: str, run_id: str | None, run_key: str | None
) -> list[DocumentInfo]:
    protocol = analysis.protocol
    docs = [
        _doc(
            f"protocol:{protocol_id}:summary",
            "\n".join(
                [
                    f"Protocol: {protocol.title}",
                    f"Indication: {protocol.indication}",
                    f"Intervention: {protocol.intervention}",
                    f"Phase: {protocol.phase}",
                    f"Population: {protocol.population}",
                    f"Geography: {', '.join(protocol.geography)}",
                    f"Endpoints: {', '.join(protocol.endpoints)}",
                    f"Inclusion criteria: {', '.join(protocol.inclusion_criteria)}",
                    f"Exclusion criteria: {', '.join(protocol.exclusion_criteria)}",
                    f"Relevant specialties: {', '.join(protocol.relevant_specialties)}",
                    f"Agentic answer: {analysis.answer}",
                ]
            ),
            protocol_id=protocol_id,
            run_id=run_id,
            run_key=run_key,
            asset_type="PROTOCOL_CHUNK",
            object_type="protocol_summary",
            title=protocol.title,
            indication=protocol.indication,
            intervention=protocol.intervention,
            phase=protocol.phase,
            source="KOL Copilot Agentic Analysis",
        )
    ]

    for index, group in enumerate(analysis.search_query_groups):
        docs.append(
            _doc(
                f"protocol:{protocol_id}:search-group:{index}:{_slug(group.name)}",
                "\n".join(
                    [
                        f"Search query group: {group.name}",
                        f"Source targets: {', '.join(group.source_targets)}",
                        f"Status: {group.status}",
                        f"Result count: {group.result_count}",
                        "Queries:",
                        *[f"- {query}" for query in group.queries],
                    ]
                ),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="PROTOCOL_CHUNK",
                object_type="search_query_group",
                title=group.name,
                source_targets=group.source_targets,
                source="KOL Copilot Agentic Analysis",
            )
        )

    if analysis.compliance_notes:
        docs.append(
            _doc(
                f"protocol:{protocol_id}:compliance-notes",
                "\n".join(
                    [
                        "Medical Affairs compliance notes:",
                        *[
                            f"- {note.severity}: {note.message}"
                            for note in analysis.compliance_notes
                        ],
                    ]
                ),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="PROTOCOL_CHUNK",
                object_type="compliance_notes",
                source="KOL Copilot Agentic Analysis",
            )
        )

    if analysis.audit_trail:
        docs.append(
            _doc(
                f"protocol:{protocol_id}:audit-trail",
                "\n".join(["Agentic analysis audit trail:", *analysis.audit_trail]),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="PROTOCOL_CHUNK",
                object_type="audit_trail",
                source="KOL Copilot Agentic Analysis",
            )
        )

    return docs


def _evidence_documents(
    analysis: AgenticAnalysisResult, protocol_id: str, run_id: str | None, run_key: str | None
) -> list[DocumentInfo]:
    docs: list[DocumentInfo] = []
    for index, item in enumerate(analysis.evidence):
        linked_kols = item.linked_kols or ["Protocol-level"]
        for kol_name in linked_kols:
            docs.append(
                _doc(
                    f"evidence:{protocol_id}:{index}:{_slug(kol_name)}:{_hash(item.url or item.title)}",
                    "\n".join(
                        [
                            f"Evidence title: {item.title}",
                            f"Source: {item.source}",
                            f"Evidence type: {item.evidence_type}",
                            f"Linked KOL: {kol_name}",
                            f"Snippet: {item.snippet}",
                        ]
                    ),
                    protocol_id=protocol_id,
                    run_id=run_id,
                    run_key=run_key,
                    asset_type="EVIDENCE_CHUNK",
                    object_type="evidence_snippet",
                    name=kol_name,
                    expert_name=kol_name,
                    title=item.title,
                    source=item.source,
                    url=item.url,
                    source_url=item.url,
                    evidence_type=item.evidence_type,
                    score=item.score,
                    strength=item.strength,
                    published_at=item.published_at,
                )
            )
    return docs


def _expert_documents(
    analysis: AgenticAnalysisResult, protocol_id: str, run_id: str | None, run_key: str | None
) -> list[DocumentInfo]:
    docs: list[DocumentInfo] = []
    for candidate in analysis.top_kols:
        docs.append(
            _doc(
                f"expert:{protocol_id}:{_slug(candidate.name)}",
                "\n".join(
                    [
                        f"KOL: {candidate.name}",
                        f"Institution: {candidate.institution}",
                        f"Specialty: {candidate.specialty}",
                        f"Geography: {candidate.geography}",
                        f"Protocol score: {candidate.score}",
                        f"Rationale: {candidate.rationale}",
                        f"Suggested next action: {candidate.suggested_next_action}",
                        "Compliance flags:",
                        *[f"- {flag}" for flag in candidate.compliance_flags],
                    ]
                ),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="EXPERT_PROFILE",
                object_type="expert_profile",
                name=candidate.name,
                expert_name=candidate.name,
                institution=candidate.institution,
                specialty=candidate.specialty,
                geography=candidate.geography,
                score=candidate.score,
                source="KOL Copilot Agentic Analysis",
            )
        )
    return docs


def _ranking_documents(
    analysis: AgenticAnalysisResult, protocol_id: str, run_id: str | None, run_key: str | None
) -> list[DocumentInfo]:
    docs: list[DocumentInfo] = []
    for rank, candidate in enumerate(analysis.top_kols, start=1):
        breakdown = candidate.score_breakdown
        docs.append(
            _doc(
                f"ranking:{protocol_id}:{rank}:{_slug(candidate.name)}",
                "\n".join(
                    [
                        f"Rank {rank}: {candidate.name}",
                        f"Total score: {candidate.score}",
                        f"Protocol match: {breakdown.protocol_match} / 30",
                        f"Trial investigator experience: {breakdown.trial_experience} / 25",
                        f"Publication relevance: {breakdown.publication_relevance} / 20",
                        f"Institution/site relevance: {breakdown.institution_site_relevance} / 10",
                        f"Congress/guideline influence: {breakdown.congress_guideline_influence} / 10",
                        f"Recency: {breakdown.recency} / 5",
                        f"Compliance adjustment: {breakdown.compliance_adjustment}",
                        f"Rationale: {candidate.rationale}",
                    ]
                ),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="RANKING_METADATA",
                object_type="ranking_metadata",
                name=candidate.name,
                expert_name=candidate.name,
                rank=rank,
                score=candidate.score,
                score_breakdown=breakdown.model_dump(mode="json"),
                source="KOL Copilot Agentic Analysis",
            )
        )
    return docs


def _citation_documents(
    analysis: AgenticAnalysisResult, protocol_id: str, run_id: str | None, run_key: str | None
) -> list[DocumentInfo]:
    docs: list[DocumentInfo] = []
    seen: set[str] = set()

    def add(candidate_name: str, usage: str, citation: Citation) -> None:
        key = _citation_key(candidate_name, usage, citation)
        if key in seen:
            return
        seen.add(key)
        docs.append(
            _doc(
                f"citation:{protocol_id}:{_slug(candidate_name)}:{key}",
                "\n".join(
                    [
                        f"Citation for: {candidate_name}",
                        f"Usage: {usage}",
                        f"Title: {citation.title}",
                        f"Source: {citation.source}",
                        f"Evidence type: {citation.evidence_type}",
                        f"Snippet: {citation.snippet}",
                    ]
                ),
                protocol_id=protocol_id,
                run_id=run_id,
                run_key=run_key,
                asset_type="SOURCE_CITATION",
                object_type="citation",
                name=candidate_name,
                expert_name=candidate_name,
                title=citation.title,
                source=citation.source,
                url=citation.url,
                source_url=citation.url,
                evidence_type=citation.evidence_type,
                usage=usage,
            )
        )

    for candidate in analysis.top_kols:
        for citation in candidate.citations:
            add(candidate.name, "ranking_rationale", citation)

    if analysis.msl_brief:
        for citation in analysis.msl_brief.citations:
            add(analysis.msl_brief.expert_name, "brief_claim", citation)

    return docs


def _brief_documents(
    brief: MslBrief | None,
    protocol_id: str,
    run_id: str | None,
    run_key: str | None,
) -> list[DocumentInfo]:
    if not brief:
        return []

    return [
        _doc(
            f"brief:{protocol_id}:{_slug(brief.expert_name)}",
            "\n".join(
                [
                    f"MSL pre-call brief for {brief.expert_name}",
                    f"Scientific background: {brief.scientific_background}",
                    f"Relevance rationale: {brief.relevance_rationale}",
                    "Suggested non-promotional questions:",
                    *[f"- {question}" for question in brief.suggested_questions],
                    "Compliance warnings:",
                    *[f"- {warning}" for warning in brief.compliance_warnings],
                ]
            ),
            protocol_id=protocol_id,
            run_id=run_id,
            run_key=run_key,
            asset_type="BRIEF",
            object_type="msl_brief",
            name=brief.expert_name,
            expert_name=brief.expert_name,
            source="KOL Copilot Agentic Analysis",
        )
    ]


def build_moss_asset_documents(
    analysis: AgenticAnalysisResult,
    *,
    protocol_id: str | None = None,
    run_id: str | None = None,
    run_key: str | None = None,
    protocol_index_name: str | None = None,
    expert_index_name: str | None = None,
) -> list[MossAssetDocumentSet]:
    resolved_protocol_id = protocol_id or analysis.protocol.protocol_id
    protocol_index = protocol_index_name or os.getenv(
        "MOSS_PROTOCOL_INDEX_NAME", DEFAULT_PROTOCOL_INDEX
    )
    expert_index = expert_index_name or os.getenv(
        "MOSS_EXPERT_INDEX_NAME", DEFAULT_EXPERT_INDEX
    )

    return [
        MossAssetDocumentSet(
            asset_type="PROTOCOL_CHUNK",
            label="Protocol summary, search plan, compliance, and audit",
            index_name=protocol_index,
            docs=_protocol_documents(analysis, resolved_protocol_id, run_id, run_key),
        ),
        MossAssetDocumentSet(
            asset_type="EVIDENCE_CHUNK",
            label="Evidence chunks",
            index_name=expert_index,
            docs=_evidence_documents(analysis, resolved_protocol_id, run_id, run_key),
        ),
        MossAssetDocumentSet(
            asset_type="EXPERT_PROFILE",
            label="KOL profiles",
            index_name=expert_index,
            docs=_expert_documents(analysis, resolved_protocol_id, run_id, run_key),
        ),
        MossAssetDocumentSet(
            asset_type="RANKING_METADATA",
            label="Ranking metadata",
            index_name=expert_index,
            docs=_ranking_documents(analysis, resolved_protocol_id, run_id, run_key),
        ),
        MossAssetDocumentSet(
            asset_type="SOURCE_CITATION",
            label="Source citations",
            index_name=expert_index,
            docs=_citation_documents(analysis, resolved_protocol_id, run_id, run_key),
        ),
        MossAssetDocumentSet(
            asset_type="BRIEF",
            label="MSL brief",
            index_name=expert_index,
            docs=_brief_documents(analysis.msl_brief, resolved_protocol_id, run_id, run_key),
        ),
    ]


async def _maybe_await(value):
    if inspect.isawaitable(value):
        return await value
    return value


async def _index_docs(
    client: MossClient, index_name: str, docs: list[DocumentInfo], model_id: str
) -> dict[str, Any]:
    indexes = await _maybe_await(client.list_indexes())
    existing_names = {getattr(index, "name", None) for index in indexes}

    if index_name in existing_names:
        result = await _maybe_await(
            client.add_docs(index_name, docs, MutationOptions(upsert=True))
        )
        operation = "add_docs"
    else:
        result = await _maybe_await(client.create_index(index_name, docs, model_id))
        operation = "create_index"

    with_error: str | None = None
    try:
        await _maybe_await(client.load_index(index_name))
    except Exception as exc:  # pragma: no cover - live-service timing dependent
        with_error = f"{type(exc).__name__}: {exc}"

    return {
        "index_name": index_name,
        "operation": operation,
        "doc_count": len(docs),
        "job_id": getattr(result, "job_id", None),
        "result_index_name": getattr(result, "index_name", None),
        "load_error": with_error,
    }


async def index_agentic_analysis(
    analysis: AgenticAnalysisResult,
    *,
    protocol_id: str | None = None,
    run_id: str | None = None,
    run_key: str | None = None,
) -> dict[str, Any]:
    load_project_env()
    project_id = os.getenv("MOSS_PROJECT_ID")
    project_key = os.getenv("MOSS_PROJECT_KEY")
    if not project_id or not project_key:
        raise OSError("Missing MOSS_PROJECT_ID or MOSS_PROJECT_KEY.")

    model_id = os.getenv("MOSS_MODEL_ID", DEFAULT_MODEL_ID)
    assets = build_moss_asset_documents(
        analysis,
        protocol_id=protocol_id,
        run_id=run_id,
        run_key=run_key,
    )
    client = MossClient(project_id, project_key)
    indexed_by_name: dict[str, dict[str, Any]] = {}

    for index_name in sorted({asset.index_name for asset in assets if asset.docs}):
        docs = [
            doc
            for asset in assets
            if asset.index_name == index_name
            for doc in asset.docs
        ]
        indexed_by_name[index_name] = await _index_docs(client, index_name, docs, model_id)

    return {
        "ok": True,
        "model_id": model_id,
        "indexes": indexed_by_name,
        "assets": [
            {
                "asset_type": asset.asset_type,
                "label": asset.label,
                "index_name": asset.index_name,
                "document_ids": [doc.id for doc in asset.docs],
                "doc_count": len(asset.docs),
            }
            for asset in assets
        ],
        "document_count": sum(len(asset.docs) for asset in assets),
    }


def _payload_from_args(args: argparse.Namespace) -> dict[str, Any]:
    if args.input:
        with open(args.input, encoding="utf-8") as handle:
            analysis = json.load(handle)
        return {"analysis": analysis}

    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("Expected JSON payload on stdin or --input path.")
    return json.loads(raw)


async def _main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="Path to an Agentic Analysis JSON snapshot.")
    parser.add_argument("--protocol-id")
    parser.add_argument("--run-id")
    parser.add_argument("--run-key")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build and print document metadata without contacting Moss.",
    )
    args = parser.parse_args()
    payload = _payload_from_args(args)
    analysis = AgenticAnalysisResult.model_validate(payload["analysis"])
    protocol_id = args.protocol_id or payload.get("protocol_id")
    run_id = args.run_id or payload.get("run_id")
    run_key = args.run_key or payload.get("run_key")

    if args.dry_run:
        load_project_env()
        assets = build_moss_asset_documents(
            analysis,
            protocol_id=protocol_id,
            run_id=run_id,
            run_key=run_key,
        )
        print(
            json.dumps(
                {
                    "ok": True,
                    "dry_run": True,
                    "assets": [
                        {
                            "asset_type": asset.asset_type,
                            "label": asset.label,
                            "index_name": asset.index_name,
                            "doc_count": len(asset.docs),
                            "document_ids": [doc.id for doc in asset.docs],
                        }
                        for asset in assets
                    ],
                    "document_count": sum(len(asset.docs) for asset in assets),
                },
                indent=2,
            )
        )
        return

    report = await index_agentic_analysis(
        analysis,
        protocol_id=protocol_id,
        run_id=run_id,
        run_key=run_key,
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    asyncio.run(_main())
