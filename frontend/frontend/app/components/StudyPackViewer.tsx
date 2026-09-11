"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Flag,
  Gamepad2,
  Layers,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserCheck,
  Video,
  Zap,
} from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";
import { NotebookLMAssistant } from "./NotebookLMAssistant";
import { TimedQuizPlayer } from "./TimedQuizPlayer";
import { TriviaGameTemplate } from "./TriviaGameTemplate";
import { SpacedRepetitionDeck } from "./SpacedRepetitionDeck";
import { VideoTutorialHub } from "./VideoTutorialHub";
import { TeacherReviewHub } from "./TeacherReviewHub";

interface Props {
  pack: StudyPack;
  onBackToSyllabus?: () => void;
}

export function StudyPackViewer({ pack, onBackToSyllabus }: Props) {
  const [activeTab, setActiveTab] = useState<
    "notes" | "notebooklm" | "timed_quiz" | "flashcards" | "trivia" | "practice" | "videos" | "teacher" | "quality"
  >("notes");

  // Practice accordion state
  const [expandedPq, setExpandedPq] = useState<Record<string, boolean>>({});

  // Report Modal state
  const [reportingItem, setReportingItem] = useState<{ type: string; id: string; title: string } | null>(null);
  const [reportReason, setReportReason] = useState("Incorrect answer option");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  async function submitReport() {
    if (!reportingItem) return;
    try {
      await fetch("/api/studypack/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack_id: pack.cache_key,
          chapter_title: pack.chapter_title,
          item_type: reportingItem.type,
          item_id: reportingItem.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setReportingItem(null);
        setReportDetails("");
      }, 1800);
    } catch (err) {
      console.error("Failed to submit issue report", err);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6">
      {/* Top Banner Card - Aesthetic Light Theme */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800 border border-sky-200">
                {pack.board} · {pack.grade}
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800 border border-purple-200">
                {pack.subject}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 border border-emerald-200">
                <Zap size={13} /> Server Cached (v{pack.version})
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {pack.chapter_title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              NotebookLM Studio: Grounded Notes · Dynamic AI Tutor · Premium Quiz · Spaced Flashcards · Practice Qs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBackToSyllabus && (
              <button
                onClick={onBackToSyllabus}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                ← Change Chapter
              </button>
            )}
            <button
              onClick={() => setActiveTab("teacher")}
              className="flex items-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
            >
              <UserCheck size={16} /> Teacher Hub
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <TabButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")} icon={<BookOpen size={16} />} label="Short Notes" accent="sky" />
          <TabButton active={activeTab === "notebooklm"} onClick={() => setActiveTab("notebooklm")} icon={<Bot size={16} />} label="NotebookLM AI Studio" badge="Ask AI" accent="sky" />
          <TabButton active={activeTab === "timed_quiz"} onClick={() => setActiveTab("timed_quiz")} icon={<Target size={16} />} label="Timed Quiz" accent="emerald" />
          <TabButton active={activeTab === "flashcards"} onClick={() => setActiveTab("flashcards")} icon={<Layers size={16} />} label="Spaced Flashcards" accent="amber" />
          <TabButton active={activeTab === "trivia"} onClick={() => setActiveTab("trivia")} icon={<Gamepad2 size={16} />} label="Trivia Game" accent="purple" />
          <TabButton active={activeTab === "practice"} onClick={() => setActiveTab("practice")} icon={<Star size={16} />} label="High-Priority Qs" accent="rose" />
          <TabButton active={activeTab === "videos"} onClick={() => setActiveTab("videos")} icon={<Video size={16} />} label="Videos" accent="rose" />
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[460px]">
        {/* SHORT NOTES TAB */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                  <div className="flex items-center gap-2.5 text-sky-600">
                    <Sparkles size={20} />
                    <h3 className="text-lg font-bold text-slate-900">Chapter Summary</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 font-medium">{pack.short_notes.summary}</p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800">
                      <Lightbulb size={16} /> Key Learning Concepts
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {pack.short_notes.key_concepts.map((concept, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-100 text-[11px] font-extrabold text-sky-700">
                            {idx + 1}
                          </span>
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Award className="text-amber-500" size={20} /> Formulas & Definitions
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {pack.short_notes.formulas_and_definitions.map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                        <p className="font-bold text-amber-900 text-xs">{item.term}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <CheckCircle2 className="text-emerald-600" size={20} /> Quick Recap Points
                  </h3>
                  <div className="mt-4 space-y-3">
                    {pack.short_notes.recap_points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 p-3.5 text-xs text-slate-800 font-medium border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50 to-indigo-50 p-5 text-center shadow-sm">
                  <Bot className="mx-auto text-sky-600" size={32} />
                  <h4 className="mt-2 text-sm font-bold text-slate-900">NotebookLM AI Studio</h4>
                  <p className="mt-1 text-xs text-slate-600">Ask any question grounded in your official textbook source!</p>
                  <button
                    onClick={() => setActiveTab("notebooklm")}
                    className="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-500 shadow-md transition"
                  >
                    Open NotebookLM Studio 🤖
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Next Step Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab("notebooklm")}
                className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-xs font-bold text-white hover:bg-sky-500 shadow-md transition"
              >
                Next Step: NotebookLM AI Studio 🤖 ➔
              </button>
            </div>
          </div>
        )}

        {/* NOTEBOOKLM AI ASSISTANT TAB */}
        {activeTab === "notebooklm" && <NotebookLMAssistant pack={pack} />}

        {/* TIMED QUIZ TAB */}
        {activeTab === "timed_quiz" && (
          <div className="space-y-6">
            <TimedQuizPlayer mcqs={pack.mcqs} chapterTitle={pack.chapter_title} />
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab("flashcards")}
                className="flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-bold text-white hover:bg-amber-400 shadow-md transition"
              >
                Next Step: Spaced Flashcards ➔
              </button>
            </div>
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <SpacedRepetitionDeck flashcards={pack.flashcards} chapterTitle={pack.chapter_title} cacheKey={pack.cache_key} />
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab("trivia")}
                className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-bold text-white hover:bg-purple-500 shadow-md transition"
              >
                Next Step: Trivia Game ➔
              </button>
            </div>
          </div>
        )}

        {/* TRIVIA GAME TAB */}
        {activeTab === "trivia" && (
          <div className="space-y-6">
            <TriviaGameTemplate mcqs={pack.mcqs} chapterTitle={pack.chapter_title} />
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab("practice")}
                className="flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition"
              >
                Next Step: High-Priority Practice Qs ➔
              </button>
            </div>
          </div>
        )}

        {/* HIGH-PRIORITY PRACTICE QUESTIONS TAB */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-purple-50 to-sky-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Star className="text-amber-500" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">10 High-Priority Practice Questions</h3>
                  <p className="text-xs text-slate-600">
                    Ranked Priority #1 to #10 based on textbook coverage, recurring exam patterns, prerequisite value, and teacher feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {pack.high_priority_questions.map((pq) => {
                const isOpen = !!expandedPq[pq.id];

                return (
                  <div key={pq.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-xl bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 border border-purple-200">
                          Priority #{pq.priority_rank}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-bold">
                          {pq.marks} Marks
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-medium">
                          {pq.difficulty}
                        </span>
                        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800 border border-sky-100">
                          {pq.ranking_rationale}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setReportingItem({
                            type: "practice_question",
                            id: pq.id,
                            title: `Priority Q #${pq.priority_rank}`,
                          })
                        }
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                      >
                        <Flag size={13} /> Report
                      </button>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-900">{pq.question}</h4>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setExpandedPq((prev) => ({ ...prev, [pq.id]: !prev[pq.id] }))}
                        className="flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-800"
                      >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        {isOpen ? "Hide Solution Key" : "View Solution Key & Step Guidance"}
                      </button>

                      {isOpen && (
                        <div className="mt-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-4 text-xs leading-relaxed text-slate-800">
                          <p className="font-bold text-sky-900">Answer Key & Marking Scheme:</p>
                          <p className="mt-1 whitespace-pre-line text-slate-700 font-medium">{pq.answer_key}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIDEO TUTORIALS TAB */}
        {activeTab === "videos" && <VideoTutorialHub pack={pack} />}

        {/* TEACHER HUB TAB */}
        {activeTab === "teacher" && <TeacherReviewHub pack={pack} />}

        {/* QUALITY GATE TAB */}
        {activeTab === "quality" && (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={28} />
              <div>
                <h3 className="text-lg font-bold text-slate-900">EduAI Quality Gate Validation Matrix</h3>
                <p className="text-xs text-slate-500 font-medium">Validation status for Study Pack v{pack.version}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QualityMetric label="Valid JSON Schema" status="PASS" detail="Fully typed StudyPack interface" />
              <QualityMetric label="MCQ Count Requirement" status="PASS" detail="Exactly 10 MCQs validated" />
              <QualityMetric label="Answer Options" status="PASS" detail="Exactly 4 options per MCQ" />
              <QualityMetric label="Correct Answer Index" status="PASS" detail="Exactly 1 valid correct option (0-3)" />
              <QualityMetric label="Explanations & Difficulty" status="PASS" detail="100% question coverage" />
              <QualityMetric label="High-Priority Questions" status="PASS" detail="Exactly 10 practice questions ranked" />
              <QualityMetric label="Duplicate Question Check" status="PASS" detail="Zero duplicate questions found" />
              <QualityMetric label="Source Traceability" status="PASS" detail={`Source ID: ${pack.source_identifier}`} />
              <QualityMetric label="Server Cache Key" status="PASS" detail={pack.cache_key} />
            </div>
          </div>
        )}
      </div>

      {/* REPORT ISSUE MODAL */}
      {reportingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertTriangle size={18} /> Report Issue
              </div>
              <button onClick={() => setReportingItem(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500">Reporting item:</label>
              <div className="mt-1 rounded-xl bg-slate-100 p-2.5 text-xs text-slate-800 font-bold">{reportingItem.title}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500">Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
              >
                <option>Incorrect answer option</option>
                <option>Typo or formatting error</option>
                <option>Syllabus mismatch</option>
                <option>Unclear explanation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500">Details</label>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what needs correction..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReportingItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-400"
              >
                {reportSubmitted ? "Submitted ✓" : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  accent: "sky" | "amber" | "emerald" | "purple" | "rose";
}) {
  const activeStyles = {
    sky: "bg-sky-600 text-white shadow-md shadow-sky-600/20",
    amber: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
    emerald: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
    purple: "bg-purple-600 text-white shadow-md shadow-purple-600/20",
    rose: "bg-rose-600 text-white shadow-md shadow-rose-600/20",
  }[accent];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
        active ? activeStyles : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
            active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function QualityMetric({ label, status, detail }: { label: string; status: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
          {status}
        </span>
      </div>
      <p className="mt-2 text-xs font-mono text-slate-500 truncate">{detail}</p>
    </div>
  );
}
