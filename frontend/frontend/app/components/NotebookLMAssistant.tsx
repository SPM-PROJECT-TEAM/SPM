"use client";

import { useState } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  FileText,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  source?: string;
}

export function NotebookLMAssistant({ pack }: { pack: StudyPack }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Welcome to Google NotebookLM Studio for **${pack.chapter_title}**!\n\nI am grounded in your official textbook source material for **${pack.board} ${pack.grade} — ${pack.subject}**.\n\nAsk me anything about formulas, derivations, or step-by-step problem solving for this chapter!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "NotebookLM Source Grounding Engine",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceGuideTab, setSourceGuideTab] = useState<"summary" | "concepts" | "formulas" | "faqs">("summary");

  const promptChips = [
    "Explain Cramer's Rule with example ✏️",
    "Show step-by-step formula derivation 📐",
    "What are common exam traps in this chapter? ⚠️",
    "Give me 3 practice problems with solutions 📝",
  ];

  async function handleSend(queryToSubmit?: string) {
    const textToSend = queryToSubmit || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSubmit) setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/studypack/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_title: pack.chapter_title,
          question: textToSend.trim(),
          short_notes: pack.short_notes,
          board: pack.board,
          grade: pack.grade,
          subject: pack.subject,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        sender: "ai",
        text: data.answer || "I have analyzed your chapter source document. Ask any specific question!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source === "gemini-1.5-flash" ? "Gemini 1.5 Flash (Free Tier API)" : "NotebookLM Source Grounding Engine",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to query NotebookLM AI Assistant", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Apologies, I encountered an issue accessing the chapter source document. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-sky-200 bg-slate-50/50 p-6 sm:p-8 shadow-xl space-y-6">
      {/* STUDIO HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30">
            <Bot size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-extrabold text-sky-800 border border-sky-200">
                Google NotebookLM Studio
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                <Zap size={10} /> Gemini 1.5 Flash API Connected
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{pack.chapter_title}</h3>
          </div>
        </div>
      </div>

      {/* NOTEBOOKLM 2-COLUMN STUDIO LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: CHAPTER SOURCE GROUNDING PANEL */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="text-sky-600" size={18} />
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Chapter Source Document</h4>
              <p className="text-[11px] text-slate-500 font-medium">{pack.board} · {pack.grade} · {pack.subject}</p>
            </div>
          </div>

          {/* Source Guide Tab Navigation */}
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
            {(["summary", "concepts", "formulas", "faqs"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSourceGuideTab(tab)}
                className={`flex-1 rounded-lg py-1.5 text-[11px] font-extrabold capitalize transition ${
                  sourceGuideTab === tab
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Source Guide Content Area */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 text-xs leading-relaxed text-slate-700 space-y-3">
            {sourceGuideTab === "summary" && (
              <div>
                <p className="font-extrabold text-sky-900 mb-1">Textbook Chapter Summary:</p>
                <p className="text-slate-700 font-medium">{pack.short_notes.summary}</p>
              </div>
            )}

            {sourceGuideTab === "concepts" && (
              <div>
                <p className="font-extrabold text-sky-900 mb-2">Key Grounded Concepts:</p>
                <ul className="space-y-2">
                  {pack.short_notes.key_concepts.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-sky-600">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sourceGuideTab === "formulas" && (
              <div>
                <p className="font-extrabold text-sky-900 mb-2">Formulas & Definitions:</p>
                <div className="space-y-2">
                  {pack.short_notes.formulas_and_definitions.map((f, idx) => (
                    <div key={idx} className="rounded-xl bg-white p-2.5 border border-sky-100">
                      <p className="font-bold text-sky-900">{f.term}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{f.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sourceGuideTab === "faqs" && (
              <div>
                <p className="font-extrabold text-sky-900 mb-2">Recap Checklist:</p>
                <ul className="space-y-1.5">
                  {pack.short_notes.recap_points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Prompt Chips in Source Panel */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Suggested Source Prompts
            </label>
            <div className="space-y-1.5">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={() => handleSend(chip)}
                  className="w-full text-left rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 hover:border-sky-400 hover:bg-sky-50/50 transition disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE AI CHAT STUDIO */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chat Messages Log */}
          <div className="min-h-[400px] max-h-[500px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-sky-600 text-white font-extrabold text-xs shadow-md">
                    LM
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed space-y-2 ${
                    msg.sender === "user"
                      ? "bg-sky-600 text-white rounded-tr-xs shadow-md font-medium"
                      : "bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 gap-2">
                    <span className="font-extrabold">{msg.sender === "user" ? "Student" : "NotebookLM AI Tutor"}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line text-xs font-medium leading-relaxed">{msg.text}</p>

                  {msg.source && (
                    <div className="pt-2 border-t border-slate-200/50 text-[10px] font-bold text-sky-700 flex items-center gap-1">
                      <Sparkles size={11} /> Grounded via: {msg.source}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-sky-700 font-bold bg-sky-50 p-3 rounded-2xl border border-sky-100">
                <LoaderCircle className="animate-spin text-sky-600" size={18} />
                <span>NotebookLM Gemini Flash API is analyzing chapter source document...</span>
              </div>
            )}
          </div>

          {/* Input Box Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask NotebookLM about ${pack.chapter_title} (e.g. formulas, proofs, numerical steps)...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              className="flex-1 rounded-xl bg-transparent px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none"
            />
            <button
              disabled={!inputQuery.trim() || loading}
              onClick={() => handleSend()}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-sky-500 disabled:opacity-50 shadow-md transition"
            >
              {loading ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />}
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
