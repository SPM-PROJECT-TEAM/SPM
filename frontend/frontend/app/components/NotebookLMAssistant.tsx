"use client";

import { useState } from "react";
import { Bot, HelpCircle, Lightbulb, LoaderCircle, Send, Sparkles, User, Zap } from "lucide-react";
import type { StudyPack } from "../api/studypack/generate/route";

interface Props {
  pack: StudyPack;
}

type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
};

export function NotebookLMAssistant({ pack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hi! I am your NotebookLM AI Tutor for **${pack.chapter_title}** (${pack.board} ${pack.grade} - ${pack.subject}). Ask me anything about this chapter, or pick a quick question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Explain this like I'm 10 🎈",
    "Show step-by-step example ✏️",
    "What are top exam traps? ⚠️",
    "Give me 2 key formulas 💡",
  ];

  async function handleSend(questionText?: string) {
    const q = questionText || input.trim();
    if (!q || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/studypack/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_title: pack.chapter_title,
          board: pack.board,
          grade: pack.grade,
          subject: pack.subject,
          short_notes: pack.short_notes,
          question: q,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        sender: "ai",
        text: data.answer || "I am ready to help explain any part of this chapter!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am having trouble connecting right now, but you can review the Short Notes or try asking again in a moment!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-100 text-sky-600 font-bold">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              NotebookLM AI Chapter Assistant <Sparkles size={16} className="text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500">Ask any question or get instant explanations for {pack.chapter_title}</p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200">
          AI Tutor Active
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSend(prompt)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600 font-bold">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white font-medium shadow-md shadow-sky-600/10"
                  : "border border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              <div className="whitespace-pre-line text-sm">{msg.text}</div>
              <div
                className={`mt-2 text-[10px] ${
                  msg.sender === "user" ? "text-sky-200 text-right" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-700 font-bold">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600 font-bold animate-pulse">
              <Bot size={16} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500 flex items-center gap-2">
              <LoaderCircle className="animate-spin text-sky-600" size={16} /> AI Tutor is thinking step-by-step...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex gap-2 border-t border-slate-100 pt-3">
        <input
          type="text"
          placeholder={`Ask any question about ${pack.chapter_title}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition"
        />
        <button
          disabled={!input.trim() || loading}
          onClick={() => handleSend()}
          className="flex items-center gap-1.5 rounded-2xl bg-sky-600 px-5 py-3 text-xs font-bold text-white hover:bg-sky-500 transition disabled:opacity-50"
        >
          <Send size={15} /> Ask
        </button>
      </div>
    </div>
  );
}
