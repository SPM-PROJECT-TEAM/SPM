from __future__ import annotations

import uuid
from dataclasses import asdict
from typing import Any

import uvicorn
from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .client import DikshaApiError, DikshaClient
from .models import SyllabusQuery
from .service import SyllabusIngestionService
from .studypack import StudyPackQualityGate, generate_deterministic_study_pack

app = FastAPI(title="EduAI Curriculum & Study Pack API", version="2.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

PACK_CACHE: dict[str, dict[str, Any]] = {}
REPORTS_DB: list[dict[str, Any]] = []


def serialize(snapshot: Any) -> dict[str, Any]:
    result = asdict(snapshot)
    result["fetched_at"] = snapshot.fetched_at.isoformat()
    return result


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "eduai-curriculum-api", "version": "2.1.0"}


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


@app.get("/v1/studypack/generate")
async def generate_studypack(
    board: str = Query("CBSE"),
    grade: str = Query("Class 10"),
    subject: str = Query("Mathematics"),
    chapter_id: str = Query("default-ch-1"),
    chapter_title: str = Query("Real Numbers"),
    medium: str = Query("English"),
) -> dict[str, Any]:
    cache_key = f"{board}:{grade}:{subject}:{chapter_id}:{medium}:v1.2".lower()
    if cache_key in PACK_CACHE:
        return {"cached": True, "pack": PACK_CACHE[cache_key]}

    pack_obj = generate_deterministic_study_pack(
        board=board, grade=grade, subject=subject, chapter_id=chapter_id, chapter_title=chapter_title, medium=medium
    )
    pack_dict = pack_obj.to_dict()

    valid, errors = StudyPackQualityGate.validate(pack_dict)
    if not valid:
        raise HTTPException(status_code=422, detail={"message": "Quality gate failed", "errors": errors})

    PACK_CACHE[cache_key] = pack_dict
    return {"cached": False, "pack": pack_dict}


@app.post("/v1/studypack/report")
async def report_issue(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    report_id = str(uuid.uuid4())
    record = {
        "id": report_id,
        "pack_id": payload.get("pack_id", "unknown"),
        "chapter_title": payload.get("chapter_title", "Unknown Chapter"),
        "item_type": payload.get("item_type", "mcq"),
        "item_id": payload.get("item_id"),
        "reason": payload.get("reason", "Content feedback"),
        "details": payload.get("details", ""),
        "status": "pending",
    }
    REPORTS_DB.append(record)
    return {"status": "reported", "report_id": report_id}


def run() -> None:
    uvicorn.run("eduai_ingestion.api:app", host="0.0.0.0", port=8000, reload=True)
