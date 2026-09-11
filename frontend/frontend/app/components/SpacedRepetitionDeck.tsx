"use client";

import { useEffect, useState } from "react";
import { Award, Calendar, CheckCircle2, Layers, RotateCcw, Sparkles } from "lucide-react";
import type { Flashcard } from "../api/studypack/generate/route";

interface Props {
  flashcards: Flashcard[];
  chapterTitle: string;
  cacheKey: string;
}

type CardStatus = "review_today" | "review_3_days" | "mastered_7_days";

export function SpacedRepetitionDeck({ flashcards, chapterTitle, cacheKey }: Props) {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scheduleMap, setScheduleMap] = useState<Record<string, CardStatus>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`eduai_spaced_${cacheKey}`);
      if (saved) {
        setScheduleMap(JSON.parse(saved));
      }
    } catch (e) {
      console.warn(e);
    }
  }, [cacheKey]);

  function setStatus(cardId: string, status: CardStatus) {
    const updated = { ...scheduleMap, [cardId]: status };
    setScheduleMap(updated);
    try {
      localStorage.setItem(`eduai_spaced_${cacheKey}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  }

  const currentCard = flashcards[cardIndex] || flashcards[0];
  const currentStatus = scheduleMap[currentCard.id] || "review_today";

  // Calculate status counts
  const masteredCount = Object.values(scheduleMap).filter((s) => s === "mastered_7_days").length;
  const review3Count = Object.values(scheduleMap).filter((s) => s === "review_3_days").length;
  const reviewTodayCount = flashcards.length - masteredCount - review3Count;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Spaced-Repetition Deck <Layers className="text-amber-500" size={18} />
          </h3>
          <p className="text-xs text-slate-500">{chapterTitle} · Local Spaced Schedule</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 border border-rose-200">
            {reviewTodayCount} Review Today
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 border border-amber-200">
            {review3Count} 3 Days
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200">
            {masteredCount} Mastered
          </span>
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective-1000 group relative min-h-[280px] cursor-pointer rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-300 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-xl bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            {currentCard.concept}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Card {cardIndex + 1} of {flashcards.length}
          </span>
        </div>

        <div className="my-6">
          <h4 className="text-xl font-bold text-slate-900 leading-snug">
            {isFlipped ? currentCard.answer : currentCard.question}
          </h4>
          {isFlipped && (
            <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
              <strong className="text-slate-800">Explanation: </strong>
              {currentCard.explanation}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span>{isFlipped ? "Answer View" : "Question View"}</span>
          <span className="font-semibold text-amber-600 animate-pulse">Tap to flip 🔄</span>
        </div>
      </div>

      {/* Spaced Scheduling Controls */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <p className="text-xs font-bold text-slate-700 text-center">Schedule Next Review for this Card:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setStatus(currentCard.id, "review_today")}
            className={`rounded-2xl py-2.5 text-xs font-bold transition ${
              currentStatus === "review_today"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-rose-50"
            }`}
          >
            Review Today 🔴
          </button>

          <button
            onClick={() => setStatus(currentCard.id, "review_3_days")}
            className={`rounded-2xl py-2.5 text-xs font-bold transition ${
              currentStatus === "review_3_days"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-amber-50"
            }`}
          >
            In 3 Days 🟡
          </button>

          <button
            onClick={() => setStatus(currentCard.id, "mastered_7_days")}
            className={`rounded-2xl py-2.5 text-xs font-bold transition ${
              currentStatus === "mastered_7_days"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50"
            }`}
          >
            Mastered (7 Days) 🟢
          </button>
        </div>
      </div>

      {/* Card Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={cardIndex === 0}
          onClick={() => {
            setIsFlipped(false);
            setCardIndex((prev) => Math.max(0, prev - 1));
          }}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40"
        >
          ← Previous
        </button>

        <button
          disabled={cardIndex === flashcards.length - 1}
          onClick={() => {
            setIsFlipped(false);
            setCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
          }}
          className="rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-400 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
