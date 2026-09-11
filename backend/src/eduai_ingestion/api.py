from __future__ import annotations

from dataclasses import asdict
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .client import DikshaApiError, DikshaClient
from .models import SyllabusQuery
from .service import SyllabusIngestionService

app = FastAPI(title="EduAI Curriculum API", version="1.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def serialize(snapshot: Any) -> dict[str, Any]:
    result = asdict(snapshot)
    result["fetched_at"] = snapshot.fetched_at.isoformat()
    return result


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "eduai-curriculum-api", "version": "1.1.0"}


@app.get("/v1/curriculum/search")
async def search_curriculum(
    board: str = Query(..., min_length=2),
    grade: str | None = None,
    subject: str | None = None,
    medium: str | None = None,
    limit: int = Query(24, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    query = SyllabusQuery(board, grade, subject, medium, limit, offset)
    try:
        snapshot = await SyllabusIngestionService(DikshaClient()).ingest(query)
    except DikshaApiError as error:
        raise HTTPException(status_code=502, detail="DIKSHA could not be reached. Please try again shortly.") from error
    return serialize(snapshot)


def run() -> None:
    uvicorn.run("eduai_ingestion.api:app", host="0.0.0.0", port=8000, reload=True)
