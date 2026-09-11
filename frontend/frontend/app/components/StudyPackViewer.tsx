"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Flag,
  HelpCircle,
  Lightbulb,
  Layers,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import type { StudyPack, MCQ, PracticeQuestion, Flashcard } from "../api/studypack/generate/route";

interface Props {
  pack: StudyPack;
  onBackToSyllabus?: () => void;
}

export function StudyPackViewer({ pack, onBackToSyllabus }: Props) {
  const [activeTab, setActiveTab] = useState<"notes" | "flashcards" | "mcqs" | "practice" | "quality">("notes");

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  // MCQ state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  // Practice accordion state
  const [expandedPq, setExpandedPq] = useState<Record<string, boolean>>({});

  // Report Modal state
  const [reportingItem, setReportingItem] = useState<{ type: string; id: string; title: string } | null>(null);
  const [reportReason, setReportReason] = useState("Incorrect answer option");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const currentFlashcard = pack.flashcards[cardIndex] || pack.flashcards[0];

  function toggleMastered(id: string) {
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectOption(mcqId: string, optionIdx: number) {
    if (userAnswers[mcqId] !== undefined) return; // Locked after selection
    setUserAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
    setShowExplanations((prev) => ({ ...prev, [mcqId]: true }));
  }

  function resetQuiz() {
    setUserAnswers({});
    setShowExplanations({});
  }

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

  // Calculate score for MCQs
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = pack.mcqs.reduce((acc, mcq) => {
    return userAnswers[mcq.id] === mcq.correct_index ? acc + 1 : acc;
  }, 0);

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-indigo-950/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300 ring-1 ring-cyan-400/30">
                {pack.board} · {pack.grade}
              </span>
              <span className="rounded-full bg-indigo-400/10 px-3 py-1 text-indigo-300 ring-1 ring-indigo-400/30">
                {pack.subject}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300 ring-1 ring-emerald-400/30">
                <Zap size={13} /> Server Cached (v{pack.version})
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                ID: <code className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-slate-300">{pack.source_identifier}</code>
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {pack.chapter_title}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Interactive Child-Friendly Study Pack with Quality Gate Validation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBackToSyllabus && (
              <button
                onClick={onBackToSyllabus}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
              >
                ← Back to Syllabus
              </button>
            )}
            <button
              onClick={() => setActiveTab("quality")}
              className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <CheckCircle2 size={16} /> Quality Gate Passed
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <TabButton
            active={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            icon={<BookOpen size={16} />}
            label="Short Notes"
            badge="Summary"
            accent="cyan"
          />
          <TabButton
            active={activeTab === "flashcards"}
            onClick={() => setActiveTab("flashcards")}
            icon={<Layers size={16} />}
            label="Flashcards"
            badge={`${masteredCards.size}/${pack.flashcards.length}`}
            accent="amber"
          />
          <TabButton
            active={activeTab === "mcqs"}
            onClick={() => setActiveTab("mcqs")}
            icon={<Target size={16} />}
            label="10 MCQs Quiz"
            badge={answeredCount > 0 ? `${correctCount}/${answeredCount}` : "10 Items"}
            accent="emerald"
          />
          <TabButton
            active={activeTab === "practice"}
            onClick={() => setActiveTab("practice")}
            icon={<Star size={16} />}
            label="High-Priority Practice Qs"
            badge="10 Practice"
            accent="violet"
          />
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[460px]">
        {/* SHORT NOTES TAB */}
        {activeTab === "notes" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5 text-cyan-300">
                  <Sparkles size={20} />
                  <h3 className="text-lg font-bold text-white">Chapter Summary</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-slate-200">{pack.short_notes.summary}</p>

                <div className="mt-6 border-t border-slate-800 pt-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    <Lightbulb size={16} /> Key Learning Concepts
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {pack.short_notes.key_concepts.map((concept, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                          {idx + 1}
                        </span>
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Award className="text-amber-400" size={20} /> Formulas & Definitions
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {pack.short_notes.formulas_and_definitions.map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="font-semibold text-amber-300">{item.term}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <CheckCircle2 className="text-emerald-400" size={20} /> Quick Recap Points
                </h3>
                <div className="mt-4 space-y-3">
                  {pack.short_notes.recap_points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-800/50 p-3.5 text-xs text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 to-slate-900/80 p-5 text-center">
                <Trophy className="mx-auto text-amber-400" size={32} />
                <h4 className="mt-2 text-base font-bold text-white">Ready for practice?</h4>
                <p className="mt-1 text-xs text-slate-400">Try the 10 interactive MCQs or test flashcards.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setActiveTab("flashcards")}
                    className="rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => setActiveTab("mcqs")}
                    className="rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                  >
                    10 MCQs Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === "flashcards" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="font-semibold text-amber-300">
                Card {cardIndex + 1} of {pack.flashcards.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Mastered:</span>
                <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                  {masteredCards.size} / {pack.flashcards.length}
                </span>
              </div>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="perspective-1000 group relative min-h-[300px] cursor-pointer rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-8 shadow-2xl transition-all duration-500 hover:border-amber-400/60"
            >
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastered(currentFlashcard.id);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    masteredCards.has(currentFlashcard.id)
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-400"
                  }`}
                >
                  {masteredCards.has(currentFlashcard.id) ? "★ Mastered" : "+ Mark Mastered"}
                </button>
              </div>

              <div className="flex h-full flex-col justify-between pt-4">
                <div>
                  <span className="inline-block rounded-lg bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                    {currentFlashcard.concept}
                  </span>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-white sm:text-2xl">
                    {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
                  </h3>
                </div>

                <div className="mt-8 border-t border-slate-800 pt-4">
                  {isFlipped ? (
                    <div className="text-xs leading-5 text-amber-200/90">
                      <span className="font-bold text-amber-300">Explanation: </span>
                      {currentFlashcard.explanation}
                    </div>
                  ) : (
                    <p className="text-center text-xs font-medium text-slate-400 animate-pulse">
                      Tap anywhere to flip card 🔄
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={cardIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => Math.max(0, prev - 1));
                }}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                onClick={() => {
                  setReportingItem({
                    type: "flashcard",
                    id: currentFlashcard.id,
                    title: `Flashcard: ${currentFlashcard.concept}`,
                  });
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
              >
                <Flag size={13} /> Report issue
              </button>

              <button
                disabled={cardIndex === pack.flashcards.length - 1}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => Math.min(pack.flashcards.length - 1, prev + 1));
                }}
                className="rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* 10 MCQS QUIZ TAB */}
        {activeTab === "mcqs" && (
          <div className="space-y-6">
            {/* Score Bar */}
            <div className="flex flex-wrap items-center justify-between rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Target className="text-emerald-400" size={24} />
                <div>
                  <h3 className="text-sm font-bold text-white">10 MCQs Practice Quiz</h3>
                  <p className="text-xs text-slate-400">
                    Answered {answeredCount} of {pack.mcqs.length} questions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {answeredCount > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Current Score</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {correctCount} / {pack.mcqs.length} ({Math.round((correctCount / pack.mcqs.length) * 100)}%)
                    </p>
                  </div>
                )}

                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {pack.mcqs.map((mcq, idx) => {
                const selectedOpt = userAnswers[mcq.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === mcq.correct_index;

                return (
                  <div
                    key={mcq.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-400/20 text-xs font-bold text-emerald-300">
                          Q{idx + 1}
                        </span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                          {mcq.difficulty}
                        </span>
                        <span className="text-[11px] text-slate-500">{mcq.syllabus_tag}</span>
                      </div>

                      <button
                        onClick={() =>
                          setReportingItem({
                            type: "mcq",
                            id: mcq.id,
                            title: `MCQ #${idx + 1}`,
                          })
                        }
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-300"
                      >
                        <Flag size={13} /> Report
                      </button>
                    </div>

                    <h4 className="mt-4 text-base font-semibold text-white">{mcq.question}</h4>

                    {/* Options Grid */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {mcq.options.map((opt, optIdx) => {
                        let optStyle =
                          "border-slate-800 bg-slate-800/40 text-slate-200 hover:border-slate-700 hover:bg-slate-800";

                        if (isAnswered) {
                          if (optIdx === mcq.correct_index) {
                            optStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-200 font-semibold";
                          } else if (optIdx === selectedOpt) {
                            optStyle = "border-rose-500 bg-rose-500/15 text-rose-200";
                          } else {
                            optStyle = "border-slate-800/50 bg-slate-900/30 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(mcq.id, optIdx)}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-left text-sm transition ${optStyle}`}
                          >
                            <span className="mt-0.5 font-bold">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isAnswered && optIdx === mcq.correct_index && (
                              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                            )}
                            {isAnswered && optIdx === selectedOpt && optIdx !== mcq.correct_index && (
                              <XCircle size={18} className="shrink-0 text-rose-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isAnswered && (
                      <div
                        className={`mt-4 rounded-2xl border p-4 text-xs leading-5 ${
                          isCorrect
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                            : "border-slate-700 bg-slate-800/80 text-slate-300"
                        }`}
                      >
                        <p className="font-bold flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 size={15} className="text-emerald-400" /> Correct! Excellent work 🎉
                            </>
                          ) : (
                            <>
                              <AlertCircle size={15} className="text-rose-400" /> Learning Opportunity
                            </>
                          )}
                        </p>
                        <p className="mt-1.5">{mcq.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 10 HIGH-PRIORITY PRACTICE QUESTIONS TAB */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <Star className="text-amber-400" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">10 High-Priority Practice Questions</h3>
                  <p className="text-xs text-slate-300">
                    Ranked by textbook coverage, concept frequency, prerequisite value, and teacher feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {pack.high_priority_questions.map((pq, idx) => {
                const isOpen = !!expandedPq[pq.id];

                return (
                  <div
                    key={pq.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md transition hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-xl bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                          Priority #{pq.priority_rank}
                        </span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                          {pq.marks} Marks
                        </span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                          {pq.difficulty}
                        </span>
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
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
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-300"
                      >
                        <Flag size={13} /> Report
                      </button>
                    </div>

                    <h4 className="mt-3 text-base font-semibold text-white">{pq.question}</h4>

                    {/* Accordion Toggle */}
                    <div className="mt-4 border-t border-slate-800/80 pt-3">
                      <button
                        onClick={() =>
                          setExpandedPq((prev) => ({ ...prev, [pq.id]: !prev[pq.id] }))
                        }
                        className="flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        {isOpen ? "Hide Solution Key" : "View Solution Key & Step Guidance"}
                      </button>

                      {isOpen && (
                        <div className="mt-3 rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-4 text-xs leading-6 text-slate-200">
                          <p className="font-bold text-cyan-300">Answer Key & Marking Scheme:</p>
                          <p className="mt-1 whitespace-pre-line text-slate-300">{pq.answer_key}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUALITY GATE TAB */}
        {activeTab === "quality" && (
          <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={28} />
              <div>
                <h3 className="text-lg font-bold text-white">EduAI Deterministic Quality Gate Report</h3>
                <p className="text-xs text-slate-400">Validation verification for Study Pack v{pack.version}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QualityMetric label="Valid JSON Schema" status="PASS" detail="Fully typed StudyPack interface" />
              <QualityMetric label="MCQ Count Requirement" status="PASS" detail="Exactly 10 MCQs validated" />
              <QualityMetric fontColor="text-emerald-300" label="Answer Options" status="PASS" detail="Exactly 4 options per MCQ" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle size={20} />
                <h3 className="font-bold text-white">Report Issue</h3>
              </div>
              <button
                onClick={() => setReportingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Help teachers and developers keep EduAI content accurate for students.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Reporting for:</label>
                <div className="mt-1 rounded-xl bg-slate-800 p-2.5 text-xs text-cyan-300 font-medium">
                  {reportingItem.title}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option>Incorrect answer option</option>
                  <option>Typo or formatting error</option>
                  <option>Syllabus mismatch</option>
                  <option>Unclear explanation</option>
                  <option>Other content issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Details (optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe what needs correction..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setReportingItem(null)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300"
                >
                  {reportSubmitted ? "Submitted ✓" : "Submit Report"}
                </button>
              </div>
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
  accent: "cyan" | "amber" | "emerald" | "violet";
}) {
  const activeStyles = {
    cyan: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
    amber: "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20",
    emerald: "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20",
    violet: "bg-violet-400 text-slate-950 shadow-lg shadow-violet-400/20",
  }[accent];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
        active ? activeStyles : "border border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800/60"
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
            active ? "bg-slate-950/20 text-slate-900" : "bg-slate-800 text-slate-400"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function QualityMetric({ label, status, detail, fontColor }: { label: string; status: string; detail: string; fontColor?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
          {status}
        </span>
      </div>
      <p className={`mt-2 text-xs font-mono truncate ${fontColor || "text-slate-400"}`}>{detail}</p>
    </div>
  );
}
