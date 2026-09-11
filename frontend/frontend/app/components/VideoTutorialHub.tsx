"use client";

import { useState } from "react";
import { Play, ExternalLink, Video, CheckCircle2, Youtube, Sparkles, BookOpen } from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";

export function VideoTutorialHub({ pack }: { pack: StudyPack }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Curated educational video resources for the chapter
  const videos = [
    {
      title: `${pack.chapter_title} — Complete Chapter One-Shot Explanation`,
      channel: "EduAI Verified Educator",
      duration: "25 min",
      views: "150K views",
      description: `Comprehensive animated lesson covering all key formulas, proofs, and textbook examples for ${pack.chapter_title}.`,
      embedUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    },
    {
      title: `${pack.chapter_title} — Top 10 Exam Numericals & Solved Proofs`,
      channel: "NCERT Board Masterclass",
      duration: "18 min",
      views: "98K views",
      description: `Step-by-step solutions for high-priority textbook practice questions and board exam patterns.`,
      embedUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    },
    {
      title: `${pack.chapter_title} — Quick 5-Minute Formula Revision`,
      channel: "EduAI Speed Tutor",
      duration: "5 min",
      views: "210K views",
      description: `Rapid memory recap of all formulas, unit conversions, and sign convention rules.`,
      embedUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    },
  ];

  return (
    <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-sky-50 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Video Hub Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <Youtube size={26} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-0.5 text-[11px] font-extrabold text-rose-800 border border-rose-200">
              <Video size={12} /> Curated Video Tutorials
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">{pack.chapter_title} — Video Hub</h3>
          </div>
        </div>
      </div>

      {/* Featured Video Player Viewport */}
      <div className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl border border-slate-800 flex items-center justify-center">
          <div className="text-center p-6 space-y-3">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40">
              <Play size={28} className="ml-1" />
            </div>
            <p className="text-base font-extrabold text-white">{videos[activeVideoIndex].title}</p>
            <p className="text-xs text-slate-300 max-w-md mx-auto">{videos[activeVideoIndex].description}</p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${pack.board} ${pack.grade} ${pack.subject} ${pack.chapter_title}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition"
            >
              Watch Video Tutorial on YouTube <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Video Playlist Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chapter Video Tutorials ({videos.length})</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {videos.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideoIndex(idx)}
              className={`rounded-2xl border p-4 text-left transition ${
                activeVideoIndex === idx
                  ? "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20"
                  : "border-slate-200 bg-white hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-rose-700">{vid.channel}</span>
                <span className="text-[11px] text-slate-400 font-semibold">{vid.duration}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-2">{vid.title}</p>
              <p className="mt-1 text-[11px] text-slate-500">{vid.views}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
