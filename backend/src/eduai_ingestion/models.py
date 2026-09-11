from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass(frozen=True, slots=True)
class SyllabusQuery:
    board: str
    grade: str | None = None
    subject: str | None = None
    medium: str | None = None
    limit: int = 100
    offset: int = 0

    def filters(self) -> dict[str, list[str]]:
        fields = {"board": self.board, "gradeLevel": self.grade, "subject": self.subject, "medium": self.medium}
        return {key: [value] for key, value in fields.items() if value}


@dataclass(frozen=True, slots=True)
class CurriculumItem:
    diksha_identifier: str
    title: str
    board: str | None
    grade_levels: tuple[str, ...] = ()
    subjects: tuple[str, ...] = ()
    topics: tuple[str, ...] = ()
    content_type: str | None = None
    medium: str | None = None
    raw_metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class CurriculumSnapshot:
    source: str
    query: SyllabusQuery
    source_count: int
    fetched_at: datetime
    items: tuple[CurriculumItem, ...]
    framework: dict[str, Any] | None = None

    @classmethod
    def empty(cls, query: SyllabusQuery) -> "CurriculumSnapshot":
        return cls("diksha", query, 0, datetime.now(timezone.utc), ())

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)
