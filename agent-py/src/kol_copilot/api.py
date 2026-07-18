from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from .runner import run_kol_query
from .schemas import KolQueryResult, ProtocolProfile


class KolQueryRequest(BaseModel):
    user_text: str
    user_id: str = "api-user"
    protocol_id: str = "nct04816669-bnt162b2"
    protocol_profile: ProtocolProfile | None = None
    conversation_id: str | None = None


app = FastAPI(title="KOL Copilot Agent API")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/kol/query", response_model=KolQueryResult)
async def kol_query(request: KolQueryRequest) -> KolQueryResult:
    return await run_kol_query(
        request.user_text,
        user_id=request.user_id,
        protocol_id=request.protocol_id,
        protocol_profile=request.protocol_profile,
        conversation_id=request.conversation_id,
    )
