"use client";

import { Sparkles, Zap } from "lucide-react";
import { WizardSteps } from "./components/WizardSteps";

export default function Home() {
  return (
    <main className="aurora grid-overlay min-h-screen px-4 pb-16 pt-6 sm:px-8 lg:px-12">
      {/* Clean Top Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between py-2 border-b border-slate-800/80 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-glow font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">EduAI</h1>
            <p className="text-xs font-semibold text-cyan-300">Step-by-Step Curriculum & Study Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
            ✓ Version 1.2
          </span>
        </div>
      </header>

      {/* Main Guided Wizard Experience */}
      <WizardSteps />
    </main>
  );
}
