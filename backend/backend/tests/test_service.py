import asyncio

from eduai_ingestion.models import SyllabusQuery
from eduai_ingestion.service import SyllabusIngestionService, normalize_content


def test_normalize_content_preserves_curriculum_metadata() -> None:
    record = normalize_content({
        "identifier": "do_123",
        "name": "Triangles",
        "board": "CBSE",
        "gradeLevel": ["Class 10"],
        "subject": ["Mathematics"],
        "topics": ["Geometry"],
        "contentType": "Collection",
    })
    assert record.diksha_identifier == "do_123"
    assert record.grade_levels == ("Class 10",)
    assert record.topics == ("Geometry",)


def test_service_builds_snapshot_from_api_envelope() -> None:
    class FakeClient:
        async def search_content(self, query):
            assert query.board == "CBSE"
            return {"result": {"count": 1, "content": [{"identifier": "do_1", "name": "Fractions"}]}}

        async def read_framework(self, framework_id):
            return {"result": {"framework": {"identifier": framework_id}}}

    snapshot = asyncio.run(SyllabusIngestionService(FakeClient()).ingest(SyllabusQuery("CBSE"), "cbse_framework"))
    assert snapshot.source_count == 1
    assert snapshot.items[0].title == "Fractions"
    assert snapshot.framework["framework"]["identifier"] == "cbse_framework"
