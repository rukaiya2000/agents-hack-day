import builtins
from typing import ClassVar

import pytest

import kol_copilot.tools as tools_module
from kol_copilot.analysis import run_agentic_analysis
from kol_copilot.moss_indexer import build_moss_asset_documents
from kol_copilot.pipeline_store import load_agentic_analysis
from kol_copilot.runner import run_kol_query, voice_summary
from kol_copilot.schemas import (
    AgenticAnalysisResult,
    Citation,
    KolCandidate,
    MslBrief,
    PipelineEvidenceSnippet,
    PipelineSearchQueryGroup,
    ProtocolProfile,
    ScoreBreakdown,
)
from kol_copilot.tools import (
    build_context_from_env,
    retrieve_and_rank_kols,
    scan_compliance,
)


class _FakeMossDoc:
    def __init__(self) -> None:
        self.text = "Moss evidence for Dr. Loaded Index."
        self.score = 0.91
        self.metadata = {
            "name": "Dr. Loaded Index",
            "institution": "Moss Medical Center",
            "specialty": "infectious disease",
            "geography": "United States",
            "title": "Loaded Moss KOL evidence",
            "source": "Moss test index",
            "url": "moss://loaded-index",
            "evidence_type": "expert_profile",
        }


class _FakeMossResult:
    def __init__(self) -> None:
        self.docs = [_FakeMossDoc()]


class _FakeKolMossClient:
    instances: ClassVar[list["_FakeKolMossClient"]] = []

    def __init__(self, *_args, **_kwargs) -> None:
        self.load_index_calls: list[str] = []
        self.query_calls: list[tuple] = []
        self.instances.append(self)

    async def load_index(self, index_name: str) -> str:
        self.load_index_calls.append(index_name)
        return index_name

    async def query(self, index_name: str, query: str, options=None) -> _FakeMossResult:
        self.query_calls.append((index_name, query, options))
        return _FakeMossResult()


