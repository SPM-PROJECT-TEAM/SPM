"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  GraduationCap,
  Layers,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { StudyPackViewer } from "./StudyPackViewer";
import type { StudyPack } from "../api/studypack/generate/route";

type CurriculumItem = {
  diksha_identifier: string;
  title: string;
  board: string | null;
  grade_levels: string[];
  subjects: string[];
  topics: string[];
  content_type: string | null;
  medium: string | null;
};

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Social Science",
  "Physics",
  "Chemistry",
  "Biology",
];

export function WizardSteps() {
  // Wizard Step state: 1 = Setup, 2 = Select Chapter, 3 = Study Mode
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selections
  const [board, setBoard] = useState<"CBSE" | "Maharashtra">("CBSE");
  const [grade, setGrade] = useState("Class 10");
  const [subject, setSubject] = useState("Mathematics");

  // Step 2 State
  const [items, setItems] = useState<CurriculumItem[]>([]);
  const [fetchingResources, setFetchingResources] = useState(false);
  const [resourceFound, setResourceFound] = useState<boolean | null>(null);
  const [customChapter, setCustomChapter] = useState("");

  // Step 3 State
  const [studyPack, setStudyPack] = useState<StudyPack | null>(null);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [activeChapterTitle, setActiveChapterTitle] = useState("");

  // Fetch DIKSHA resources when entering Step 2 or changing subject
  useEffect(() => {
    if (step === 2) {
      fetchSyllabus();
    }
  }, [step, subject, board, grade]);

  async function fetchSyllabus() {
    setFetchingResources(true);
    setResourceFound(null);
    try {
      const query = new URLSearchParams({ board, grade, subject });
      const res = await fetch(`/api/curriculum/search?${query}`);
      const data = await res.json();
      setItems(data.items || []);
      setResourceFound(data.found && data.items.length > 0);
    } catch {
      setItems([]);
      setResourceFound(false);
    } finally {
      setFetchingResources(false);
    }
  }

  async function startStudyPack(chapterId: string, title: string) {
    setGeneratingPack(true);
    setActiveChapterTitle(title);
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
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <WizardStepBadge stepNumber={1} label="Choose Class" active={step === 1} done={step > 1} onClick={() => setStep(1)} />
            <ChevronRight size={16} className="text-slate-600" />
            <WizardStepBadge stepNumber={2} label="Pick Chapter" active={step === 2} done={step > 2} onClick={() => step > 1 && setStep(2)} />
            <ChevronRight size={16} className="text-slate-600" />
            <WizardStepBadge stepNumber={3} label="Study Mode" active={step === 3} done={false} onClick={() => studyPack && setStep(3)} />
          </div>

          {step > 1 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-full border border-cyan-500/20">
              <span>{board}</span> · <span>{grade}</span> · <span>{subject}</span>
              <button
                onClick={() => setStep(1)}
                className="ml-2 underline text-slate-400 hover:text-white"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: CHOOSE BOARD & GRADE */}
      {step === 1 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl space-y-8 backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              Step 1 of 3
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">Select Your School Board & Class</h2>
            <p className="mt-1 text-sm text-slate-400">Choose your official curriculum framework to get started.</p>
          </div>

          {/* Board Selector Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Select Board</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setBoard("CBSE")}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  board === "CBSE"
                    ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/30"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-400/20 text-cyan-300 font-bold">
                  CBSE
                </div>
                <div>
                  <p className="font-bold text-white">CBSE Board</p>
                  <p className="text-xs text-slate-400">NCERT National Curriculum</p>
                </div>
              </button>

              <button
                onClick={() => setBoard("Maharashtra")}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  board === "Maharashtra"
                    ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/30"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/20 text-violet-300 font-bold">
                  MH
                </div>
                <div>
                  <p className="font-bold text-white">Maharashtra Board</p>
                  <p className="text-xs text-slate-400">State Board Curriculum</p>
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
                      ? "border-amber-400 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                      : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 text-xs font-extrabold text-slate-950 transition hover:bg-cyan-300"
            >
              Continue to Select Subject & Chapter <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SUBJECT & CHAPTER */}
      {step === 2 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                Step 2 of 3
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-white">Pick a Subject & Chapter</h2>
              <p className="text-xs text-slate-400">
                Current Filter: <strong className="text-cyan-300">{board}</strong> · <strong className="text-cyan-300">{grade}</strong>
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-xl"
            >
              ← Change Class / Board
            </button>
          </div>

          {/* Subject Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    subject === s
                      ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                      : "border border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Chapter Entry Input */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Want to study a specific chapter directly?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Type chapter name (e.g. Real Numbers, Light Reflection, Chemical Reactions)...`}
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
              <button
                disabled={!customChapter.trim() || generatingPack}
                onClick={() => startStudyPack("custom-ch-1", customChapter.trim())}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
              >
                {generatingPack ? <LoaderCircle className="animate-spin" size={16} /> : <Zap size={16} />}
                Generate Study Pack
              </button>
            </div>
          </div>

          {/* Chapter Resources List with Accuracy Check */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">
              Official DIKSHA Curriculum Chapters for {subject}
            </h3>

            {fetchingResources ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center">
                <LoaderCircle className="mx-auto text-cyan-400 animate-spin" size={28} />
                <p className="mt-3 text-xs text-slate-400">Searching DIKSHA textbook resources...</p>
              </div>
            ) : resourceFound === false ? (
              /* Resource Not Available Alert Box */
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-center space-y-3">
                <AlertTriangle className="mx-auto text-rose-400" size={32} />
                <h4 className="text-base font-bold text-white">Resource Not Available in DIKSHA</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  No official textbook records were returned by DIKSHA for <strong>{board} {grade} — {subject}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => startStudyPack("ch-gen-1", `${subject} Core Concepts`)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300"
                  >
                    <Zap size={15} /> Build AI Study Pack for {subject}
                  </button>
                  <button
                    onClick={() => setSubject("Mathematics")}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    Try Mathematics Instead
                  </button>
                </div>
              </div>
            ) : (
              /* Resources Grid */
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.diksha_identifier}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-cyan-400/40"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-cyan-300">
                        <BookOpen size={16} />
                        <span className="text-[11px] font-bold uppercase">{item.content_type || "Textbook Chapter"}</span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-white leading-snug">{item.title}</p>
                    </div>

                    <button
                      disabled={generatingPack}
                      onClick={() => startStudyPack(item.diksha_identifier, item.title)}
                      className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl bg-cyan-400/15 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/25 disabled:opacity-50"
                    >
                      {generatingPack ? <LoaderCircle className="animate-spin" size={14} /> : <Zap size={14} />}
                      Start Study Mode ➔
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          ? "text-cyan-300 font-extrabold"
          : done
          ? "text-emerald-400"
          : "text-slate-500 cursor-not-allowed"
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-xs font-extrabold ${
          active
            ? "bg-cyan-400 text-slate-950 ring-2 ring-cyan-400/40"
            : done
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            : "border border-slate-700 text-slate-600"
        }`}
      >
        {done ? "✓" : stepNumber}
      </span>
      <span>{label}</span>
    </button>
  );
}
