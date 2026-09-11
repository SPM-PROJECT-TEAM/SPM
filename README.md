# EduAI — Version 1.1

This is the first working foundation of the EduAI teacher portal. It contains:

- `frontend/` — Next.js and Tailwind curriculum-explorer dashboard.
- `backend/` — Python/FastAPI DIKSHA client, ingestion API, CLI, tests, and Supabase migration.
- `ROADMAP.md` — revised, free-first implementation plan.
- `TESTER_HANDOFF_V1.1.md` — exact V1.1 setup and verification checklist.

## Run locally

Open two terminals.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
eduai-api
```

```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and select a board, grade, and subject. The
dashboard includes a built-in DIKSHA search bridge, so the preview works with
the frontend alone. Add `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` to
use the Python service instead. Add `DIKSHA_API_KEY` and
`DIKSHA_CHANNEL_ID` in `backend/.env` only when framework-taxonomy access has
been approved.

## Supabase

Run `backend/migrations/001_curriculum.sql` in the Supabase SQL editor before
adding persistent snapshot writes in the next increment.
