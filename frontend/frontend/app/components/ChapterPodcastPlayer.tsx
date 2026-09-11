"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Play, Pause, RotateCcw, Volume2, FastForward, Sparkles, CheckCircle2, Headphones, Radio } from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";

export function ChapterPodcastPlayer({ pack }: { pack: StudyPack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Generate podcast script segments from StudyPack data
  const podcastSegments = [
    {
      title: "Episode Intro & Chapter Overview",
      speaker: "EduAI AI Host",
      duration: "1 min",
      text: `Welcome to the EduAI Chapter Podcast for ${pack.chapter_title} in ${pack.subject}, ${pack.board} ${pack.grade}. ${pack.short_notes.summary}`,
    },
    {
      title: "Core Concepts & Principles",
      speaker: "EduAI AI Tutor",
      duration: "2 min",
      text: `Let's break down the key concepts for ${pack.chapter_title}. First: ${pack.short_notes.key_concepts.join(". Next: ")}.`,
    },
    {
      title: "Formulas & Definitions Masterclass",
      speaker: "EduAI AI Tutor",
      duration: "2 min",
      text: `Now for the crucial formulas you must remember: ${pack.short_notes.formulas_and_definitions
        .map((f) => `${f.term}: ${f.definition}`)
        .join(". Also: ")}.`,
    },
    {
      title: "High-Priority Exam Strategy & Recap",
      speaker: "EduAI AI Host",
      duration: "1 min",
      text: `Here is your exam battle plan for ${pack.chapter_title}. Key recap points: ${pack.short_notes.recap_points.join(
        ". Always remember: "
      )}. Good luck with your study session!`,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSpeechSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function togglePlay() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakSegment(currentSegment);
      }
    }
  }

  function speakSegment(index: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setCurrentSegment(index);

    const textToSpeak = podcastSegments[index].text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (index < podcastSegments.length - 1) {
        speakSegment(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentSegment(0);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  function changeSpeed(rate: number) {
    setPlaybackRate(rate);
    if (isPlaying) {
      speakSegment(currentSegment);
    }
  }

  function restartPodcast() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    speakSegment(0);
  }

  return (
    <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-sky-50 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Podcast Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-[11px] font-extrabold text-purple-800 border border-purple-200">
              <Headphones size={12} /> EduAI Audio Podcast Mode
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">{pack.chapter_title} — Audio Episode</h3>
          </div>
        </div>

        {/* Speed Control Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Speed:</span>
          {[1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => changeSpeed(rate)}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                playbackRate === rate
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-purple-50"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Playback Bar */}
      <div className="flex flex-wrap items-center justify-between rounded-2xl bg-white p-5 border border-purple-100 shadow-md gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition transform active:scale-95"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <div>
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Now Playing Episode {currentSegment + 1} of 4</p>
            <p className="text-base font-extrabold text-slate-900">{podcastSegments[currentSegment].title}</p>
          </div>
        </div>

        <button
          onClick={restartPodcast}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw size={14} /> Restart Podcast
        </button>
      </div>

      {/* Episode Playlist Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Podcast Episode Segments</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {podcastSegments.map((seg, idx) => (
            <button
              key={idx}
              onClick={() => speakSegment(idx)}
              className={`rounded-2xl border p-4 text-left transition ${
                currentSegment === idx
                  ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20"
                  : "border-slate-200 bg-white hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-purple-700">Episode {idx + 1}</span>
                <span className="text-[11px] text-slate-400 font-semibold">{seg.duration}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{seg.title}</p>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{seg.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
