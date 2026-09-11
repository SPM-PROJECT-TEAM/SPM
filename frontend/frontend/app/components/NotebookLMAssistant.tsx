"use client";

import { useState } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  Copy,
  FileText,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Send,
  Sparkles,
  Volume2,
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
      text: `Hello! I am your EduAI Tutor Agent for ${pack.chapter_title} (${pack.board} ${pack.grade} · ${pack.subject}).\n\nI am ready to assist you with deep concept breakdowns, step-by-step numerical derivations, or interactive practice quizzes. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "EduAI Tutor Agent",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceGuideTab, setSourceGuideTab] = useState<"summary" | "concepts" | "formulas" | "faqs">("summary");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Dynamically generate recommendations strictly related to the selected chapter
  const firstTerm = pack.short_notes.formulas_and_definitions[0]?.term || pack.chapter_title;
  const secondTerm = pack.short_notes.formulas_and_definitions[1]?.term || "Key Formula";
  const conceptTopic = pack.short_notes.key_concepts[0]?.split(":")[0] || pack.chapter_title;

  const promptChips = [
    `Explain ${firstTerm} with step-by-step example ✏️`,
    `Show formula derivation for ${secondTerm} 📐`,
    `What are common exam traps in ${pack.chapter_title}? ⚠️`,
    `Give me 3 practice problems on ${conceptTopic} 📝`,
  ];

  function speakText(text: string, index: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#>`_]/g, "").replace(/\$\$[\s\S]*?\$\$/g, "formula");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

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
        source: data.source?.includes("gemini")
          ? "Gemini AI Model"
          : data.source?.includes("llm") || data.source?.includes("pollinations")
          ? "EduAI High-Capacity Model"
          : "EduAI Tutor Agent",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to query EduAI Tutor Agent", err);
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
                EduAI Tutor Agent
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{pack.chapter_title}</h3>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSend("Hi")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:border-sky-300 transition"
          >
            👋 Say Hi
          </button>
          <button
            onClick={() => handleSend("Quiz me on this chapter")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-xs"
          >
            📝 Quiz Me
          </button>
          <button
            onClick={() => handleSend(`Explain ${firstTerm}`)}
            className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
          >
            📖 Concept
          </button>
        </div>
      </div>

      {/* TUTOR 2-COLUMN STUDY LAYOUT */}
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

          {/* Chapter-Specific Prompt Chips in Source Panel */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Recommended Chapter Prompts
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
          <div className="min-h-[420px] max-h-[520px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-sky-600 text-white font-extrabold text-xs shadow-md">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-3xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                    msg.sender === "user"
                      ? "bg-sky-600 text-white rounded-tr-xs shadow-md font-medium"
                      : "bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 gap-2 border-b border-slate-200/40 pb-1">
                    <span className="font-extrabold">{msg.sender === "user" ? "Student" : "EduAI Tutor Agent"}</span>
                    <div className="flex items-center gap-2">
                      {msg.sender === "ai" && (
                        <>
                          <button
                            onClick={() => speakText(msg.text, idx)}
                            className={`p-1 rounded hover:bg-slate-200 transition ${speakingIndex === idx ? "text-sky-600 font-bold animate-pulse" : ""}`}
                            title="Read Aloud"
                          >
                            <Volume2 size={13} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(msg.text)}
                            className="p-1 rounded hover:bg-slate-200 transition text-slate-500 hover:text-slate-800"
                            title="Copy Response"
                          >
                            <Copy size={13} />
                          </button>
                        </>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Clean Formatted Message Renderer (No raw asterisks or clutter) */}
                  <FormattedMessage text={msg.text} isUser={msg.sender === "user"} />

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
              <div className="flex items-center gap-3 text-xs text-sky-700 font-bold bg-sky-50 p-3 rounded-2xl border border-sky-100 animate-pulse">
                <LoaderCircle className="animate-spin text-sky-600" size={18} />
                <span>EduAI Tutor Agent is synthesizing a clear, professional answer...</span>
              </div>
            )}
          </div>

          {/* Input Box Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask EduAI Tutor Agent about ${pack.chapter_title}... (e.g. "hi", "quiz me", "explain formula")`}
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
              Ask Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Clean UI Formatted Message Component
 * Removes raw markdown asterisks, hashes, and symbols, rendering clean headings, bold text, and math boxes!
 */
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <p className="text-xs font-medium leading-relaxed">{text}</p>;
  }

  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-xs text-slate-800 leading-relaxed font-normal">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Header lines (### Header or Header:)
        if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#")) {
          const headerText = trimmed.replace(/^[#\s]+/, "").replace(/[*_]/g, "");
          return (
            <h4 key={i} className="text-xs font-extrabold text-sky-900 uppercase tracking-wider mt-3 mb-1 border-b border-sky-100 pb-0.5">
              {headerText}
            </h4>
          );
        }

        // Exam Tip / Callout
        if (trimmed.toLowerCase().includes("tip:") || trimmed.toLowerCase().includes("exam strategy:")) {
          const cleanTip = trimmed.replace(/[*_]/g, "");
          return (
            <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/90 p-2.5 text-[11px] font-semibold text-amber-950 my-2 shadow-xs">
              💡 {cleanTip}
            </div>
          );
        }

        // Bullet points (• or - or 1.)
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || /^\d+\./.test(trimmed)) {
          const content = trimmed.replace(/^[\textbullet\-\d\.]+\s*/, "");
          return (
            <div key={i} className="flex items-start gap-2 my-1 pl-1">
              <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
              <span>{parseInlineStyles(content)}</span>
            </div>
          );
        }

        // Blockquotes (> text)
        if (trimmed.startsWith(">")) {
          const content = trimmed.replace(/^>\s*/, "");
          return (
            <div key={i} className="rounded-xl bg-sky-50 border-l-4 border-sky-600 p-2.5 my-2 text-xs font-medium text-sky-950">
              {parseInlineStyles(content)}
            </div>
          );
        }

        return <p key={i}>{parseInlineStyles(trimmed)}</p>;
      })}
    </div>
  );
}

/**
 * Parse inline bold (**text**), code (`text`), and math ($formula$) cleanly without showing raw symbols
 */
function parseInlineStyles(str: string) {
  // Strip raw asterisks and hashes cleanly
  const parts = str.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <code key={index} className="rounded-md bg-sky-100 px-1.5 py-0.5 font-mono text-[11px] text-sky-900 border border-sky-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
