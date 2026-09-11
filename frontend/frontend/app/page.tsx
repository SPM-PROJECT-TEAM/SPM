"use client";

import { Sparkles } from "lucide-react";
import { WizardSteps } from "./components/WizardSteps";

export default function Home() {
  return (
    <main className="aurora grid-overlay min-h-screen px-4 pb-16 pt-6 sm:px-8 lg:px-12">
      {/* Aesthetic Light Mode Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between py-2 border-b border-slate-200/80 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-600 text-white font-extrabold shadow-md shadow-sky-600/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">EduAI</h1>
            <p className="text-xs font-semibold text-sky-700">Practice Loop & NotebookLM AI Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            ✓ Version 1.3
          </span>
        </div>
      </header>

      {/* Main Guided Wizard Experience */}
      <WizardSteps />
    </main>
  );
}
