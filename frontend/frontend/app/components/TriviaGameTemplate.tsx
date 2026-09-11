"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Gamepad2, RotateCcw, Sparkles, Star, Trophy } from "lucide-react";
import type { MCQ } from "../api/studypack/generate/route";

interface Props {
  mcqs: MCQ[];
  chapterTitle: string;
}

export function TriviaGameTemplate({ mcqs, chapterTitle }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(15);

  const currentMcq = mcqs[qIndex] || mcqs[0];

  useEffect(() => {
    if (gameOver || selectedOption !== null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Time's up! Wrong
          handleSelectOption(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, gameOver, selectedOption]);

  function handleSelectOption(optIdx: number) {
    if (selectedOption !== null || gameOver) return;
    setSelectedOption(optIdx);

    if (optIdx === currentMcq.correct_index) {
      const bonus = streak >= 2 ? 200 : 100;
      setScore((prev) => prev + bonus);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (qIndex + 1 < mcqs.length) {
        setQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setTimer(15);
      } else {
        setGameOver(true);
      }
    }, 1200);
  }

  function restartGame() {
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setGameOver(false);
    setTimer(15);
  }

  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/60 via-white to-sky-50/60 p-6 shadow-xl space-y-6">
      {/* Game Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              EduAI Trivia Champ <Sparkles size={16} className="text-amber-500" />
            </h3>
            <p className="text-xs text-slate-600">{chapterTitle} · Reusable Gamified Challenge</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl bg-amber-100 px-3.5 py-1.5 text-amber-900 font-bold text-xs">
            <Flame size={16} className="text-orange-500" /> Streak: {streak}x
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-sky-100 px-3.5 py-1.5 text-sky-900 font-bold text-xs">
            <Trophy size={16} className="text-sky-600" /> Score: {score}
          </div>
        </div>
      </div>

      {gameOver ? (
        <div className="rounded-3xl border border-amber-300 bg-white p-8 text-center space-y-4 shadow-lg">
          <Trophy className="mx-auto text-amber-500 animate-bounce" size={48} />
          <h4 className="text-2xl font-extrabold text-slate-900">Game Over! Victory!</h4>
          <p className="text-sm text-slate-600">
            You scored <strong className="text-amber-600 text-base">{score} points</strong> with a max streak of {streak}!
          </p>

          <button
            onClick={restartGame}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-bold text-white hover:bg-amber-400 shadow-md transition"
          >
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Timer Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>Question {qIndex + 1} of {mcqs.length}</span>
              <span className={timer <= 5 ? "text-rose-600 animate-pulse font-extrabold" : "text-amber-600"}>
                ⏳ {timer}s
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timer <= 5 ? "bg-rose-500" : "bg-amber-400"
                }`}
                style={{ width: `${(timer / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-base font-bold text-slate-900">{currentMcq.question}</h4>
          </div>

          {/* Options Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {currentMcq.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = optIdx === currentMcq.correct_index;

              let style = "border-slate-200 bg-white text-slate-800 hover:border-amber-400 hover:bg-amber-50/50";

              if (selectedOption !== null) {
                if (isCorrectOpt) style = "border-emerald-500 bg-emerald-500 text-white font-bold";
                else if (isSelected && !isCorrectOpt) style = "border-rose-500 bg-rose-500 text-white font-bold";
                else style = "border-slate-200 bg-slate-100 text-slate-400 opacity-50";
              }

              return (
                <button
                  key={optIdx}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`rounded-2xl border p-4 text-left text-xs font-semibold shadow-sm transition ${style}`}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
