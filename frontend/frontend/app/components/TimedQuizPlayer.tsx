"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import type { MCQ } from "../api/studypack/generate/route";

interface Props {
  mcqs: MCQ[];
  chapterTitle: string;
}

export function TimedQuizPlayer({ mcqs, chapterTitle }: Props) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins (600s)
  const [timerActive, setTimerActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [retryOnlyWeak, setRetryOnlyWeak] = useState(false);

  // Active dataset (all MCQs or weak MCQs only)
  const activeMcqs = retryOnlyWeak
    ? mcqs.filter((m) => userAnswers[m.id] !== undefined && userAnswers[m.id] !== m.correct_index)
    : mcqs;

  const currentMcq = activeMcqs[currentIndex] || activeMcqs[0];

  useEffect(() => {
    if (!timerActive || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsSubmitted(true);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, isSubmitted, timeLeft]);

  function handleSelectOption(optIdx: number) {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentMcq.id]: optIdx }));
  }

  function handleSubmitQuiz() {
    setIsSubmitted(true);
    setTimerActive(false);
  }

  function resetQuiz(weakOnly = false) {
    if (!weakOnly) setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeft(600);
    setTimerActive(true);
    setCurrentIndex(0);
    setRetryOnlyWeak(weakOnly);
  }

  // Calculate results
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = mcqs.reduce((acc, m) => (userAnswers[m.id] === m.correct_index ? acc + 1 : acc), 0);
  const weakTopics = mcqs.filter((m) => userAnswers[m.id] !== undefined && userAnswers[m.id] !== m.correct_index);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 font-bold">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Timed Quiz Player {retryOnlyWeak && "(Weak Topics Retry)"}
            </h3>
            <p className="text-xs text-slate-500">{chapterTitle} · 10 Multiple Choice Questions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3.5 py-1.5 border border-amber-200 text-amber-700 font-mono text-sm font-bold">
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => resetQuiz(false)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <RotateCcw size={14} /> Restart Quiz
            </button>
          )}
        </div>
      </div>

      {/* Results Banner (when submitted) */}
      {isSubmitted && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Trophy className="text-amber-500" size={36} />
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">Quiz Complete!</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  You scored <strong>{correctCount} out of {mcqs.length}</strong> (
                  {Math.round((correctCount / mcqs.length) * 100)}%)
                </p>
              </div>
            </div>

            {weakTopics.length > 0 && (
              <button
                onClick={() => resetQuiz(true)}
                className="flex items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-400 transition"
              >
                <Sparkles size={14} /> Retry {weakTopics.length} Weak Questions
              </button>
            )}
          </div>

          {/* Weak Topics Summary */}
          {weakTopics.length > 0 && (
            <div className="mt-4 border-t border-emerald-100 pt-3">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500" /> Focus Areas for Review ({weakTopics.length} questions):
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weakTopics.map((m, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800"
                  >
                    {m.syllabus_tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Question {currentIndex + 1} of {activeMcqs.length}</span>
          <span>{answeredCount} Answered</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeMcqs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question Card */}
      {currentMcq && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {currentMcq.difficulty} · {currentMcq.syllabus_tag}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 leading-snug">{currentMcq.question}</h4>

          {/* Options */}
          <div className="grid gap-3 sm:grid-cols-2">
            {currentMcq.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentMcq.id] === optIdx;
              const isCorrectOpt = optIdx === currentMcq.correct_index;

              let style = "border-slate-200 bg-slate-50 text-slate-800 hover:border-sky-300 hover:bg-sky-50";

              if (isSelected) {
                style = "border-sky-600 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-600/20";
              }

              if (isSubmitted) {
                if (isCorrectOpt) {
                  style = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                } else if (isSelected && !isCorrectOpt) {
                  style = "border-rose-400 bg-rose-50 text-rose-900";
                } else {
                  style = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left text-xs transition ${style}`}
                >
                  <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                  <span className="flex-1">{opt}</span>
                  {isSubmitted && isCorrectOpt && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrectOpt && <XCircle size={16} className="text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Solution Explanation when submitted or selected */}
          {isSubmitted && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs leading-relaxed text-slate-800">
              <p className="font-bold text-sky-800 flex items-center gap-1">
                <Sparkles size={14} /> Explanation:
              </p>
              <p className="mt-1">{currentMcq.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Question Navigation */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
        >
          ← Previous
        </button>

        <div className="flex gap-1.5 overflow-x-auto max-w-[200px]">
          {activeMcqs.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-6 w-6 rounded-lg text-[10px] font-bold transition ${
                currentIndex === idx
                  ? "bg-slate-900 text-white"
                  : userAnswers[m.id] !== undefined
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentIndex === activeMcqs.length - 1}
          onClick={() => setCurrentIndex((prev) => Math.min(activeMcqs.length - 1, prev + 1))}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
