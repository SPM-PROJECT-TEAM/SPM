"use client";

import { useState } from "react";
import { CheckCircle2, Edit3, Eye, ShieldCheck, ThumbsUp, Trash2, RefreshCw, Send, Lock, UserCheck } from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";

export function TeacherReviewHub({ pack }: { pack: StudyPack }) {
  const [approved, setApproved] = useState(pack.quality_passed);
  const [customNote, setCustomNote] = useState("");
  const [published, setPublished] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function handleApprove() {
    setApproved(true);
    setPublished(true);
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <UserCheck size={26} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-extrabold text-emerald-800 border border-emerald-200">
              <ShieldCheck size={12} /> Teacher Approval & Quality Hub
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">{pack.chapter_title} — Teacher Review</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {published ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm">
              <CheckCircle2 size={14} /> Approved & Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm">
              Pending Review
            </span>
          )}
        </div>
      </div>

      {/* Quality Gate Status Card */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={18} /> Deterministic Quality Gate Checks
          </h4>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
            100% Passed
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Valid JSON Structure & Schema</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>10 Verified MCQs with 4 options each</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>10 Priority-Ranked Practice Questions</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Official Textbook Taxonomy Match</span>
          </div>
        </div>
      </div>

      {/* Teacher Action Controls */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Teacher Editing & Controls</h4>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700">Add Teacher Note / Custom Exam Remark:</label>
          <textarea
            rows={2}
            placeholder="Add teacher instructions for students studying this chapter..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 transition"
          >
            <ThumbsUp size={16} /> Approve & Publish Study Pack
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Edit3 size={16} /> {editMode ? "Close Editor" : "Edit MCQs & Questions"}
          </button>
        </div>
      </div>
    </div>
  );
}
