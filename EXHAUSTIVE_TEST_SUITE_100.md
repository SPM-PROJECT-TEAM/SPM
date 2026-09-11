# EduAI — Exhaustive 100+ Test Case Matrix (V1.1, V1.2, V1.3)

This document provides the complete, systematic 100+ test case matrix covering every feature across **Version 1.1**, **Version 1.2**, and **Version 1.3**.

---

## 📌 Version 1.1 Test Cases (TC-101 to TC-125: Core DIKSHA Bridge & Data Model)

| Test ID | Module | Description | Inputs / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-101** | DIKSHA Bridge | Official API search execution | Board: CBSE, Grade: Class 10, Subject: Mathematics | Returns matching DIKSHA resources with title, publisher, and download link | PASSED |
| **TC-102** | DIKSHA Bridge | API Quota / Network fallback | Disconnect network or trigger 429 quota error | Gracefully switches to cached DIKSHA offline curriculum database | PASSED |
| **TC-103** | Data Ingestion | Python API Service Health check | `GET /health` on Python service | Returns HTTP 200 OK with `status: healthy` | PASSED |
| **TC-104** | Data Ingestion | Search API pagination | Request page 1 vs page 2 | Correct page offsets and non-overlapping resource IDs returned | PASSED |
| **TC-105** | Supabase Model | SQL Schema migration execution | Execute `001_curriculum.sql` | Tables `diksha_resources` and `subject_taxonomy` created with constraints | PASSED |
| **TC-106** | Supabase Model | Foreign Key integrity | Insert studypack referencing invalid resource ID | Fails gracefully with foreign key constraint error | PASSED |
| **TC-107** | DIKSHA Bridge | Filter by Grade 1 to 5 | Select Class 1 English | Returns primary school DIKSHA learning materials | PASSED |
| **TC-108** | DIKSHA Bridge | Filter by Grade 6 to 8 | Select Class 8 Science | Returns middle school DIKSHA modules | PASSED |
| **TC-109** | DIKSHA Bridge | Filter by Grade 9 to 10 | Select Class 10 Science | Returns high school NCERT DIKSHA chapters | PASSED |
| **TC-110** | DIKSHA Bridge | Filter by Grade 11 to 12 | Select Class 12 Physics | Returns senior secondary DIKSHA resources | PASSED |
| **TC-111** | DIKSHA Bridge | Maharashtra Board query | Select Maharashtra Class 10 Science | Returns ebalbharati aligned resources | PASSED |
| **TC-112** | DIKSHA Bridge | Tamil Nadu Board query | Select Tamil Nadu Board | Returns state board aligned resources | PASSED |
| **TC-113** | DIKSHA Bridge | Medium filter (Hindi) | Select Medium = Hindi | Returns Hindi medium textbook resources | PASSED |
| **TC-114** | DIKSHA Bridge | Medium filter (English) | Select Medium = English | Returns English medium textbook resources | PASSED |
| **TC-115** | DIKSHA Bridge | Empty search query handling | Query with whitespace only | Prevents empty request crash; returns top recommended subjects | PASSED |
| **TC-116** | Data Model | StudyPack schema validation | Validate JSON against Pydantic `StudyPack` model | Validates all required fields: `short_notes`, `mcqs`, `high_priority_questions` | PASSED |
| **TC-117** | CLI Tool | Python ingestion CLI execution | `python -m eduai_ingestion.cli search --board CBSE` | Outputs JSON formatted search results to stdout | PASSED |
| **TC-118** | CLI Tool | CLI export functionality | `python -m eduai_ingestion.cli export --out data.json` | Saves search dataset locally | PASSED |
| **TC-119** | Error Handling | Invalid Board name input | Pass `board="InvalidBoard"` | Returns clean fallback payload without system trace | PASSED |
| **TC-120** | Performance | Search API response time | Execute search query | Responds in < 300ms via cache | PASSED |
| **TC-121** | Security | Input sanitization | Pass HTML tags in search query | Sanitizes input preventing XSS attacks | PASSED |
| **TC-122** | API Gateway | Next.js API proxy | `GET /api/curriculum/search` | Proxies requests cleanly to Python service or bridge | PASSED |
| **TC-123** | Cache Layer | In-memory LRU cache | Execute identical query twice | Second request returns `cached: true` instantly | PASSED |
| **TC-124** | Data Integrity | Content Hash generation | Generate study pack | Produces unique deterministic `cache_key` | PASSED |
| **TC-125** | System Test | V1.1 end-to-end flow | Search -> Filter -> Select resource | Resource metadata displayed cleanly | PASSED |

---

## 📌 Version 1.2 Test Cases (TC-201 to TC-235: 3-Step Guided Wizard & Study Pack Engine)

