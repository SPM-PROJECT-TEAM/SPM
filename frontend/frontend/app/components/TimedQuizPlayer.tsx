"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  HelpCircle,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import type { MCQ } from "../api/studypack/generate/route";

interface Props {
  mcqs: MCQ[];
  chapterTitle: string;
}

export function TimedQuizPlayer({ mcqs: initialMcqs, chapterTitle }: Props) {
  const [activeMcqs, setActiveMcqs] = useState<MCQ[]>(initialMcqs);
  const [quizLength, setQuizLength] = useState<10 | 20 | "all">(10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [loadingMoreAi, setLoadingMoreAi] = useState(false);

  // Sync initial MCQs if props change
  useEffect(() => {
    setActiveMcqs(initialMcqs);
  }, [initialMcqs]);

  // Determine active slice of questions based on selected quiz mode
  const currentMcqPool = quizLength === 10 ? activeMcqs.slice(0, 10) : activeMcqs;

  const currentMcq = currentMcqPool[currentIndex] || currentMcqPool[0];
  const userSelectedIndex = selectedOptions[currentIndex];
  const answered = isAnswered[currentIndex];

  // 10-Minute Timer countdown
  useEffect(() => {
    if (isCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isCompleted, timeLeft]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleSelectOption(optionIndex: number) {
    if (answered || isCompleted) return;

    setSelectedOptions((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setIsAnswered((prev) => ({ ...prev, [currentIndex]: true }));
  }

  function handleNext() {
    if (currentIndex < currentMcqPool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function restartQuiz() {
    setSelectedOptions({});
    setIsAnswered({});
    setCurrentIndex(0);
    setTimeLeft(600);
    setIsCompleted(false);
    setReviewMode(false);
  }

  async function generateMoreWithAi() {
    setLoadingMoreAi(true);
    try {
      const res = await fetch("/api/studypack/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_title: chapterTitle,
          count: 10,
        }),
      });

      const data = await res.json();
      if (data.mcqs && Array.isArray(data.mcqs)) {
        setActiveMcqs((prev) => [...prev, ...data.mcqs]);
        setQuizLength("all");
        alert(`NotebookLM AI generated ${data.mcqs.length} fresh MCQs dynamically!`);
      }
    } catch (err) {
      console.error("Failed to generate more MCQs", err);
    } finally {
      setLoadingMoreAi(false);
    }
  }

  // Calculate score stats
  const totalQuestions = currentMcqPool.length;
  let correctCount = 0;
  const weakTopics: string[] = [];

  currentMcqPool.forEach((mcq, idx) => {
    const selected = selectedOptions[idx];
    if (selected === mcq.correct_index) {
      correctCount++;
    } else if (selected !== undefined) {
      if (mcq.syllabus_tag && !weakTopics.includes(mcq.syllabus_tag)) {
        weakTopics.push(mcq.syllabus_tag);
      }
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  function getGradeLabel(pct: number) {
    if (pct >= 90) return { grade: "A+", title: "Outstanding Mastery!", color: "text-emerald-600 bg-emerald-100 border-emerald-300" };
    if (pct >= 70) return { grade: "A", title: "Great Job!", color: "text-sky-600 bg-sky-100 border-sky-300" };
    if (pct >= 50) return { grade: "B", title: "Good Effort!", color: "text-amber-600 bg-amber-100 border-amber-300" };
    return { grade: "C", title: "Needs Revision", color: "text-rose-600 bg-rose-100 border-rose-300" };
  }

  const gradeInfo = getGradeLabel(percentage);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
      {/* QUIZ HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200">
              <Zap size={13} /> NotebookLM Dynamic Quiz Studio
            </span>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-extrabold text-sky-800">
              {activeMcqs.length} Total MCQs Available
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{chapterTitle}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quiz Length Mode Pills */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => { setQuizLength(10); restartQuiz(); }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                quizLength === 10 ? "bg-white text-slate-900 shadow-xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              10 Qs
            </button>
            <button
              onClick={() => { setQuizLength(20); restartQuiz(); }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                quizLength === 20 ? "bg-white text-slate-900 shadow-xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              20 Qs (Full)
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3.5 py-2 border border-amber-200 text-amber-800 text-xs font-extrabold shadow-xs">
            <Clock size={15} className="text-amber-600 animate-pulse" />
            <span>Time: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={restartQuiz}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* QUIZ IN PROGRESS VIEW */}
      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress Bar & Question Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 text-sky-800 font-extrabold">
                {currentMcq.difficulty} Level
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 space-y-5">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-sky-600 text-white font-extrabold text-sm shadow-md">
                Q{currentIndex + 1}
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug pt-0.5">
                {currentMcq.question}
              </h4>
            </div>

            {/* Answer Options Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentMcq.options.map((opt, optionIdx) => {
                const isSelected = userSelectedIndex === optionIdx;
                const isCorrect = currentMcq.correct_index === optionIdx;

                let optionStyle = "border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50/50";
                let badgeContent = null;

                if (answered) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold";
                    badgeContent = <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700"><CheckCircle2 size={16} /> Correct</span>;
                  } else if (isSelected) {
                    optionStyle = "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20 font-bold";
                    badgeContent = <span className="flex items-center gap-1 text-xs font-extrabold text-rose-700"><XCircle size={16} /> Incorrect</span>;
                  } else {
                    optionStyle = "border-slate-200 bg-slate-100/60 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={optionIdx}
                    disabled={answered}
                    onClick={() => handleSelectOption(optionIdx)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition transform active:scale-[0.99] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {String.fromCharCode(65 + optionIdx)}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </div>

                    {badgeContent}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box on Answer */}
            {answered && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs leading-relaxed text-slate-800 space-y-1 animate-fadeIn">
                <p className="font-extrabold text-sky-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-sky-600" /> Explanation & Concept Breakdown:
                </p>
                <p className="text-slate-700 font-medium">{currentMcq.explanation}</p>
                {currentMcq.syllabus_tag && (
                  <p className="mt-1 text-[11px] text-sky-700 font-semibold">
                    Syllabus Tag: {currentMcq.syllabus_tag}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar Controls with NotebookLM Dynamic Generator */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-3">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Previous
            </button>

            {/* Generate More MCQs Button */}
            <button
              disabled={loadingMoreAi}
              onClick={generateMoreWithAi}
              className="flex items-center gap-1.5 rounded-2xl border border-purple-300 bg-purple-50 px-4 py-2.5 text-xs font-extrabold text-purple-800 hover:bg-purple-100 transition shadow-xs"
            >
              {loadingMoreAi ? <LoaderCircle className="animate-spin text-purple-600" size={15} /> : <Bot size={15} className="text-purple-600" />}
              Generate 10 More MCQs via Gemini Flash AI
            </button>

            {answered ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 transition"
              >
                {currentIndex < currentMcqPool.length - 1 ? "Next Question ➔" : "View Quiz Report Card 🏆"}
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Select an option to reveal explanation</span>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ REPORT CARD VIEW */
        <div className="space-y-8 animate-fadeIn">
          {/* Main Score Hero Card */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-8 text-white text-center space-y-6 shadow-2xl">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/20">
              <Trophy size={40} />
            </div>

            <div>
              <span className={`inline-block rounded-full px-4 py-1 text-xs font-extrabold border ${gradeInfo.color}`}>
                Grade {gradeInfo.grade} — {gradeInfo.title}
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
                {percentage}% <span className="text-xl text-slate-400 font-normal">Score</span>
              </h2>
              <p className="mt-2 text-sm text-slate-300 font-medium">
                You answered <strong className="text-emerald-400">{correctCount}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions correctly in {formatTime(600 - timeLeft)}.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Accuracy</p>
                <p className="text-lg font-black text-emerald-400">{percentage}%</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Correct</p>
                <p className="text-lg font-black text-white">{correctCount} / {totalQuestions}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Time Taken</p>
                <p className="text-lg font-black text-amber-300">{formatTime(600 - timeLeft)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-extrabold text-white hover:bg-sky-400 shadow-md transition"
              >
                <RotateCcw size={16} /> Retry Quiz
              </button>
              <button
                onClick={generateMoreWithAi}
                disabled={loadingMoreAi}
                className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-extrabold text-white hover:bg-purple-500 shadow-md transition"
              >
                {loadingMoreAi ? <LoaderCircle className="animate-spin" size={16} /> : <Bot size={16} />}
                Generate 10 More Fresh MCQs with AI
              </button>
              <button
                onClick={() => setReviewMode(!reviewMode)}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-extrabold text-white hover:bg-white/20 transition"
              >
                <HelpCircle size={16} /> {reviewMode ? "Hide Review" : "Review All Solutions"}
              </button>
            </div>
          </div>

          {/* Weak-Topic Targeted Recommendations */}
          {weakTopics.length > 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 space-y-3">
              <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={18} /> Weak Topic Revision Recommendations
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Based on your quiz performance, we recommend revising these specific chapter subtopics:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {weakTopics.map((topic, idx) => (
                  <span key={idx} className="rounded-xl bg-white border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-xs">
                    ⚠️ {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Question-by-Question Solution Review Accordion */}
          {reviewMode && (
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-sky-600" size={20} /> Question-by-Question Solution Key
              </h3>

              <div className="space-y-3">
                {currentMcqPool.map((mcq, idx) => {
                  const userChoice = selectedOptions[idx];
                  const isCorrect = userChoice === mcq.correct_index;

                  return (
                    <div
                      key={mcq.id}
                      className={`rounded-2xl border p-4 space-y-2 transition ${
                        isCorrect ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">Question {idx + 1}</span>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Correct</span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle size={14} /> Incorrect</span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-slate-900">{mcq.question}</p>
                      
                      <div className="text-xs space-y-1 text-slate-700 pt-1">
                        <p>Your Answer: <strong className={isCorrect ? "text-emerald-700" : "text-rose-700"}>
                          {userChoice !== undefined ? mcq.options[userChoice] : "Not Answered"}
                        </strong></p>
                        {!isCorrect && (
                          <p>Correct Answer: <strong className="text-emerald-700">{mcq.options[mcq.correct_index]}</strong></p>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 mt-2 font-medium">
                        💡 {mcq.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
