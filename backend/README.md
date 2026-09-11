# EduAI syllabus ingestion

This service reads curriculum-linked content metadata from DIKSHA and saves a
portable, normalized JSON snapshot. It deliberately keeps DIKSHA credentials in
environment variables and supports the public content-search API without them.

## Quick start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
Copy-Item .env.example .env
eduai-ingest --board CBSE --grade "Class 10" --subject Mathematics
```

To run the API used by the dashboard, use `eduai-api`. Its health endpoint is
available at `http://localhost:8000/health`; the curriculum endpoint is at
`/v1/curriculum/search`.

The command creates a timestamped snapshot under `backend/data/snapshots/`.
Pass `--output <path>` when a different destination is needed.

## Supported initial scope

The same command supports the two locked boards by passing their DIKSHA labels:

```powershell
eduai-ingest --board CBSE --grade "Class 10" --subject Science
eduai-ingest --board "Maharashtra" --grade "Class 10" --subject Mathematics
```

DIKSHA's board labels and taxonomy vary by channel. `--framework-id` reads the
authoritative framework once the channel ID/API key have been supplied by
DIKSHA; this is the source of board, grade and subject dropdown data.

## Database

Apply `migrations/001_curriculum.sql` in Supabase before wiring the snapshot
writer to the database. The migration preserves the original DIKSHA metadata in
`raw_metadata`, so later AI-generation and caching phases retain provenance.
