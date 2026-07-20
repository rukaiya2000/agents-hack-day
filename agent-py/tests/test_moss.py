"""Unit tests for the agent's memory, watchlist, and price-history tools.

Unlike the LLM-judged evals in `test_agent.py`, these are deterministic unit
tests that exercise the tool methods directly. They stub `MossClient` via
monkeypatch so they run with no Moss credentials and no network access — the
live, credentialed behavior is validated in the live-test task. Watches and
price history hit a real SQLite database, pointed at a tmp file by the autouse
fixture in `conftest.py`.
"""

import json
from unittest.mock import ANY

import pytest

import agent as agent_module
from agent import Assistant, DocsAgent
from deal_hunter import store

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
    moss = _FakeMossClient()
    # The docs Q&A path lives on its own agent now, reached by handoff.
    assistant = DocsAgent(room=room, user_id=USER_ID, moss=moss)
    moss.query_result = _FakeSearchResult(
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
    assert len(moss.query_calls) == 1
    index, query, options = moss.query_calls[0]
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


async def test_explain_the_demo_hands_off_to_the_docs_agent(stub_moss) -> None:
    """Technical questions leave the shopping agent entirely."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)

    handoff = await assistant.explain_the_demo(None)

    assert isinstance(handoff, DocsAgent)
    # The docs agent needs the same identity and Moss client to do its job.
    assert handoff._user_id == USER_ID
    assert handoff._moss is assistant._moss


async def test_back_to_shopping_hands_control_back(stub_moss) -> None:
    docs = DocsAgent(room=_FakeRoom(), user_id=USER_ID, moss=_FakeMossClient())

    handoff = await docs.back_to_shopping(None)

    assert isinstance(handoff, Assistant)
    assert handoff._user_id == USER_ID


def test_the_two_agents_have_disjoint_toolsets(stub_moss) -> None:
    """The point of the split: neither agent pays for the other's tools."""
    shopping = {t.info.name for t in Assistant(user_id=USER_ID).tools}
    docs = {t.info.name for t in DocsAgent(user_id=USER_ID).tools}

    assert "find_deals" in shopping
    assert "search_knowledge" not in shopping
    assert "search_knowledge" in docs
    assert "find_deals" not in docs
    # The only overlap should be the handoffs that connect them.
    assert shopping & docs == set()


def test_docs_agent_instructions_require_grounding(stub_moss) -> None:
    instructions = DocsAgent(user_id=USER_ID).instructions

    assert "search_knowledge" in instructions
    assert "back_to_shopping" in instructions


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


async def _no_price(self, product):
    """Stub for `Assistant._current_best` — no live lookup in unit tests."""
    return {}


class _FakeRpcData:
    """Stand-in for LiveKit's `RpcInvocationData` (only `.payload` is read)."""

    def __init__(self, payload: str) -> None:
        self.payload = payload
        self.caller_identity = "voice_assistant_user_1"


class _FakeTurnCtx:
    """Records messages injected via `turn_ctx.add_message`."""

    def __init__(self) -> None:
        self.messages: list[tuple] = []

    def add_message(self, role, content):
        self.messages.append((role, content))


async def test_deal_selected_rpc_records_the_selection(stub_moss) -> None:
    """A click on a deal card reaches the agent and is remembered."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)

    ack = await assistant._on_deal_selected(
        _FakeRpcData(
            json.dumps(
                {
                    "title": "Sony WH-1000XM5",
                    "url": "https://example.com/xm5",
                    "source": "Amazon",
                    "price": 248.0,
                }
            )
        )
    )

    assert json.loads(ack) == {"ok": True, "selected": "Sony WH-1000XM5"}
    assert assistant._selection["title"] == "Sony WH-1000XM5"
    assert assistant._selection["price"] == 248.0


async def test_deal_selected_rpc_can_clear_the_selection(stub_moss) -> None:
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    await assistant._on_deal_selected(_FakeRpcData(json.dumps({"title": "XM5"})))

    ack = await assistant._on_deal_selected(_FakeRpcData(json.dumps({"cleared": True})))

    assert json.loads(ack) == {"ok": True, "selected": None}
    assert assistant._selection is None


async def test_deal_selected_rpc_survives_malformed_payloads(stub_moss) -> None:
    """A bad payload from the browser must not raise into the RPC layer."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)

    bad_json = await assistant._on_deal_selected(_FakeRpcData("not json{"))
    no_title = await assistant._on_deal_selected(_FakeRpcData(json.dumps({"url": "x"})))

    assert json.loads(bad_json)["ok"] is False
    assert json.loads(no_title)["ok"] is False
    assert assistant._selection is None


async def test_selection_is_injected_into_the_users_turn(stub_moss) -> None:
    """The on-screen listing reaches the LLM so "this one" resolves."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    await assistant._on_deal_selected(
        _FakeRpcData(
            json.dumps({"title": "Sony WH-1000XM5", "source": "Amazon", "price": 248.0})
        )
    )

    turn_ctx = _FakeTurnCtx()
    await assistant.on_user_turn_completed(turn_ctx, _chat_message("watch this one"))

    assert len(turn_ctx.messages) == 1
    _role, content = turn_ctx.messages[0]
    assert "Sony WH-1000XM5" in content
    assert "248" in content
    assert "Amazon" in content


async def test_nothing_is_injected_without_a_selection(stub_moss) -> None:
    """No selection means no extra tokens on the turn."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)

    turn_ctx = _FakeTurnCtx()
    await assistant.on_user_turn_completed(turn_ctx, _chat_message("find me a tv"))

    assert turn_ctx.messages == []


def _chat_message(text: str):
    """Minimal stand-in for a `ChatMessage` — the hook only passes it through."""
    return type("_Msg", (), {"text_content": text})()


async def test_watch_item_stores_the_watch_and_publishes(stub_moss) -> None:
    """watch_item persists to the store and publishes the updated list."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)

    reply = await assistant.watch_item(None, "Sony WH-1000XM5", 130)

    # Persisted durably, not as a semantic memory doc.
    assert await store.list_watches(USER_ID) == [
        {"product": "Sony WH-1000XM5", "target_price": 130.0, "created_at": ANY}
    ]
    # Watches are not written to Moss any more.
    assert assistant._moss.add_docs_calls == []

    # Spoken confirmation names the product and the target.
    assert "Sony WH-1000XM5" in reply
    assert "130" in reply

    # Publishes a watchlist payload for the UI panel.
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["type"] == "watchlist"
    assert message["data"]["count"] == 1
    assert message["data"]["watches"][0]["product"] == "Sony WH-1000XM5"
    assert message["data"]["watches"][0]["target_price"] == 130.0


async def test_watch_item_without_target_price(stub_moss) -> None:
    """A watch with no threshold still saves and reads back with target None."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)

    reply = await assistant.watch_item(None, "AirPods Pro")

    assert "AirPods Pro" in reply
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["data"]["watches"][0]["target_price"] is None


async def test_watch_item_is_scoped_to_the_calling_user(stub_moss) -> None:
    """One user's watch never leaks into another's list."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    other = Assistant(room=_FakeRoom(), user_id="someone-else")

    await assistant.watch_item(None, "Sony WH-1000XM5", 130)

    assert await other.list_watches(None) == "The watchlist is empty right now."


async def test_rewatching_updates_the_target_instead_of_duplicating(
    stub_moss, monkeypatch
) -> None:
    """ "Watch it under 99 instead" revises the watch rather than adding a second."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    monkeypatch.setattr(Assistant, "_current_best", _no_price)

    await assistant.watch_item(None, "Sony WH-1000XM5", 130)
    await assistant.watch_item(None, "sony wh-1000xm5", 99)

    reply = await assistant.list_watches(None)

    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["data"]["count"] == 1
    assert message["data"]["watches"][0]["target_price"] == 99.0
    assert "Sony WH-1000XM5" in reply


async def test_unwatch_item_removes_and_reports(stub_moss, monkeypatch) -> None:
    """Stopping a watch clears it, and a no-op unwatch says so honestly."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    monkeypatch.setattr(Assistant, "_current_best", _no_price)
    await assistant.watch_item(None, "Sony WH-1000XM5", 130)

    reply = await assistant.unwatch_item(None, "sony wh-1000xm5")

    assert "Removed" in reply
    assert await store.list_watches(USER_ID) == []
    payload, _reliable = room.local_participant.published[-1]
    assert json.loads(payload.decode("utf-8"))["data"]["count"] == 0

    # Removing something that was never watched must not claim success.
    again = await assistant.unwatch_item(None, "Sony WH-1000XM5")
    assert "not on your watchlist" in again


async def test_a_long_watchlist_is_never_truncated(stub_moss, monkeypatch) -> None:
    """The regression the old Moss-backed list had: top_k silently dropping rows."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    monkeypatch.setattr(Assistant, "_current_best", _no_price)
    for i in range(30):
        await store.add_watch(USER_ID, f"Product {i}", float(i))

    await assistant.list_watches(None)

    payload, _reliable = room.local_participant.published[-1]
    assert json.loads(payload.decode("utf-8"))["data"]["count"] == 30


async def test_price_history_admits_when_it_has_no_data(stub_moss) -> None:
    """With nothing tracked it must not manufacture a trend."""
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)

    reply = await assistant.price_history(None, "Sony WH-1000XM5")

    assert "not tracked" in reply
    assert "watch it" in reply.lower()


