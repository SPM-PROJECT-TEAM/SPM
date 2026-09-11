# EduAI V1.2 — Tester Handoff: Study Pack & Important-Question Engine

## Scope under test

Version 1.2 introduces typed chapter **Study Packs** generated from curriculum discovery resources. A Study Pack consists of:
- **Short Notes** (Summary, Key Concepts, Formulas/Definitions, Recap Points).
- **Interactive Flashcards** (Deck with flip animation, card navigation, mastery tracking).
- **10 MCQs Practice Quiz** (4 answer options, 1 correct index, detailed explanations, difficulty, syllabus tag).
- **10 High-Priority Practice Questions** (Ranked 1 to 10 by textbook coverage, recurring exam patterns, prerequisite value, and teacher feedback; expandable solution keys and marks).
- **Deterministic Quality Gate Validator** (Validates JSON schema, exactly 10 MCQs with 4 options each, exactly 10 practice questions, zero duplicate questions).
- **Server-Side Caching** (One result cached per chapter, board, grade, subject, medium, version).
- **Report Issue Mechanism** (Flag content errors or typos for teacher review).

---

## 1. Exact setup commands

### Prerequisite
- Node.js 20 or later.
- Python 3.11 or later (optional for Python API testing).

### Frontend Setup & Dev Server
```powershell
cd "$HOME\OneDrive\Desktop\EduAI-v1.1\frontend"
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Backend Python API (Optional)
```powershell
cd "$HOME\OneDrive\Desktop\EduAI-v1.1\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
eduai-api
```
Backend API runs on `http://localhost:8000`. Health check: `http://localhost:8000/health`.

---

## 2. Required environment variables

Placeholders only — no secrets committed:

### Frontend (`frontend/.env.example` & `frontend/.env.local`)
```ini
NEXT_PUBLIC_API_BASE_URL=
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (`backend/.env.example`)
```ini
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_KEY=your_supabase_anon_or_service_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: If `GEMINI_API_KEY` is omitted, EduAI automatically activates its high-quality deterministic fallback generator with zero errors.*

---

## 3. Test scenarios and expected outcomes

| Test ID | Scenario / Action | Expected Outcome |
| --- | --- | --- |
| **V12-01** | Open `http://localhost:3000` | EduAI V1.2 Dashboard loads with child-friendly aurora design and quick demo buttons. |
| **V12-02** | Click **"Quick Demo Pack"** button in header | Interactive Study Pack Viewer opens instantly for "Real Numbers & Polynomials". |
| **V12-03** | Explore **Short Notes** tab | Displays summary, key concepts list, formulas/definitions cards, and quick recap points. |
| **V12-04** | Explore **Flashcards** tab | Card flips on tap; Previous/Next navigation works; "Mark Mastered" counter increments. |
| **V12-05** | Take the **10 MCQs Quiz** | Select an answer option: instant feedback appears (green for correct, red for incorrect), score updates, and detailed explanation is displayed. |
| **V12-06** | Explore **10 High-Priority Practice Qs** | Questions are ranked Priority #1 to #10 with rationale badges (e.g. Textbook Core Concept); clicking "View Solution Key" toggles expandable answer key. |
| **V12-07** | Click **"Quality Gate Passed"** badge | Displays the 9-point deterministic quality verification matrix (all status PASS). |
| **V12-08** | Click **"Report Issue"** on any question | Report modal opens; selecting a reason and submitting returns success confirmation. |

---

## 4. Known limits and non-goals

- **Guest mode persistence**: User progress (quiz scores, mastered cards) is local-first in V1.2; permanent database user progress begins in Version 1.3 after auth integration.
- **Audio & Video**: Podcasts, YouTube search integration, and TTS are explicitly out of scope for V1.2 (scheduled for Version 1.5 per product roadmap).
- **Game templates**: Reusable trivia game template begins in Version 1.3 using the exact same question JSON structure built in V1.2.

---

## 5. Pass/Fail checklist

- [ ] V12-01: Page loads cleanly without console errors.
- [ ] V12-02: Study Pack Viewer displays for selected chapter.
- [ ] V12-03: Short Notes tab renders summary and key concepts.
- [ ] V12-04: Flashcards flip on click and track mastered count.
- [ ] V12-05: MCQs show instant feedback, score, and explanations.
- [ ] V12-06: High-priority practice questions display priority ranks 1–10.
- [ ] V12-07: Quality Gate verification report shows all PASS.
- [ ] V12-08: Issue report submission succeeds.

---

## 6. Bug report format

```text
Version: 1.2
Test ID:
Board / Class / Subject / Chapter:
Steps taken:
Expected result:
Actual result:
Console errors (if any):
Browser and OS:
Timestamp:
```
