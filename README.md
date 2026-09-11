# EduAI — Version 2.1

EduAI 2.1 is a syllabus-catalogue and chapter-practice prototype. Its student
experience is intentionally focused: chapter notes, EduAI Tutor, a timed quiz,
spaced flashcards, and practice questions.

- `frontend/` — Next.js and Tailwind curriculum-explorer dashboard.
- `backend/` — Python/FastAPI DIKSHA client, ingestion API, CLI, tests, and Supabase migration.
- `ROADMAP.md` — free-first delivery plan and the 2.1 safety baseline.
- `TESTER_HANDOFF_V2.1.md` — exact 2.1 setup and verification checklist.

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

Visit `http://localhost:3000` and select a listed board, grade, and subject.
The chapter picker only exposes combinations maintained in the local catalogue;
it does not invent a fallback chapter list. Use the source link in the picker
to open the official NCERT or Maharashtra Balbharati textbook catalogue.

Only the CBSE Class 10 Mathematics “Real Numbers” study pack is currently
reviewed for the in-app practice flow. Other catalogue entries remain visible
but deliberately do not generate study material until their current textbook
content has been reviewed. This is a safety constraint, not an API error.

The Python DIKSHA ingestion service remains available for future approved
curriculum imports. It is not the authority for the 2.1 student UI.

## Supabase

Run `backend/migrations/001_curriculum.sql` in the Supabase SQL editor before
adding persistent snapshot writes in the next increment.