@pytest.mark.asyncio
async def test_run_kol_query_falls_back_without_openai_key(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    result = await run_kol_query(
        "Find top infectious disease KOLs for this COVID vaccine protocol.",
        user_id="user_test",
    )

    assert result.top_kols
    assert result.top_kols[0].score > 0
    assert result.protocol.indication == "COVID-19 prevention"
    assert result.compliance_notes[0].severity == "info"
    assert "fallback" in " ".join(result.audit_trail).lower()
    assert "prescribing" not in result.top_kols[0].suggested_next_action.lower()


@pytest.mark.asyncio
async def test_run_kol_query_prefer_local_bypasses_agents_sdk(monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.delenv("MOSS_PROJECT_ID", raising=False)
    monkeypatch.delenv("MOSS_PROJECT_KEY", raising=False)
    real_import = builtins.__import__

    def fail_agents_import(name, *args, **kwargs):
        if name == "agents" or name.startswith("agents."):
            raise AssertionError("prefer_local should bypass the Agents SDK")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", fail_agents_import)

    result = await run_kol_query(
        "Find top infectious disease KOLs for this COVID vaccine protocol.",
        user_id="user_test",
        prefer_local=True,
    )

    assert result.top_kols
    assert "fast path" in " ".join(result.audit_trail).lower()


@pytest.mark.asyncio
async def test_run_kol_query_can_return_brief_in_fallback(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    result = await run_kol_query(
        "Draft a compliant MSL pre-call brief for the top expert.",
        user_id="user_test",
    )

    assert result.msl_brief is not None
    assert result.msl_brief.suggested_questions
    assert result.msl_brief.compliance_warnings
    assert result.msl_brief.citations


def test_compliance_scan_blocks_promotional_targeting() -> None:
    notes = scan_compliance(
        "Target this physician before approval to drive commercial adoption."
    )

    assert notes[0].severity == "block"


@pytest.mark.asyncio
async def test_retrieve_and_rank_loads_moss_index_before_query(monkeypatch) -> None:
    monkeypatch.setenv("MOSS_PROJECT_ID", "project")
    monkeypatch.setenv("MOSS_PROJECT_KEY", "key")
    monkeypatch.setenv("MOSS_EXPERT_INDEX_NAME", "kol_experts")
    _FakeKolMossClient.instances.clear()
    monkeypatch.setattr(tools_module, "MossClient", _FakeKolMossClient)

    context = build_context_from_env(
        user_id="user_test",
        protocol_id="TEST-301",
        protocol_profile=ProtocolProfile(protocol_id="TEST-301"),
    )
    candidates = await retrieve_and_rank_kols(context, "loaded index evidence", limit=1)

    client = _FakeKolMossClient.instances[0]
    assert client.load_index_calls == ["kol_experts"]
    assert client.query_calls[0][0] == "kol_experts"
    assert candidates[0].name == "Dr. Loaded Index"


def test_moss_indexer_builds_documents_for_all_agentic_assets() -> None:
    citation = Citation(
        title="Trial registry record",
        source="ClinicalTrials.gov",
        url="https://clinicaltrials.gov/study/example",
        evidence_type="trial_registry",
        snippet="Investigator-led Phase 3 vaccine trial evidence.",
    )
    candidate = KolCandidate(
        name="Dr. Example KOL",
        institution="Example University",
        specialty="infectious disease",
        geography="United States",
        score=88.0,
        score_breakdown=ScoreBreakdown(
            protocol_match=27,
            trial_experience=22,
            publication_relevance=18,
            institution_site_relevance=8,
            congress_guideline_influence=8,
            recency=5,
        ),
        rationale="Direct protocol match with trial and publication evidence.",
        suggested_next_action="Prepare a non-promotional MSL scientific exchange.",
        citations=[citation],
    )
    analysis = AgenticAnalysisResult(
        answer="Found protocol-relevant KOL evidence.",
        protocol=ProtocolProfile(protocol_id="TEST-301"),
        search_query_groups=[
            PipelineSearchQueryGroup(
                name="Trial investigators",
                source_targets=["ClinicalTrials.gov"],
                queries=["COVID vaccine Phase 3 investigator"],
            )
        ],
        evidence=[
            PipelineEvidenceSnippet(
                title="Trial registry record",
                source="ClinicalTrials.gov",
                url="https://clinicaltrials.gov/study/example",
                evidence_type="trial_registry",
                snippet="Investigator-led Phase 3 vaccine trial evidence.",
                linked_kols=["Dr. Example KOL"],
            )
        ],
        top_kols=[candidate],
        compliance_notes=[],
        msl_brief=MslBrief(
            expert_name="Dr. Example KOL",
            scientific_background="Relevant investigator background.",
            relevance_rationale="Protocol-specific rationale.",
            suggested_questions=["What endpoint considerations matter most?"],
            compliance_warnings=["Avoid promotional claims."],
            citations=[citation],
        ),
        audit_trail=["Structured output generated."],
    )

    assets = build_moss_asset_documents(
        analysis,
        protocol_id="TEST-301",
        run_id="run_test",
        run_key="run_agentic_test",
        protocol_index_name="protocols",
        expert_index_name="kol_experts",
    )

    by_type = {asset.asset_type: asset for asset in assets}
    assert set(by_type) == {
        "PROTOCOL_CHUNK",
        "EVIDENCE_CHUNK",
        "EXPERT_PROFILE",
        "RANKING_METADATA",
        "SOURCE_CITATION",
        "BRIEF",
    }
    assert by_type["PROTOCOL_CHUNK"].index_name == "protocols"
    assert by_type["EVIDENCE_CHUNK"].index_name == "kol_experts"
    assert by_type["PROTOCOL_CHUNK"].docs
    assert by_type["EVIDENCE_CHUNK"].docs
    assert by_type["EXPERT_PROFILE"].docs[0].metadata["name"] == "Dr. Example KOL"
    assert by_type["RANKING_METADATA"].docs[0].metadata["score"] == "88.0"
    assert by_type["SOURCE_CITATION"].docs
    assert by_type["BRIEF"].docs


@pytest.mark.asyncio
async def test_agentic_analysis_marks_local_fallback(monkeypatch, tmp_path) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS", raising=False)
    monkeypatch.setenv("KOL_COPILOT_ANALYSIS_DIR", str(tmp_path))

    profile = ProtocolProfile()
    result = await run_agentic_analysis(
        protocol=profile,
        query="Run agentic analysis for this protocol.",
        user_id="user_test",
    )

    assert result.analysis_source == "local_fallback"
    assert result.is_fallback is True
    assert result.fallback_reason == "OPENAI_API_KEY was not set."
    assert result.top_kols

    (tmp_path / f"{profile.protocol_id}.json").write_text(result.model_dump_json())
    assert load_agentic_analysis(profile.protocol_id) is None

    monkeypatch.setenv("KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS", "1")
    assert load_agentic_analysis(profile.protocol_id) is not None


@pytest.mark.asyncio
async def test_voice_summary_is_concise(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    result = await run_kol_query("Who are the top KOLs?", user_id="user_test")
    summary = voice_summary(result)

    assert result.top_kols[0].name in summary
    assert len(summary.split()) < 25