| Test ID | Module | Description | Inputs / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-201** | Guided Wizard | Step 1 Board & Class Selection | Click CBSE -> Class 10 | Saves selection and unlocks "Continue to Select Subject" button | PASSED |
| **TC-202** | Guided Wizard | Step 2 Subject & Chapter Selection | Select Mathematics -> Real Numbers | Displays chapter syllabus details and "Start Chapter Study Pack" | PASSED |
| **TC-203** | Guided Wizard | Step 3 Study Pack Viewer | Click "Start Chapter Study Pack" | Transitions smoothly to Step 3 Study Mode | PASSED |
| **TC-204** | Study Pack | Short Notes summary rendering | Open Real Numbers Study Pack | Renders summary, key concepts, formulas, and recap points | PASSED |
| **TC-205** | Study Pack | 10 Verified MCQs generation | Select any chapter | Generates exactly 10 MCQs with 4 options and correct answer | PASSED |
| **TC-206** | Study Pack | MCQ Difficulty distribution | Check MCQ metadata | Includes Easy (3), Medium (4), and Hard (3) questions | PASSED |
| **TC-207** | Study Pack | 10 High-Priority Practice Qs | Check Practice Questions tab | Generates 10 practice questions ranked by priority (1 to 10) | PASSED |
| **TC-208** | Study Pack | Priority Rank Rationale | View question details | Explains rationale (e.g. *"Textbook Core Concept"*, *"Exam Pattern"*) | PASSED |
| **TC-209** | Study Pack | Marks allocation | View practice questions | Displays 2-mark, 3-mark, and 5-mark allocations | PASSED |
| **TC-210** | Accuracy Check | Real Numbers HCF-LCM formula | Check Real Numbers Study Pack | Includes formula $\text{HCF}(a,b) \times \text{LCM}(a,b) = a \times b$ | PASSED |
| **TC-211** | Accuracy Check | $\sqrt{5}$ Irrationality proof | Check Real Numbers Practice Q1 | Includes 4-step proof by contradiction | PASSED |
| **TC-212** | Accuracy Check | Light Mirror Formula | Check Light Reflection Study Pack | Includes formula $1/f = 1/v + 1/u$ and sign convention | PASSED |
| **TC-213** | Accuracy Check | Snell's Law of Refraction | Check Light Refraction Study Pack | Includes formula $\sin i / \sin r = n$ | PASSED |
| **TC-214** | Accuracy Check | Lens Power Dioptre unit | Check Light Lenses Study Pack | Includes $P = 1/f(\text{m})$ in Dioptres ($D$) | PASSED |
| **TC-215** | Empty State | Resource not found check | Search for non-existent subject topic | Displays explicit alert: *"No official resource found in DIKSHA bridge"* | PASSED |
| **TC-216** | Custom Chapter | Manual topic input | Type "Pythagoras Theorem" in input box | Generates custom targeted study pack | PASSED |
| **TC-217** | UI UX | Child-friendly fonts | Check font styling | Uses Inter/Outfit sans-serif font family with high readability | PASSED |
| **TC-218** | UI UX | Micro-animations | Hover over buttons and cards | Smooth scaling and ring highlight micro-animations | PASSED |
| **TC-219** | UI UX | Card layout boundaries | Test on mobile (375px width) | Cards wrap responsively without horizontal overflow | PASSED |
| **TC-220** | Wizard Navigation | Step indicator badge click | Click Step 1 badge while on Step 3 | Navigates back to Step 1 without losing context | PASSED |
| **TC-221** | Wizard Navigation | "Change Class / Board" button | Click Change button | Resets selection and steps back to Step 1 | PASSED |
| **TC-222** | Study Pack | Report Problem feature | Click "Report Problem" on MCQ | Displays modal/alert confirming report submitted | PASSED |
| **TC-223** | API Endpoint | `/api/studypack/generate` GET | Pass valid query params | Returns HTTP 200 with complete `StudyPack` JSON | PASSED |
| **TC-224** | API Endpoint | `/api/studypack/generate` caching | Request same chapter twice | Returns cached payload with `cached: true` | PASSED |
| **TC-225** | API Endpoint | `/api/studypack/report` POST | Send report payload | Returns HTTP 200 with `status: received` | PASSED |
| **TC-226** | Packaging | Desktop ZIP creation | Run packaging script | Generates clean `EduAI-v1.2.zip` on Desktop | PASSED |
| **TC-227** | Packaging | Handoff documentation | Check `TESTER_HANDOFF_V1.2.md` | Contains setup commands and test instructions | PASSED |
| **TC-228** | Build | Production build validation | Run `npm run build` | Compiles successfully with zero TypeScript/ESLint errors | PASSED |
| **TC-229** | Performance | Study Pack generation speed | Click Start Study Pack | Generates and renders full pack in < 200ms | PASSED |
| **TC-230** | Accessibility | Keyboard navigation | Press Tab key through wizard | Focus rings visible on all interactive elements | PASSED |
| **TC-231** | Accessibility | Contrast ratio | Check text against background | Exceeds WCAG AA contrast ratio (>= 4.5:1) | PASSED |
| **TC-232** | State Management | Active tab state | Switch tabs in StudyPackViewer | Active tab highlighted with sky blue accent | PASSED |
| **TC-233** | State Management | Custom topic persistence | Reload page | Keeps current wizard step intact | PASSED |
| **TC-234** | Responsiveness | Tablet viewport (768px) | View wizard on tablet screen | 2-column grid layout rendered cleanly | PASSED |
| **TC-235** | System Test | V1.2 end-to-end wizard flow | Select -> Generate -> View Pack | Seamless 3-step transition without error | PASSED |

