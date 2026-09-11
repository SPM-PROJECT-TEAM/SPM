# EduAI delivery roadmap — shortest free path

## Product rule

EduAI can be free for learners, but no third-party service offers an unlimited
guarantee. The design therefore uses free tiers, aggressive caching, request
limits, and graceful fallbacks. Every feature must remain useful when an AI or
video quota is exhausted.

## What Version 1.1 does now

It lets a student or teacher choose a board, class, and subject; then it finds
matching official DIKSHA curriculum resources. The dashboard runs with its own
DIKSHA bridge, while the Python service provides a deployable API and a
Supabase-ready data model.

It does **not** yet create notes, quizzes, flashcards, important questions,
podcasts, games, accounts, or permanent user data. Those are deliberately not
claimed as complete in this version.

## Revised release sequence

### Version 1.1 — Curriculum discovery ✓

- Live CBSE and Maharashtra Board curriculum discovery from DIKSHA.
- Glass-style responsive dashboard.
- Python ingestion API, CLI snapshot tool, and Supabase curriculum migration.
- Tester handoff: `TESTER_HANDOFF_V1.1.md`.

### Version 1.2 — Study pack and important-question engine

**Goal:** make a single chapter genuinely useful for a student.

- Save approved curriculum records in Supabase.
- Generate a typed study pack: short notes, flashcards, 10 MCQs, and 10
  high-priority practice questions.
- Use Gemini Flash/Lite free-tier requests only behind a server route; cache
  one result per chapter, board, grade, subject, language, and version.
- Include source chapter/title identifiers in every generated pack.
- Add a deterministic quality gate: valid JSON, no duplicate questions, four
  answer options for MCQs, one correct answer, explanation, difficulty, and
  syllabus-tag coverage.
- Add a “Report issue” button so a teacher can hide or correct poor content.

**Important-question policy:** call them *High-priority practice questions*.
They are ranked from textbook coverage, recurring concepts, prerequisite value,
and teacher feedback—not presented as leaked, official, or guaranteed exam
questions.

### Version 1.3 — Practice and learning loop

**Goal:** turn study packs into measurable practice.

- Timed quiz player, instant explanations, weak-topic tracking, and retry mode.
- Flashcard review with a simple local spaced-repetition schedule.
- One reusable trivia game template, using the exact same validated question
  JSON as the quiz. Do not build three game types yet.
- Student progress stored only after authentication is added; keep guest mode
  local-first.

### Version 1.4 — Teacher review and publishing

**Goal:** ensure quality before scale.

- Teacher approval queue for study packs.
- Edit, approve, hide, and re-generate controls.
- Publish approved packs to the shared cache.
- Basic analytics: pack opens, quiz completion, difficult questions, reports.

### Version 1.5 — Video links and audio (only after core learning works)

- Curated video links first; use YouTube search only to fill cache misses.
- Cache one selected video per topic and provide a no-video fallback.
- Create podcast scripts first. Add TTS only after the text experience is
  stable and the free-tier limits have been measured.

### Version 2.0 — Release hardening

- Authentication, rate limits, moderation, backups, monitoring, and error
  tracking.
- Accessibility, mobile, and cross-browser testing.
- Deployment runbook and production acceptance testing.

## Why this order is shorter and safer

The original plan spread effort across podcasts, games, videos, and AI content
before proving the core learning loop. This order ships a useful chapter study
experience by Version 1.2, reuses the same validated question data for Version
1.3, and keeps expensive or quota-sensitive media features until they add real
learning value.

## Free-tier controls

- Cache every AI result; never generate the same chapter pack twice.
- Limit generation per user/IP and queue cache misses.
- Use structured JSON output and validate it before storing it.
- Keep an approved fallback pack for popular chapters.
- Avoid YouTube `search.list` on every page load; it consumes API quota.
- Treat the Gemini free tier as a development/early-user capacity, not an
  unlimited production promise.

## Required tester handoff on every version

Each release must include a `TESTER_HANDOFF_Vx.y.md` file containing:

1. Exact setup commands.
2. Required environment variables, with placeholders only.
3. Test scenarios and expected outcomes.
4. Known limits and non-goals.
5. A pass/fail checklist and bug-report format.
