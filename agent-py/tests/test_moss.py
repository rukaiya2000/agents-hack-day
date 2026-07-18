"""Unit tests for the agent's three Moss-backed tools.

Unlike the LLM-judged evals in `test_agent.py`, these are deterministic unit
tests that exercise the tool methods directly. They stub `MossClient` via
monkeypatch so they run with no Moss credentials and no network access — the
live, credentialed behavior is validated in the live-test task.
"""

import json

import pytest

import agent as agent_module
from agent import Assistant

USER_ID = "user_42"


class _FakeDoc:
    """Stand-in for a Moss query-result document (`.text/.score/.metadata`)."""

    def __init__(self, text: str, score=None, metadata=None) -> None:
        self.text = text
        self.score = score
        self.metadata = metadata


class _FakeSearchResult:
    """Stand-in for a Moss `SearchResult` (`.docs/.time_taken_ms`)."""

    def __init__(self, docs, time_taken_ms: float = 12.5) -> None:
        self.docs = docs
        self.time_taken_ms = time_taken_ms


class _FakeMossClient:
    """Records calls instead of contacting Moss. Substituted for `MossClient`.

    `MossClient(project_id, project_key)` is constructed inside
    `Assistant.__init__`, so each Assistant gets its own instance, reachable in
    tests as `assistant._moss`.
    """

    def __init__(self, *args, **kwargs) -> None:
        self.load_index_calls: list[str] = []
        self.query_calls: list[tuple] = []
        self.add_docs_calls: list[tuple] = []
        # Default empty result; tests override before invoking a tool.
        self.query_result = _FakeSearchResult([])

    async def load_index(self, name, *args, **kwargs):
        self.load_index_calls.append(name)

    async def query(self, index, query, options=None):
        self.query_calls.append((index, query, options))
        return self.query_result

    async def add_docs(self, index, docs, options=None):
        self.add_docs_calls.append((index, docs, options))
        return None


class _FakePublisher:
    def __init__(self) -> None:
        self.published: list[tuple] = []

    async def publish_data(self, payload, reliable=None):
        self.published.append((payload, reliable))


class _FakeRoom:
    def __init__(self) -> None:
        self.local_participant = _FakePublisher()


@pytest.fixture
def stub_moss(monkeypatch):
    """Replace the agent's `MossClient` with the recording fake."""
    monkeypatch.setenv("LIVEKIT_API_KEY", "test-livekit-key")
    monkeypatch.setenv("LIVEKIT_API_SECRET", "test-livekit-secret")
    monkeypatch.setenv("MOSS_PROJECT_ID", "test-moss-project")
    monkeypatch.setenv("MOSS_PROJECT_KEY", "test-moss-key")
    monkeypatch.setattr(agent_module, "MossClient", _FakeMossClient)


def test_voice_turn_handling_defaults_are_latency_tuned(monkeypatch) -> None:
    monkeypatch.delenv("VOICE_TURN_DETECTION_MODE", raising=False)
    monkeypatch.delenv("VOICE_ENDPOINTING_MODE", raising=False)
    monkeypatch.delenv("VOICE_MIN_ENDPOINTING_DELAY", raising=False)
    monkeypatch.delenv("VOICE_MAX_ENDPOINTING_DELAY", raising=False)
    monkeypatch.delenv("VOICE_AUDIO_ENHANCEMENT", raising=False)

    turn_handling = agent_module._voice_turn_handling()

    assert turn_handling["turn_detection"] == "vad"
    assert turn_handling["endpointing"] == {
        "mode": "fixed",
        "min_delay": 0.2,
        "max_delay": 1.2,
    }
    assert turn_handling["interruption"]["enabled"] is True
    assert turn_handling["interruption"]["mode"] == "vad"
    assert turn_handling["preemptive_generation"]["preemptive_tts"] is True
    assert agent_module._voice_noise_cancellation() is None


