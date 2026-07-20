"""Evals for *which* tool fires for a given utterance.

The deterministic tests elsewhere prove each tool works once called. These
prove the agent actually calls it. The failure they exist to catch is the
expensive one: the model answering "the XM5 is about three hundred dollars"
from parametric knowledge instead of searching — a confidently wrong price,
which is the one thing a shopping agent must never produce.

These drive a real LLM through LiveKit Inference, so they need LiveKit
credentials and are slower than the rest of the suite. Every tool is mocked,
so no Bright Data or Moss call is ever made.
"""

from __future__ import annotations

import pytest
from livekit.agents import AgentSession, mock_tools

from agent import Assistant, DocsAgent

# Stand-in returns for every tool the shopping agent exposes. Values are only
# plausible enough to keep the conversation moving; these tests assert on which
# tool was chosen, never on what it returned.
SHOPPING_TOOL_MOCKS = {
    "find_deals": lambda: "The best price I found is 248 dollars at Amazon.",
    "watch_item": lambda: "Added it to your watchlist.",
    "unwatch_item": lambda: "Removed it from your watchlist.",
    "list_watches": lambda: "You are watching one item.",
    "price_history": lambda: "That is about as low as I have seen it.",
    "compare_products": lambda: "The first one is cheaper at 248 dollars.",
    "explain_price": lambda: "That listing is refurbished.",
    "read_reviews": lambda: "Owners complain about battery life.",
    "find_coupon": lambda: "I didn't find any current codes.",
    "remember_fact": lambda: "Got it, I'll remember that.",
    "recall_facts": lambda: "You told me you like Sony.",
}


async def _first_tool_called(user_input: str, agent) -> str | None:
    """Run one turn and report the name of the first tool the agent chose."""
    async with AgentSession() as session:
        await session.start(agent)
        with mock_tools(type(agent), SHOPPING_TOOL_MOCKS):
            result = await session.run(user_input=user_input)

        for event in result.events:
            item = getattr(event, "item", None)
            if getattr(item, "type", None) == "function_call":
                return item.name
        return None


@pytest.mark.parametrize(
    ("utterance", "expected_tool"),
    [
        # The core failure mode: a price question must never be answered from
        # the model's own memory.
        ("How much does a Sony WH-1000XM5 cost?", "find_deals"),
        ("Where can I get an RTX 4090 cheapest?", "find_deals"),
        ("Find me the best price on AirPods Pro 2", "find_deals"),
        # Watchlist verbs.
        ("Watch the Sony WH-1000XM5 and tell me if it drops below 200", "watch_item"),
        ("What am I watching right now?", "list_watches"),
        ("Stop watching the RTX 4090", "unwatch_item"),
        # The judgement questions that price history exists to answer.
        ("Is now a good time to buy the Sony WH-1000XM5?", "price_history"),
        ("Should I wait for the RTX 4090 to get cheaper?", "price_history"),
        # The newer shopping tools.
        (
            "Which is cheaper, the Sony WH-1000XM5 or the Bose QuietComfort Ultra?",
            "compare_products",
        ),
        ("Why is that Sony WH-1000XM5 listing so cheap?", "explain_price"),
        (
            "Is the Sony WH-1000XM5 any good? What do people complain about?",
            "read_reviews",
        ),
        ("Are there any promo codes for Best Buy?", "find_coupon"),
    ],
)
@pytest.mark.asyncio
async def test_utterance_routes_to_the_right_tool(
    utterance: str, expected_tool: str
) -> None:
    called = await _first_tool_called(utterance, Assistant())

    assert called == expected_tool, (
        f"{utterance!r} should have called {expected_tool}, got {called!r}"
    )


@pytest.mark.asyncio
async def test_a_price_question_is_never_answered_from_memory() -> None:
    """The single most important routing guarantee in the app."""
    called = await _first_tool_called(
        "What's the going rate for a PlayStation 5 these days?", Assistant()
    )

    assert called is not None, "Answered a price question without searching"
    assert called == "find_deals"


@pytest.mark.asyncio
async def test_technical_questions_hand_off_instead_of_being_answered() -> None:
    """Docs questions belong to DocsAgent, not the shopping prompt."""
    called = await _first_tool_called(
        "How does turn detection work in this demo?", Assistant()
    )

    assert called == "explain_the_demo"


@pytest.mark.asyncio
async def test_the_docs_agent_grounds_before_answering() -> None:
    called = await _first_tool_called(
        "What is LiveKit Inference?",
        DocsAgent(moss=None),
    )

    assert called == "search_knowledge"


@pytest.mark.asyncio
async def test_small_talk_calls_no_tool() -> None:
    """Tool-happy agents feel broken; a greeting must stay a greeting."""
    called = await _first_tool_called("Hey, how's it going?", Assistant())

    assert called is None
