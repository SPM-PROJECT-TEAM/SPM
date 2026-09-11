# EduAI V1.1 — tester handoff

## Scope under test

Curriculum discovery for CBSE and Maharashtra Board. This build lets the user
select board, class, and subject, then displays matching resources from DIKSHA.
No login, AI-generated study content, user progress, podcasts, games, or
YouTube results are included in this release.

## Fastest test setup

Prerequisite: Node.js 20 or later.

```powershell
cd "$HOME\OneDrive\Desktop\EduAI-v1.1\frontend"
npm install
npm run dev
```

Open `http://localhost:3000`.

The dashboard uses its built-in server-side DIKSHA bridge, so Python and
Supabase are not required for the primary UI test.

## Optional backend API test

Prerequisite: Python 3.11 or later.

```powershell
cd "$HOME\OneDrive\Desktop\EduAI-v1.1\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
eduai-api
```

Then open `http://localhost:8000/health`. Expected response includes
`"status":"ok"` and version `"1.1.0"`.

## Test cases

| ID | Action | Expected result |
| --- | --- | --- |
| V11-01 | Open the dashboard | Dark EduAI dashboard loads without a blank screen. |
| V11-02 | Keep CBSE / Class 10 / Mathematics and select **Discover syllabus** | A success message gives a resource count; curriculum resource cards appear. |
| V11-03 | Change grade and subject, then discover | Results heading reflects the selected board, grade, and subject. |
| V11-04 | Change board to Maharashtra and discover | The request completes with results or a clear source-unavailable message; no crash. |
| V11-05 | Temporarily disconnect internet and discover | Button stops loading and a clear retry message appears. |
| V11-06 | Check narrow mobile width | Selectors and resource cards remain readable and usable. |
| V11-07 | Run `npm run build` | Production build exits successfully. |

## Known limits

- DIKSHA search results are official resource metadata, not a verified chapter
  sequence yet.
- Board labels and available metadata can vary by DIKSHA channel.
- Important questions and AI study packs begin in Version 1.2.
- The public DIKSHA service can be temporarily unavailable; report the time,
  filters used, and displayed message.

## Bug report format

```text
Version: 1.1
Test ID:
Board / Class / Subject:
Steps taken:
Expected result:
Actual result:
Screenshot or screen recording:
Browser and device:
Time and timezone:
```