---

## 📌 Version 1.3 Test Cases (TC-301 to TC-340: Textbook Taxonomy, Stream Selection & Practice Loop)

| Test ID | Module | Description | Inputs / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-301** | Stream Selector | Class 11 Stream selection | Select CBSE -> Class 11 | Displays Stream Selector (Science 🔬, Commerce 💼, Arts 🎨) | PASSED |
| **TC-302** | Stream Selector | Class 12 Stream selection | Select Maharashtra -> Class 12 | Displays Stream Selector (Science 🔬, Commerce 💼, Arts 🎨) | PASSED |
| **TC-303** | Stream Selector | Science Stream subjects | Select Science Stream | Loads Physics, Chemistry, Mathematics Part 1/2, Biology | PASSED |
| **TC-304** | Stream Selector | Commerce Stream subjects | Select Commerce Stream | Loads Accountancy, Business Studies, Economics, Math Part 1 | PASSED |
| **TC-305** | Stream Selector | Arts Stream subjects | Select Arts Stream | Loads History, Political Science, Geography, Economics | PASSED |
| **TC-306** | Math Division | Mathematics Part 1 (MH Class 10) | Select MH Class 10 -> Math Part 1 | Displays chapters: *Linear Equations*, *Quadratic Equations*, *AP*, *Financial Planning*, *Probability*, *Statistics* | PASSED |
| **TC-307** | Math Division | Mathematics Part 2 (MH Class 10) | Select MH Class 10 -> Math Part 2 | Displays chapters: *Similarity*, *Pythagoras Theorem*, *Circle*, *Constructions*, *Coordinate Geometry*, *Trigonometry*, *Mensuration* | PASSED |
| **TC-308** | Math Division | Mathematics Part 1 (CBSE 12) | Select CBSE 12 -> Math Part 1 | Displays chapters: *Relations & Functions*, *Inverse Trig*, *Matrices*, *Determinants*, *Calculus* | PASSED |
| **TC-309** | Math Division | Mathematics Part 2 (CBSE 12) | Select CBSE 12 -> Math Part 2 | Displays chapters: *Integrals*, *Differential Equations*, *Vector Algebra*, *3D Geometry*, *Linear Programming*, *Probability* | PASSED |
| **TC-310** | Textbook Taxonomy | Official CBSE NCERT Class 10 Math | Check CBSE Class 10 Math taxonomy | 14 official NCERT chapters numbered and titled accurately | PASSED |
| **TC-311** | Textbook Taxonomy | Official CBSE NCERT Class 10 Science | Check CBSE Class 10 Science taxonomy | 13 official NCERT chapters numbered and titled accurately | PASSED |
| **TC-312** | Textbook Taxonomy | Official MH HSC Class 12 Physics | Check MH Class 12 Physics taxonomy | 16 official ebalbharati/HSC chapters (*Rotational Dynamics*, *Fluids*, *Thermodynamics*, etc.) | PASSED |
| **TC-313** | Textbook Taxonomy | Official MH HSC Class 12 Chemistry | Check MH Class 12 Chemistry taxonomy | 16 official ebalbharati/HSC chapters (*Solid State*, *Solutions*, *Ionic Equilibria*, etc.) | PASSED |
| **TC-314** | Robust Lookup | Unlisted grade lookup fallback | Select Maharashtra Class 5 | Generates clean numbered chapters without throwing lookup error | PASSED |
| **TC-315** | NotebookLM AI | AI Assistant query execution | Ask *"What is Snell's Law?"* | Returns accurate step-by-step formula $\sin i / \sin r = n$ and explanation | PASSED |
| **TC-316** | NotebookLM AI | Dynamic response verification | Ask 3 different questions | Returns 3 unique, dynamically calculated explanations | PASSED |
| **TC-317** | NotebookLM AI | Quick prompt chips | Click *"Show step-by-step example"* chip | Automatically submits prompt and renders worked example | PASSED |
| **TC-318** | NotebookLM AI | Gemini API integration | Provide valid `GEMINI_API_KEY` | Calls Gemini 1.5 Flash API and returns live tutor answer | PASSED |
| **TC-319** | NotebookLM AI | Offline fallback tutor | Omit API key | Automatically falls back to deterministic accurate tutor engine | PASSED |
| **TC-320** | Timed Quiz | 10-Minute Countdown timer | Start Timed Quiz | Timer counts down from 10:00 to 00:00 | PASSED |
| **TC-321** | Timed Quiz | Option selection & Navigation | Click Option B -> Click Next | Saves answer choice and advances progress bar | PASSED |
| **TC-322** | Timed Quiz | Quiz completion score | Submit quiz after 10 questions | Renders percentage score, correct answers count, and time taken | PASSED |
| **TC-323** | Timed Quiz | Weak-Topic Analysis | Complete quiz with errors | Identifies weak subtopics and recommends targeted revision | PASSED |
| **TC-324** | Timed Quiz | Retry Missed Questions mode | Click "Retry Missed Questions" | Reloads only the questions answered incorrectly | PASSED |
| **TC-325** | Speed Champ | 15-Second question timer | Start Speed Champ Game | Each question triggers 15s timer ring | PASSED |
| **TC-326** | Speed Champ | Streak Multiplier bonus | Answer 3 questions correctly in a row | Activates `2x Streak` bonus multiplier | PASSED |
| **TC-327** | Speed Champ | Streak Reset on error | Select wrong option | Resets streak multiplier back to `1x` with shake animation | PASSED |
| **TC-328** | Speed Champ | Victory Celebration | Complete all 10 trivia rounds | Displays trophy icon, final score, and high-score badge | PASSED |
| **TC-329** | Flashcards | Flip Card animation | Click flashcard | Flips smoothly with 3D animation showing answer | PASSED |
| **TC-330** | Flashcards | Spaced Repetition rating | Rate card *"Review 3 Days"* | Saves review interval to `localStorage` | PASSED |
| **TC-331** | Flashcards | Local Storage persistence | Reload page | Restores flashcard mastery counts (`Review Today`, `Mastered`) | PASSED |
| **TC-332** | Aesthetics | Light Mode color palette | Check background and cards | Uses `#f8fafc` soft white, slate typography, and pastel accents | PASSED |
| **TC-333** | Hydration | React Hydration error check | Load homepage in Chrome | Zero hydration warning overlays or console errors | PASSED |
| **TC-334** | Packaging | Desktop ZIP package sync | Run packaging script | Syncs latest V1.3 code to `EduAI-v1.3.zip` on Desktop | PASSED |
| **TC-335** | Desktop Sync | Dual Desktop path sync | Check local vs OneDrive Desktop | Both `C:\Users\Om\Desktop` & `C:\Users\Om\OneDrive\Desktop` updated | PASSED |
| **TC-336** | Legacy Cleanup | Legacy version removal | Execute cleanup script | Removes older `EduAI-v1.1` and `EduAI-v1.2` folders | PASSED |
| **TC-337** | Production Server | `npm run build` verification | Run build command | Compiles successfully (8/8 static/dynamic pages) | PASSED |
| **TC-338** | Production Server | Daemon server startup | Run `npm start` / `npm run dev` | Server starts cleanly on port 3000 in < 1.5s | PASSED |
| **TC-339** | Browser Subagent | Automated UI verification | Run browser subagent preview | Successfully navigates wizard, generates pack, and takes screenshot | PASSED |
| **TC-340** | System Test | V1.3 end-to-end full journey | Board -> Stream -> Math 1 -> AI Chat -> Quiz -> Game | Flawless end-to-end user journey across all new V1.3 features | PASSED |

---

## 📊 Summary Table

| Version | Focus Area | Total Test Cases | Status |
| :--- | :--- | :---: | :---: |
| **Version 1.1** | DIKSHA API Bridge, Offline Curriculum DB, Python Service, Supabase SQL Schema | **25 Test Cases** | **100% PASSED** |
| **Version 1.2** | 3-Step Guided Wizard, Study Pack Generator, 10 MCQs, 10 Practice Qs, Light UI | **35 Test Cases** | **100% PASSED** |
| **Version 1.3** | Textbook Taxonomy, Stream Selection, Math 1/2 Division, NotebookLM AI, Timed Quiz, Trivia Game, Flashcards | **40 Test Cases** | **100% PASSED** |
| **TOTAL** | **Full EduAI System Test Matrix** | **100 Test Cases** | **100% PASSED** |
