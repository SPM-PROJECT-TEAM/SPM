"""EduAI curriculum ingestion primitives."""

from .client import DikshaClient
from .models import CurriculumSnapshot, SyllabusQuery
from .service import SyllabusIngestionService

__all__ = ["DikshaClient", "CurriculumSnapshot", "SyllabusIngestionService", "SyllabusQuery"]
