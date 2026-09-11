# EduAI V1.3 — Tester Handoff: Practice & Learning Loop + NotebookLM AI Assistant

## Scope under test

Version 1.3 adds interactive practice loops, timed quiz player, trivia game, spaced-repetition flashcards, NotebookLM-style AI chapter assistant, chapter numbering (`Chapter 1: Real Numbers`), and an aesthetic Light Mode UI.

---

## 1. Exact setup commands

```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 2. Required environment variables

### Frontend (`frontend/.env.local`)
```ini
NEXT_PUBLIC_API_BASE_URL=
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is not provided, EduAI automatically uses its built-in fallback AI tutor for answers.*

---

## 3. Test scenarios and expected outcomes

| Test ID | Scenario / Action | Expected Outcome |
| --- | --- | --- |
| **V13-01** | Open `http://localhost:3000` | Aesthetic Light Mode UI loads cleanly with Step 1 Setup. |
| **V13-02** | Select Board & Class, click Continue | Step 2 loads displaying structured chapters formatted as `Chapter 1: [Title]`, `Chapter 2: [Title]`. |
| **V13-03** | Select a chapter | Step 3 Study Mode opens displaying Short Notes and bottom progression controls. |
| **V13-04** | Click **NotebookLM AI Assistant** tab | Ask any question or click a prompt chip ("Explain like I'm 10"): instant AI response is displayed. |
| **V13-05** | Click **Timed Quiz** tab | Start quiz: 10-minute timer counts down. Submitting displays weak-topic summary & "Retry Weak Questions" button. |
| **V13-06** | Click **Trivia Game** tab | Play gamified trivia runner: question timer runs, streak combo multiplier (2x) increments on correct answers. |
| **V13-07** | Click **Spaced Flashcards** tab | Card flips on tap; selecting "Review Today", "In 3 Days", or "Mastered" updates local spaced-repetition schedule. |
| **V13-08** | Verify empty state accuracy | Choose an unavailable subject: "Resource Not Available in DIKSHA" alert displays with 1-click AI Study Pack option. |

---

## 4. Known limits and non-goals

- **Guest mode persistence**: Spaced repetition schedules and quiz history are saved locally in `localStorage` for guest learners. Permanent cloud user profile persistence begins in Version 2.0 with Auth.
- **Audio & Video**: Podcast TTS and YouTube search links are scheduled for Version 1.5.

---

## 5. Pass/Fail checklist

- [ ] V13-01: Light Mode UI renders cleanly without console errors.
- [ ] V13-02: Chapters formatted as `Chapter 1: ...`, `Chapter 2: ...`.
- [ ] V13-03: Guided study mode advances step by step.
- [ ] V13-04: NotebookLM AI Assistant answers questions accurately.
- [ ] V13-05: Timed Quiz tracks countdown and weak topics.
- [ ] V13-06: Trivia game calculates streak bonus points.
- [ ] V13-07: Spaced flashcards update local schedule.
- [ ] V13-08: Resource accuracy alert works properly.