async def test_search_knowledge_returns_joined_text_and_publishes_context(
    stub_moss,
) -> None:
    """search_knowledge joins snippets and publishes a well-formed payload."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc("First snippet.", score=0.9, metadata={"source": "docs"}),
            _FakeDoc("Second snippet.", score=0.8),
        ],
        time_taken_ms=7.0,
    )

    result = await assistant.search_knowledge(None, "how does turn detection work?")

    # Returns the snippets joined as plain text.
    assert result == "First snippet.\n\nSecond snippet."

    # Queried the knowledge (RAG) index with the user's query.
    assert len(assistant._moss.query_calls) == 1
    index, query, options = assistant._moss.query_calls[0]
    assert index == agent_module.KNOWLEDGE_INDEX
    assert query == "how does turn detection work?"
    assert options.top_k == 3

    # Published exactly one moss_context message, reliably.
    assert len(room.local_participant.published) == 1
    payload_bytes, reliable = room.local_participant.published[0]
    assert reliable is True

    payload = json.loads(payload_bytes.decode("utf-8"))
    assert payload["type"] == "moss_context"
    data = payload["data"]
    # Contractual keys consumed by the frontend parser.
    assert set(data) == {"query", "matches", "time_taken_ms", "timestamp"}
    assert data["query"] == "how does turn detection work?"
    assert data["time_taken_ms"] == 7.0
    assert isinstance(data["timestamp"], (int, float))

    matches = data["matches"]
    assert len(matches) == 2
    assert matches[0]["text"] == "First snippet."
    assert matches[0]["score"] == 0.9
    assert matches[0]["metadata"] == {"source": "docs"}
    assert matches[1]["text"] == "Second snippet."


def test_assistant_instructions_describe_deal_hunter(stub_moss) -> None:
    """The agent should be scoped to the Deal Hunter shopping persona and tools."""
    assistant = Assistant(user_id=USER_ID)

    instructions = assistant.instructions
    assert "Deal Hunter" in instructions
    # It should steer toward the price-search tool and the memory tools.
    assert "find_deals" in instructions
    assert "remember_fact" in instructions
    assert "recall_facts" in instructions
    # And it must not invent prices/retailers.
    assert "Never invent a price" in instructions


async def test_remember_fact_adds_doc_with_user_metadata(stub_moss) -> None:
    """remember_fact upserts a memory doc tagged with the caller's user_id."""
    assistant = Assistant(user_id=USER_ID)

    fact = "I am building a drive-thru ordering agent."
    result = await assistant.remember_fact(None, fact)
    assert isinstance(result, str) and result

    assert len(assistant._moss.add_docs_calls) == 1
    index, docs, _options = assistant._moss.add_docs_calls[0]
    assert index == agent_module.MEMORY_INDEX
    assert len(docs) == 1

    doc = docs[0]
    assert doc.text == fact
    assert doc.metadata == {"user_id": USER_ID}
    # Document ids are namespaced by user so writes never collide across users.
    assert doc.id.startswith(f"{USER_ID}-")


async def test_recall_facts_filters_by_user_id(stub_moss) -> None:
    """recall_facts scopes the memory query to the caller via a metadata filter."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc("They are building a drive-thru ordering agent."),
            _FakeDoc("Their name is Alex."),
        ]
    )

    result = await assistant.recall_facts(None, "what am I building?")

    assert result == (
        "They are building a drive-thru ordering agent.\nTheir name is Alex."
    )

    assert len(assistant._moss.query_calls) == 1
    index, query, options = assistant._moss.query_calls[0]
    assert index == agent_module.MEMORY_INDEX
    assert query == "what am I building?"
    assert options.top_k == 5
    # Per-user isolation: the filter must pin user_id to this caller.
    assert options.filter == {
        "field": "user_id",
        "condition": {"$eq": USER_ID},
    }

    # recall_facts also surfaces context to the frontend panel.
    assert len(room.local_participant.published) == 1


async def test_watch_item_stores_structured_watch_and_publishes(stub_moss) -> None:
    """watch_item writes a `kind=watch` doc and publishes the updated list."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    # The post-write refresh reads the watch back out of Moss.
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc(
                "Watching Sony WH-1000XM5 for a price drop below 130 dollars.",
                metadata={
                    "user_id": USER_ID,
                    "kind": "watch",
                    "product": "Sony WH-1000XM5",
                    "target_price": "130.0",
                },
            )
        ]
    )

    reply = await assistant.watch_item(None, "Sony WH-1000XM5", 130)

    # Stored with structured metadata so the UI can render it.
    assert len(assistant._moss.add_docs_calls) == 1
    _index, docs, _options = assistant._moss.add_docs_calls[0]
    metadata = docs[0].metadata
    assert metadata["kind"] == "watch"
    assert metadata["product"] == "Sony WH-1000XM5"
    assert metadata["target_price"] == "130"
    assert metadata["user_id"] == USER_ID

    # Spoken confirmation names the product and the target.
    assert "Sony WH-1000XM5" in reply
    assert "130" in reply

    # Publishes a watchlist payload for the UI panel.
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["type"] == "watchlist"
    assert message["data"]["count"] == 1
    assert message["data"]["watches"][0] == {
        "product": "Sony WH-1000XM5",
        "target_price": 130.0,
    }


