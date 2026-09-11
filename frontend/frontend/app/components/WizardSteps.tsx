"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Database,
  GraduationCap,
  FlaskConical,
  Layers,
  LoaderCircle,
  Palette,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { StudyPackViewer } from "./StudyPackViewer";
import type { StudyPack } from "../api/studypack/generate/route";
import { getOfficialChapters, type ChapterInfo } from "../data/textbookTaxonomy";

const SUBJECTS_BY_STREAM: Record<string, string[]> = {
  Science: ["Mathematics Part 1", "Mathematics Part 2", "Physics", "Chemistry", "Biology"],
  Commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics Part 1"],
  Arts: ["History", "Political Science", "Geography", "Economics"],
  General: ["Mathematics Part 1", "Mathematics Part 2", "Science & Technology Part 1", "Science & Technology Part 2", "English", "Social Science"],
};

export function WizardSteps() {
  // Wizard Step state: 1 = Setup, 2 = Select Chapter, 3 = Study Mode
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selections
  const [board, setBoard] = useState<"CBSE" | "Maharashtra">("CBSE");
  const [grade, setGrade] = useState("Class 10");
  const [stream, setStream] = useState<"Science" | "Commerce" | "Arts">("Science");
  const [subject, setSubject] = useState("Mathematics Part 1");

  // Step 2 State
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [customChapter, setCustomChapter] = useState("");

  // Step 3 State
  const [studyPack, setStudyPack] = useState<StudyPack | null>(null);
  const [generatingPack, setGeneratingPack] = useState(false);

  const isSeniorSecondary = grade === "Class 11" || grade === "Class 12";
  const activeSubjects = isSeniorSecondary ? SUBJECTS_BY_STREAM[stream] || SUBJECTS_BY_STREAM["Science"] : SUBJECTS_BY_STREAM["General"];

  // Ensure active subject is valid when stream, grade, or board changes
  useEffect(() => {
    if (!activeSubjects.includes(subject)) {
      setSubject(activeSubjects[0]);
    }
  }, [stream, grade, isSeniorSecondary, board]);

  // Load verified textbook chapters whenever Board, Grade, Stream, or Subject changes
  useEffect(() => {
    const list = getOfficialChapters(board, grade, subject, isSeniorSecondary ? stream : undefined);
    setChapters(list || []);
  }, [board, grade, subject, stream, isSeniorSecondary]);

  async function startStudyPack(chapterId: string, title: string) {
    setGeneratingPack(true);
    try {
      const query = new URLSearchParams({
        board,
        grade,
        subject,
        chapter_id: chapterId,
        chapter_title: title,
        medium: "English",
      });
      const res = await fetch(`/api/studypack/generate?${query}`);
      const data = await res.json();
      setStudyPack(data.pack);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Failed to build study pack. Please try again.");
    } finally {
      setGeneratingPack(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Step Indicator Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <WizardStepBadge stepNumber={1} label="Choose Class & Stream" active={step === 1} done={step > 1} onClick={() => setStep(1)} />
            <ChevronRight size={16} className="text-slate-300" />
            <WizardStepBadge stepNumber={2} label="Pick Chapter" active={step === 2} done={step > 2} onClick={() => step > 1 && setStep(2)} />
            <ChevronRight size={16} className="text-slate-300" />
            <WizardStepBadge stepNumber={3} label="Study Mode" active={step === 3} done={false} onClick={() => studyPack && setStep(3)} />
          </div>

          {step > 1 && (
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200">
              <span>{board}</span> · <span>{grade}</span> {isSeniorSecondary && <span>· ({stream})</span>} · <span>{subject}</span>
              <button onClick={() => setStep(1)} className="ml-2 underline text-slate-500 hover:text-slate-900">
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: CHOOSE BOARD, GRADE & STREAM */}
      {step === 1 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-800 border border-sky-200">
              Step 1 of 3
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">Select Board, Class & Stream</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Choose your official framework to view verified textbook chapters.</p>
          </div>

          {/* Board Selector Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Select Board</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setBoard("CBSE")}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  board === "CBSE"
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/20"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-600 text-white font-extrabold shadow-md shadow-sky-600/20">
                  CBSE
                </div>
                <div>
                  <p className="font-bold text-slate-900">CBSE Board</p>
                  <p className="text-xs text-slate-500">Official NCERT Textbook Sequence</p>
                </div>
              </button>

              <button
                onClick={() => setBoard("Maharashtra")}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  board === "Maharashtra"
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/20">
                  MH
                </div>
                <div>
                  <p className="font-bold text-slate-900">Maharashtra Board</p>
                  <p className="text-xs text-slate-500">State Board (ebalbharati / SSC / HSC)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Grade Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">2. Select Class</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`rounded-2xl border py-3 text-xs font-bold transition ${
                    grade === g
                      ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Stream Selector for Class 11 & Class 12 */}
          {isSeniorSecondary && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-900">
                3. Select Stream for {grade}
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => setStream("Science")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-bold transition ${
                    stream === "Science"
                      ? "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-sky-100/50"
                  }`}
                >
                  <FlaskConical size={20} />
                  <div>
                    <p className="text-xs">Science Stream</p>
                    <p className="text-[10px] font-normal opacity-80">Physics, Chemistry, Math 1/2, Bio</p>
                  </div>
                </button>

                <button
                  onClick={() => setStream("Commerce")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-bold transition ${
                    stream === "Commerce"
                      ? "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/20"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-purple-100/50"
                  }`}
                >
                  <Briefcase size={20} />
                  <div>
                    <p className="text-xs">Commerce Stream</p>
                    <p className="text-[10px] font-normal opacity-80">Accountancy, B.Studies, Econ</p>
                  </div>
                </button>

                <button
                  onClick={() => setStream("Arts")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-bold transition ${
                    stream === "Arts"
                      ? "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-600/20"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-amber-100/50"
                  }`}
                >
                  <Palette size={20} />
                  <div>
                    <p className="text-xs">Arts / Humanities</p>
                    <p className="text-[10px] font-normal opacity-80">History, Pol Sci, Geography</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-sky-500 transition"
            >
              Continue to Select Subject & Chapter <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SUBJECT & CHAPTER */}
      {step === 2 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 border border-amber-200">
                Step 2 of 3
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Official Textbook Chapters</h2>
              <p className="text-xs text-slate-500 font-medium">
                Verified Syllabus: <strong className="text-sky-700">{board}</strong> · <strong className="text-sky-700">{grade}</strong> {isSeniorSecondary && <span>· <strong className="text-purple-700">({stream} Stream)</strong></span>}
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-1.5 rounded-xl bg-slate-50"
            >
              ← Change Class / Stream
            </button>
          </div>

          {/* Subject Pills for Stream */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {activeSubjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    subject === s
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Chapter Entry Input */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Want to study a specific chapter topic directly?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Type topic (e.g. Linear Equations Part 1, Similarity, Rotational Dynamics)...`}
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500"
              />
              <button
                disabled={!customChapter.trim() || generatingPack}
                onClick={() => startStudyPack("custom-ch-1", customChapter.trim())}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-400 disabled:opacity-50 shadow-md"
              >
                {generatingPack ? <LoaderCircle className="animate-spin" size={16} /> : <Zap size={16} />}
                Build Study Pack
              </button>
            </div>
          </div>

          {/* Official Verified Chapter List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="text-sky-600" size={18} /> Official Textbook Sequence for {board} {grade} — {subject} ({chapters.length} Chapters)
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {chapters.map((ch) => (
                <div
                  key={ch.chapter_number}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-500 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-extrabold text-sky-800">
                        Chapter {ch.chapter_number}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">Official Textbook</span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900 leading-snug">{ch.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ch.subtopics.map((sub, idx) => (
                        <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={generatingPack}
                    onClick={() => startStudyPack(`ch-${ch.chapter_number}`, `Chapter ${ch.chapter_number}: ${ch.title}`)}
                    className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl bg-sky-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-50 shadow-sm transition"
                  >
                    {generatingPack ? <LoaderCircle className="animate-spin" size={14} /> : <Zap size={14} />}
                    Start Chapter Study Pack ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: GUIDED STUDY MODE */}
      {step === 3 && studyPack && (
        <div>
          <StudyPackViewer pack={studyPack} onBackToSyllabus={() => setStep(2)} />
        </div>
      )}
    </div>
  );
}

function WizardStepBadge({
  stepNumber,
  label,
  active,
  done,
  onClick,
}: {
  stepNumber: number;
  label: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-xs font-bold transition ${
        active
          ? "text-sky-700 font-extrabold"
          : done
          ? "text-emerald-700"
          : "text-slate-400 cursor-not-allowed"
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-xs font-extrabold ${
          active
            ? "bg-sky-600 text-white ring-2 ring-sky-600/20 shadow-sm"
            : done
            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
            : "border border-slate-200 text-slate-400"
        }`}
      >
        {done ? "✓" : stepNumber}
      </span>
      <span>{label}</span>
    </button>
  );
}
