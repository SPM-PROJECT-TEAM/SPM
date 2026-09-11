# EduAI Version 2.0 — Tester Handoff & Execution Guide

This document contains step-by-step instructions for sharing and testing **EduAI Version 2.0**.

---

## 📦 Step 1: Share the Package with Your Tester

Send your tester the ZIP file located on your Desktop:

- **ZIP File Location**: `C:\Users\Om\OneDrive\Desktop\EduAI-v2.0.zip`
- **Method**: Upload `EduAI-v2.0.zip` to **Google Drive**, **WeTransfer**, or send directly.

---

## ⚡ Step 2: Tester Setup Instructions (On Tester's Device)

Tell your tester to perform these 3 simple steps:

1. **Extract ZIP**: Unzip `EduAI-v2.0.zip` to any folder (e.g. `Desktop/EduAI-v2.0`).
2. **Open Terminal & Install**:
   Open Terminal / Command Prompt / PowerShell inside the `frontend` folder:
   ```bash
   cd EduAI-v2.0/frontend
   npm install
   npm run dev
   ```
3. **Open Application**:
   Open Google Chrome or Microsoft Edge and go to:
   👉 **`http://localhost:3000`**

---

## 🧪 Step 3: Test Scenarios & What Tester Should Check

| Test Scenario | Step-by-Step Instructions | Expected Result |
| :--- | :--- | :--- |
| **Scenario 1: NotebookLM AI Studio** 🤖 | 1. Open any chapter (e.g. *Class 10 Math — Real Numbers*).<br>2. Click **NotebookLM AI Studio** tab.<br>3. Click a prompt chip or type *"Explain Cramer's Rule"* or *"State HCF LCM formula"*. | Displays 2-column NotebookLM Studio (Source Guide on Left + Dynamic AI Chat on Right) with step-by-step math equations ($$ ... $$). |
| **Scenario 2: Dynamic 20+ MCQ Quiz Studio** 🎯 | 1. Click **Timed Quiz** tab.<br>2. Switch between **10 Qs** and **20 Qs (Full)** pills.<br>3. Select an answer on any question.<br>4. Click **"Generate 10 More MCQs via Gemini Flash AI"** button.<br>5. Complete quiz and click **View Quiz Report Card**. | • Instant green highlight for correct / red for wrong with explanation.<br>• Generates fresh MCQs dynamically.<br>• Displays Letter Grade (A+), percentage, and solution review accordion. |
| **Scenario 3: Class 11/12 Stream Selector** 🎓 | 1. Select **Class 12**.<br>2. Select **Science**, **Commerce**, or **Arts** stream.<br>3. Select **Mathematics Part 1** or **Part 2**. | Dynamically updates subjects and official NCERT / Maharashtra State Board (ebalbharati) textbook chapters. |
| **Scenario 4: Curated Video Tutorials** 📺 | 1. Click **Videos** tab.<br>2. Select a video from playlist (*One-Shot Explanation*, *Top 10 Exam Numericals*). | Loads curated YouTube video player and duration cards. |
| **Scenario 5: Teacher Approval Hub** 👩‍🏫 | 1. Click **Teacher Hub** button in top right.<br>2. Inspect Quality Gate checklist.<br>3. Type custom teacher notes and click **Approve & Publish**. | Displays **100% Passed** quality gate checks, allows MCQ editing, and publishes pack. |

---

## 🐞 Step 4: Tester Bug Reporting Format

Ask your tester to report any findings using this template:

```text
- Test Scenario #: (e.g. Scenario 2)
- Device / Browser: (e.g. Chrome 122 on Windows 11)
- What happened: 
- What was expected:
- Screenshot / Error message (if any):
```