async def test_watch_item_without_target_price(stub_moss) -> None:
    """A watch with no threshold still saves and reads back with target None."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc(
                "Watching AirPods Pro for a price drop.",
                metadata={
                    "user_id": USER_ID,
                    "kind": "watch",
                    "product": "AirPods Pro",
                    "target_price": "",
                },
            )
        ]
    )

    reply = await assistant.watch_item(None, "AirPods Pro")

    assert "AirPods Pro" in reply
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["data"]["watches"][0]["target_price"] is None


async def test_list_watches_filters_non_watch_memories_and_dedupes(
    stub_moss, monkeypatch
) -> None:
    """Only `kind=watch` docs count, and repeated products collapse to one."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    # Keep the live price re-check offline.
    monkeypatch.setattr(Assistant, "_current_best", _no_price)
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc(
                "Watching Sony WH-1000XM5 below 130 dollars.",
                metadata={
                    "kind": "watch",
                    "product": "Sony WH-1000XM5",
                    "target_price": "130",
                },
            ),
            # A plain remembered fact must not show up as a watch.
            _FakeDoc("My name is Sam.", metadata={"user_id": USER_ID}),
            # Duplicate product (different casing) collapses to the first.
            _FakeDoc(
                "Watching sony wh-1000xm5 again.",
                metadata={
                    "kind": "watch",
                    "product": "sony wh-1000xm5",
                    "target_price": "99",
                },
            ),
        ]
    )

    reply = await assistant.list_watches(None)

    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["data"]["count"] == 1
    assert message["data"]["watches"][0]["product"] == "Sony WH-1000XM5"
    assert "Sony WH-1000XM5" in reply


async def test_list_watches_empty(stub_moss, monkeypatch) -> None:
    """An empty watchlist reads back cleanly and still publishes."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    assistant._moss.query_result = _FakeSearchResult([])

    reply = await assistant.list_watches(None)

    assert "empty" in reply.lower()
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["type"] == "watchlist"
    assert message["data"]["count"] == 0


async def _no_price(self, product):
    """Stub for `Assistant._current_best` — no live lookup in unit tests."""
    return {}


async def test_list_watches_attaches_current_price_and_flags_target_hit(
    stub_moss, monkeypatch
) -> None:
    """A refreshed watch carries its live price, and a hit target is announced."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    assistant._moss.query_result = _FakeSearchResult(
        [
            _FakeDoc(
                "Watching Sony WH-1000XM5 below 200 dollars.",
                metadata={
                    "kind": "watch",
                    "product": "Sony WH-1000XM5",
                    "target_price": "200",
                },
            )
        ]
    )

    async def fake_best(self, product):
        return {
            "current_price": 147.0,
            "current_source": "Amazon",
            "current_url": "https://example.com/xm5",
        }

    monkeypatch.setattr(Assistant, "_current_best", fake_best)

    reply = await assistant.list_watches(None)

    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    watch = message["data"]["watches"][0]
    assert watch["current_price"] == 147.0
    assert watch["current_source"] == "Amazon"
    assert watch["current_url"] == "https://example.com/xm5"

    # 147 is under the 200 target, so it should be surfaced as good news.
    assert "good news" in reply.lower()
    assert "147" in reply


class _FakeSession:
    """Records `session.say()` filler lines."""

    def __init__(self) -> None:
        self.said: list[str] = []

    def say(self, text):
        self.said.append(text)


class _FakeRunContext:
    def __init__(self) -> None:
        self.session = _FakeSession()


async def test_find_deals_speaks_a_filler_before_searching(
    stub_moss, monkeypatch
) -> None:
    """A slow search should not leave dead air on the call."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    ctx = _FakeRunContext()

    async def fake_find(query, **kwargs):
        # Filler must already have been spoken by the time the search runs.
        assert ctx.session.said, "expected a filler line before the search"
        return agent_module_deal_result_stub()

    monkeypatch.setattr("deal_hunter.finder.find_deals", fake_find, raising=False)
    monkeypatch.setattr(
        "deal_hunter.finder.voice_summary", lambda r: "summary", raising=False
    )
    # Don't spawn real background verification in a unit test.
    monkeypatch.setattr(Assistant, "_spawn_price_verification", lambda self, r: None)

    reply = await assistant.find_deals(ctx, "sony headphones")

    assert reply == "summary"
    assert ctx.session.said == ["Let me check the latest prices."]


def agent_module_deal_result_stub():
    """Minimal object satisfying `_publish_deal_result` (needs `as_dict`)."""

    class _R:
        def __init__(self):
            self.deals = []

        def as_dict(self):
            return {"query": "q", "country": "us", "count": 0, "deals": []}

    return _R()


async def test_say_filler_is_safe_without_a_session() -> None:
    """Tools stay callable (and silent) when there is no RunContext."""
    agent_module._say_filler(None, "hello")  # must not raise