async def test_price_history_calls_a_low_price_low(stub_moss) -> None:
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    for price in (300.0, 280.0, 290.0, 200.0):
        await store.record_price("Sony WH-1000XM5", price)

    reply = await assistant.price_history(None, "Sony WH-1000XM5")

    assert "200" in reply
    assert "as low as I have seen" in reply


async def test_price_history_suggests_waiting_on_a_high_price(stub_moss) -> None:
    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    for price in (200.0, 210.0, 205.0, 300.0):
        await store.record_price("Sony WH-1000XM5", price)

    reply = await assistant.price_history(None, "Sony WH-1000XM5")

    assert "worth waiting" in reply


async def test_find_deals_records_the_cheapest_price_for_history(
    stub_moss, monkeypatch
) -> None:
    """Each search feeds the history that price_history later reasons over."""
    from deal_hunter.finder import Deal, DealResult

    result = DealResult(query="Sony WH-1000XM5", country="us")
    result.deals = [
        Deal(
            title="XM5",
            url="https://example.com/xm5",
            source="Amazon",
            price=248.0,
            price_text="$248",
            snippet=None,
        )
    ]

    async def fake_find(query, **kwargs):
        return result

    monkeypatch.setattr("deal_hunter.finder.find_deals", fake_find)
    # Keep background verification off the network.
    monkeypatch.setattr(Assistant, "_spawn_price_verification", lambda self, r: None)

    assistant = Assistant(room=_FakeRoom(), user_id=USER_ID)
    await assistant.find_deals(None, "Sony WH-1000XM5")

    stats = await store.price_stats("Sony WH-1000XM5")
    assert stats["count"] == 1
    assert stats["latest"] == 248.0
    assert stats["latest_source"] == "Amazon"


async def test_list_watches_empty(stub_moss, monkeypatch) -> None:
    """An empty watchlist reads back cleanly and still publishes."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)

    reply = await assistant.list_watches(None)

    assert "empty" in reply.lower()
    payload, _reliable = room.local_participant.published[-1]
    message = json.loads(payload.decode("utf-8"))
    assert message["type"] == "watchlist"
    assert message["data"]["count"] == 0


async def test_list_watches_attaches_current_price_and_flags_target_hit(
    stub_moss, monkeypatch
) -> None:
    """A refreshed watch carries its live price, and a hit target is announced."""
    room = _FakeRoom()
    assistant = Assistant(room=room, user_id=USER_ID)
    await store.add_watch(USER_ID, "Sony WH-1000XM5", 200.0)

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
