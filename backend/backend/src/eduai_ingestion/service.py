from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Iterable

from .client import DikshaClient
from .models import CurriculumItem, CurriculumSnapshot, SyllabusQuery


def _as_strings(value: Any) -> tuple[str, ...]:
    if value is None:
        return ()
    if isinstance(value, str):
        return (value,)
    if isinstance(value, Iterable):
        return tuple(str(part) for part in value if part is not None)
    return (str(value),)


def normalize_content(item: dict[str, Any]) -> CurriculumItem:
    identifier = item.get("identifier")
    if not identifier:
        raise ValueError("DIKSHA content record has no identifier")
    return CurriculumItem(
        diksha_identifier=str(identifier),
        title=str(item.get("name") or item.get("title") or identifier),
        board=item.get("board"),
        grade_levels=_as_strings(item.get("gradeLevel")),
        subjects=_as_strings(item.get("subject")),
        topics=_as_strings(item.get("topics")),
        content_type=item.get("contentType"),
        medium=item.get("medium"),
        raw_metadata=item,
    )


class SyllabusIngestionService:
    def __init__(self, client: DikshaClient) -> None:
        self.client = client

    async def ingest(self, query: SyllabusQuery, framework_id: str | None = None) -> CurriculumSnapshot:
        response = await self.client.search_content(query)
        result = response.get("result", {})
        items = tuple(normalize_content(content) for content in result.get("content", []))
        framework = None
        if framework_id:
            framework = (await self.client.read_framework(framework_id)).get("result")
        return CurriculumSnapshot(
            source="diksha",
            query=query,
            source_count=int(result.get("count", len(items))),
            fetched_at=datetime.now(timezone.utc),
            items=items,
            framework=framework,
        )
