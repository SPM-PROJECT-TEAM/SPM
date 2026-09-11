"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, ChevronDown, CircleCheck, Database, GraduationCap, Layers3, LoaderCircle, Search, Sparkles, Wifi } from "lucide-react";

type CurriculumItem = {
  diksha_identifier: string;
  title: string;
  board: string | null;
  grade_levels: string[];
  subjects: string[];
  topics: string[];
  content_type: string | null;
  medium: string | null;
};

type Snapshot = { source_count: number; fetched_at: string; items: CurriculumItem[] };

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const subjects = ["Mathematics", "Science", "English", "Social Science", "Physics", "Chemistry", "Biology", "Accountancy"];

export default function Home() {
  const [board, setBoard] = useState("CBSE");
  const [grade, setGrade] = useState("Class 10");
  const [subject, setSubject] = useState("Mathematics");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready to discover curriculum data from DIKSHA.");

  const visibleItems = useMemo(() => snapshot?.items.slice(0, 6) ?? [], [snapshot]);

  async function discover() {
    setLoading(true);
    setMessage("Connecting to the syllabus pipeline…");
    try {
      const query = new URLSearchParams({ board, grade, subject, limit: "24" });
      const endpoint = apiBase ? `${apiBase}/v1/curriculum/search` : "/api/curriculum/search";
      const response = await fetch(`${endpoint}?${query}`);
      if (!response.ok) throw new Error("The curriculum source is temporarily unavailable.");
      const data: Snapshot = await response.json();
      setSnapshot(data);
      setMessage(`Synced ${data.items.length} records from ${data.source_count.toLocaleString()} matching DIKSHA resources.`);
    } catch {
      setMessage("The curriculum source is temporarily unavailable. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aurora grid-overlay min-h-screen overflow-hidden px-5 pb-12 pt-5 sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-slate-950 shadow-glow"><Sparkles size={20} /></div>
          <div><p className="text-lg font-semibold tracking-tight text-white">EduAI</p><p className="text-xs text-slate-400">Teacher portal · v1.1</p></div>
        </div>
        <div className="hidden items-center gap-5 text-sm text-slate-400 md:flex"><span className="text-cyan-200">Syllabus</span><span>Content Studio</span><span>Workspace</span></div>
        <button className="rounded-xl border border-slate-700/80 px-3 py-2 text-sm text-slate-200">Team space</button>
      </header>

      <section className="mx-auto grid max-w-7xl gap-7 pt-12 lg:grid-cols-[1.2fr_.8fr] lg:pt-20">
        <div className="py-5">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100"><Wifi size={13} /> DIKSHA curriculum pipeline online</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">A syllabus that is finally <span className="text-cyan-300">ready to teach.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">Discover structured official curriculum data for CBSE and Maharashtra Board, then make it the foundation for every lesson, activity, and AI learning experience.</p>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-300"><span className="flex items-center gap-2"><CircleCheck size={16} className="text-emerald-400" /> Official source metadata</span><span className="flex items-center gap-2"><CircleCheck size={16} className="text-emerald-400" /> Cache-ready structure</span></div>
        </div>

        <section className="glass rounded-3xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Curriculum explorer</h2><p className="mt-1 text-sm text-slate-400">Choose a learning context to sync.</p></div><Database className="text-cyan-300" size={21} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Board" value={board} onChange={setBoard} options={["CBSE", "Maharashtra"]} />
            <Select label="Grade" value={grade} onChange={setGrade} options={Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)} />
            <div className="sm:col-span-2"><Select label="Subject" value={subject} onChange={setSubject} options={subjects} /></div>
          </div>
          <button onClick={discover} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <LoaderCircle className="animate-spin" size={18} /> : <Search size={18} />} {loading ? "Syncing syllabus" : "Discover syllabus"}
          </button>
          <p className="mt-4 min-h-10 text-xs leading-5 text-slate-400">{message}</p>
        </section>
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric icon={<GraduationCap size={19} />} label="Boards in scope" value="2" detail="CBSE + Maharashtra" tone="text-violet-300" />
          <Metric icon={<Layers3 size={19} />} label="Learning stages" value="1–12" detail="School curriculum coverage" tone="text-cyan-300" />
          <Metric icon={<BookOpen size={19} />} label="Data source" value="DIKSHA" detail="Official content metadata" tone="text-emerald-300" />
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-[1fr_.38fr]">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Latest syllabus resources</h2><p className="mt-1 text-sm text-slate-400">{snapshot ? `Results for ${board} · ${grade} · ${subject}` : "Run a discovery to populate the curriculum."}</p></div><button className="flex items-center gap-1 text-sm text-cyan-300">View all <ArrowUpRight size={15} /></button></div>
          <div className="space-y-2">
            {visibleItems.length > 0 ? visibleItems.map((item) => <Resource key={item.diksha_identifier} item={item} />) : <EmptyState />}
          </div>
        </div>
        <aside className="glass rounded-3xl p-5 sm:p-6"><h2 className="font-semibold text-white">Pipeline status</h2><p className="mt-1 text-sm text-slate-400">Version 1.1 foundation</p><div className="mt-7 space-y-5"><Step complete label="Repository and service structure" /><Step complete label="DIKSHA content search client" /><Step complete label="Supabase curriculum schema" /><Step complete={false} label="Credentialed framework taxonomy" /></div><div className="mt-7 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.06] p-4 text-sm leading-6 text-cyan-50">Next, this data becomes the reliable input for AI notes, quizzes, flashcards, and learning activities.</div></aside>
      </section>
    </main>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="relative block text-xs font-medium text-slate-400">{label}<select className="select-field mt-1.5 text-sm font-normal" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 text-slate-500" size={15} /></label>;
}

function Metric({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: string }) {
  return <div className="glass rounded-2xl p-5"><div className={`mb-5 ${tone}`}>{icon}</div><p className="text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-sm text-slate-300">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function Resource({ item }: { item: CurriculumItem }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><BookOpen size={18} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-100">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{[...item.subjects, ...item.topics].filter(Boolean).join(" · ") || item.content_type || "Curriculum resource"}</p></div><span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400">{item.content_type ?? "Resource"}</span></div>;
}

function EmptyState() { return <div className="rounded-2xl border border-dashed border-slate-700/70 px-5 py-12 text-center"><Database className="mx-auto text-slate-600" size={22} /><p className="mt-3 text-sm text-slate-400">Your discovered syllabus resources will appear here.</p></div>; }
function Step({ complete, label }: { complete: boolean; label: string }) { return <div className="flex items-center gap-3 text-sm"><span className={`grid h-5 w-5 place-items-center rounded-full border ${complete ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-slate-600 text-slate-600"}`}>{complete ? <CircleCheck size={13} /> : "4"}</span><span className={complete ? "text-slate-200" : "text-slate-500"}>{label}</span></div>; }
