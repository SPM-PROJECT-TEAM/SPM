# EduAI Version 2.1 — Tester Handoff Guide

## 📌 Scope

EduAI 2.1 is a complete, multi-class student study and practice application covering **Class 6 to Class 12** across **CBSE** and **Maharashtra State Board** (including Science, Commerce, and Arts streams).

The student learning loop includes:
1. **Short Notes**: Guided summary, key concepts, formulas/definitions, and quick recap points.
2. **EduAI Tutor**: Grounded AI assistant offering 4-step structured learning explanations.
3. **Timed Practice Quiz**: 20 chapter-specific MCQs with score calculation, step-by-step explanations, and weak-topic analysis.
4. **Spaced Flashcards**: Interactive 5-card spaced-repetition revision deck.
5. **High-Priority Practice Questions**: 10 exam-focused practice questions ranked by priority with worked answer keys.

---

## ⚡ Setup

```powershell
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

---

## 🧪 Test Checklist

1. **Header Verification**: Home header displays **Version 2.1** badge and official syllabus source links (NCERT & Balbharati).
2. **Class & Stream Selection**:
   - Class 6 to 10 load Mathematics, Science, Social Science, English, etc.
   - Class 11 & 12 offer Stream Selector (Science 🔬, Commerce 💼, Arts 🎨) loading dedicated subjects.
3. **Chapter Integrity**: Changing board, class, or subject never displays chapters from another selection.
4. **Study Pack Generation**: Selecting ANY chapter across Class 6 through Class 12 builds a complete 5-tab study pack without errors.
5. **EduAI Tutor Q&A**: Asking EduAI Tutor a question on any chapter returns a structured explanation with step-by-step working and exam tips.
6. **Timed Quiz Player**: Completing questions updates the progress bar, calculates percentage scores, highlights weak topics, and allows retries.
7. **Spaced Flashcards**: Flipping cards reveals answers and saves review ratings locally.
8. **High-Priority Practice Qs**: Displays 10 practice questions ranked by priority with 3-mark and 5-mark allocations.

---

## 📊 Board & Syllabus Coverage Summary

| Board | Classes | Supported Subjects |
| :--- | :--- | :--- |
| **CBSE** | Class 6 – 10 | Mathematics, Science, Social Science, English |
| **CBSE** | Class 11 – 12 (Science) | Physics, Chemistry, Mathematics Part 1/2, Biology |
| **CBSE** | Class 11 – 12 (Commerce) | Accountancy, Business Studies, Economics |
| **CBSE** | Class 11 – 12 (Arts) | History, Political Science, Geography |
| **Maharashtra** | Class 6 – 10 | Mathematics Part 1/2, Science & Tech Part 1/2, General Science |
| **Maharashtra** | Class 11 – 12 (Science) | Physics, Chemistry, Math Part 1/2, Biology |
| **Maharashtra** | Class 11 – 12 (Commerce) | Book-Keeping & Accountancy, Secretarial Practice, Economics |
| **Maharashtra** | Class 11 – 12 (Arts) | History, Political Science, Geography |
