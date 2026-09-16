import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import {
  Brain, ChevronRight, Check, ArrowRight, Menu, Bell, Search,
  Mic, Target, TrendingUp, Award, Sparkles, BookOpen, Code2,
  FileText, Linkedin, FolderOpen, Map, ClipboardList, Settings,
  User, Home, ChevronDown, ChevronLeft, Zap, Shield, Trophy,
  Flame, RefreshCw, Download, Share2, Eye, CheckCircle2, Plus,
  Briefcase, GraduationCap, Lightbulb, BarChart2, Hash,
  XCircle, Star, Globe, Lock, Layers, AlertTriangle, Info,
  Cloud, Database, Cpu, BookMarked, Boxes, Workflow,
  Play, BarChart3, Clock, Calendar, ChevronUp, Crosshair,
  GitBranch, Package, Terminal, TrendingDown,
  Filter, Camera, Mail, Trash2, Pencil, Link, Palette, Moon,
  BellOff, SlidersHorizontal, MessageSquare, ExternalLink,
  UserCheck, Bookmark, CheckSquare, Loader2, Lock,
} from "lucide-react";

const Rocket = Zap;
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area,
  PieChart as RePieChart, Pie,
} from "recharts";
import { subjectsApi, domainsApi, aiPrepApi, resumeApi } from "../lib/api";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0B1120", card: "#111827", surface: "#1F2937",
  border: "#374151", muted: "#9CA3AF", text: "#F9FAFB",
  purple: "#A855F7", cyan: "#22D3EE", green: "#34D399",
  amber: "#F59E0B", pink: "#F472B6", red: "#EF4444",
  indigo: "#818CF8", blue: "#60A5FA", teal: "#2DD4BF",
  grad: "linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)",
  gradSubtle: "linear-gradient(135deg,rgba(168,85,247,.15) 0%,rgba(34,211,238,.1) 100%)",
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const Grad = ({ children }: { children: React.ReactNode }) => (
  <span style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>
);
const Card = ({ children, className = "", style = {}, onClick }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) => (
  <div className={className} onClick={onClick}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, ...style }}>{children}</div>
);
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      {label && <div className="font-semibold text-white mb-1">{label}</div>}
      {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color || C.cyan }}>{p.name}: {p.value}</div>)}
    </div>
  );
};
const Pill = ({ label, color }: { label: string; color: string }) => (
  <span className="px-2.5 py-1 rounded-lg text-xs font-medium"
    style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>{label}</span>
);
const SecHead = ({ icon, title, sub, action }: { icon: React.ReactNode; title: string; sub?: string; action?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-5">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.12)", color: C.purple }}>{icon}</div>
      <div><div className="text-sm font-bold text-white">{title}</div>{sub && <div className="text-xs mt-0.5" style={{ color: C.muted }}>{sub}</div>}</div>
    </div>
    {action}
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "resume", label: "Resume Analyzer", icon: FileText },
  { id: "linkedin", label: "LinkedIn Analyzer", icon: Linkedin },
  { id: "projects", label: "Project Analyzer", icon: FolderOpen },
  { id: "subject", label: "Subject Prep", icon: BookOpen },
  { id: "domain", label: "Domain Prep", icon: GraduationCap },
  { id: "mock", label: "Mock Interview", icon: Mic },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "reports", label: "Reports", icon: ClipboardList },
];
const NAV2 = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ col, active, onNav, onToggle }: { col: boolean; active: string; onNav: (id: string) => void; onToggle: () => void }) {
  const { user } = useAuth();
  return (
    <aside className="flex flex-col h-full transition-all duration-300 flex-shrink-0"
      style={{ width: col ? 64 : 240, background: C.card, borderRight: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        {/* CrackIt Logo Mark */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.grad, boxShadow: "0 2px 12px rgba(168,85,247,.5)" }}>
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <path d="M11 2L5 10h5l-2 6 8-9h-5.5L11 2z" fill="white" strokeLinejoin="round" />
          </svg>
        </div>
        {!col && (
          <span className="font-black text-sm whitespace-nowrap"
            style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            CrackIt
          </span>
        )}
        <button onClick={onToggle} className="ml-auto flex-shrink-0" style={{ color: C.muted }}>
          {col ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {NAV.map((item) => {
          const Icon = item.icon; const isA = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{ background: isA ? C.gradSubtle : "transparent", border: isA ? "1px solid rgba(168,85,247,.3)" : "1px solid transparent" }}>
              <Icon size={16} style={{ color: isA ? C.purple : C.muted, flexShrink: 0 }} />
              {!col && <span className="text-sm font-medium truncate" style={{ color: isA ? C.text : C.muted }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="py-4 space-y-0.5 px-2" style={{ borderTop: `1px solid ${C.border}` }}>
        {NAV2.map((item) => {
          const Icon = item.icon; const isA = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{ background: isA ? C.gradSubtle : "transparent" }}>
              <Icon size={16} style={{ color: isA ? C.purple : C.muted, flexShrink: 0 }} />
              {!col && <span className="text-sm font-medium" style={{ color: isA ? C.text : C.muted }}>{item.label}</span>}
            </button>
          );
        })}
        {!col && user && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl" style={{ background: C.surface }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: C.grad }}>
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user.full_name}</div>
              <div className="text-xs truncate" style={{ color: C.muted }}>{user.target_job_role || "Student"}</div>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: C.green }} />
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ onToggle }: { onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center gap-4 px-6 py-3.5 flex-shrink-0"
      style={{ background: "rgba(17,24,39,.9)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, zIndex: 20 }}>
      <button className="lg:hidden" onClick={onToggle} style={{ color: C.muted }}><Menu size={20} /></button>
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
        <input placeholder="Search subjects, topics, questions…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded" style={{ background: C.border, color: C.muted }}>⌘K</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.3)" }}>
          <Flame size={14} style={{ color: C.amber }} />
          <span className="text-xs font-bold" style={{ color: C.amber }}>{user?.streak_count || 0} day streak</span>
        </div>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <Bell size={16} style={{ color: C.muted }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.red }} />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl p-2 z-50"
              style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
              <div className="px-3 py-2 text-sm font-semibold text-white flex justify-between">
                Notifications <button className="text-xs" style={{ color: C.purple }}>Clear</button>
              </div>
              {[{ t: "DSA: Trees module unlocked", s: "5m ago" }, { t: "Weekly goal 80% complete", s: "2h ago" }].map((n, i) => (
                <div key={i} className="px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="text-sm text-white">{n.t}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{n.s}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <div onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.grad }}>
              {user?.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-white">{user?.full_name?.split(" ")[0] || "User"}</span>
            <ChevronDown size={14} style={{ color: C.muted }} />
          </div>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 rounded-xl p-2 z-50" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 10px 40px rgba(0,0,0,.5)" }}>
              <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                <Lock size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1: SUBJECT-WISE PREPARATION
// ═══════════════════════════════════════════════════════════════════════════════

const SUBJECTS = [
  {
    id: "dsa", name: "Data Structures & Algorithms", icon: "⚡", color: C.purple,
    progress: 68, difficulty: "Hard", total: 120, done: 82, streak: 7,
    tags: ["Arrays", "Trees", "Graphs", "DP"],
  },
  {
    id: "dbms", name: "DBMS", icon: "🗄️", color: C.cyan,
    progress: 55, difficulty: "Medium", total: 80, done: 44, streak: 3,
    tags: ["Normalization", "Transactions", "Indexing"],
  },
  {
    id: "os", name: "Operating Systems", icon: "🖥️", color: C.green,
    progress: 72, difficulty: "Hard", total: 95, done: 68, streak: 5,
    tags: ["Processes", "Memory", "Scheduling"],
  },
  {
    id: "cn", name: "Computer Networks", icon: "🌐", color: C.amber,
    progress: 41, difficulty: "Medium", total: 75, done: 31, streak: 0,
    tags: ["OSI Model", "TCP/IP", "DNS"],
  },
  {
    id: "oop", name: "Object-Oriented Programming", icon: "🔷", color: C.indigo,
    progress: 88, difficulty: "Easy", total: 60, done: 53, streak: 12,
    tags: ["Polymorphism", "Inheritance", "SOLID"],
  },
  {
    id: "sql", name: "SQL", icon: "📊", color: C.teal,
    progress: 61, difficulty: "Medium", total: 70, done: 43, streak: 2,
    tags: ["Joins", "Aggregations", "Indexes"],
  },
  {
    id: "apt", name: "Aptitude", icon: "🧮", color: C.pink,
    progress: 45, difficulty: "Easy", total: 100, done: 45, streak: 1,
    tags: ["Quant", "Logical", "Verbal"],
  },
  {
    id: "hr", name: "HR Interview", icon: "🤝", color: C.amber,
    progress: 79, difficulty: "Easy", total: 50, done: 39, streak: 8,
    tags: ["STAR Method", "Behavioral", "Situational"],
  },
];

const diffColor = (d: string) => d === "Hard" ? C.red : d === "Medium" ? C.amber : C.green;

function SubjectCard({ s, onSelect, selected }: { s: typeof SUBJECTS[0]; onSelect: () => void; selected: boolean }) {
  return (
    <div
      onClick={onSelect}
      className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-4"
      style={{
        background: selected
          ? `linear-gradient(135deg,${s.color}18,${s.color}08)`
          : C.card,
        border: selected ? `1px solid ${s.color}50` : `1px solid ${C.border}`,
        boxShadow: selected ? `0 0 32px ${s.color}18` : "0 4px 20px rgba(0,0,0,.25)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
          style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
          {s.icon}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${diffColor(s.difficulty)}15`, color: diffColor(s.difficulty) }}>
            {s.difficulty}
          </span>
          {s.streak > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: C.amber }}>
              <Flame size={11} /> {s.streak}d
            </div>
          )}
        </div>
      </div>

      {/* Name + tags */}
      <div>
        <div className="text-sm font-bold text-white mb-2">{s.name}</div>
        <div className="flex flex-wrap gap-1">
          {s.tags.slice(0, 3).map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-md"
              style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: C.muted }}>{s.done}/{s.total} topics</span>
          <span className="font-bold" style={{ color: s.color }}>{s.progress}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${s.progress}%`, background: s.color, boxShadow: `0 0 8px ${s.color}50` }} />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={e => { e.stopPropagation(); onSelect(); }}
        className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{ background: selected ? s.color : C.surface, border: `1px solid ${selected ? s.color : C.border}`, color: selected ? "#fff" : C.muted }}>
        <Play size={11} fill={selected ? "#fff" : "none"} />
        {s.progress > 0 ? "Continue Learning" : "Start Learning"}
      </button>
    </div>
  );
}

function SubjectDetailPanel({ s }: { s: typeof SUBJECTS[0] }) {
  const [topics, setTopics] = useState([
    { name: "Arrays & Strings", done: true, q: 24, current: false },
    { name: "Linked Lists", done: true, q: 18, current: false },
    { name: "Binary Trees", done: true, q: 21, current: false },
    { name: "Binary Search Trees", done: false, q: 15, current: true },
    { name: "Heaps & Priority Queues", done: false, q: 12, current: false },
    { name: "Graphs (BFS/DFS)", done: false, q: 20, current: false },
    { name: "Dynamic Programming", done: false, q: 28, current: false },
  ]);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!s || !s.id || isNaN(Number(s.id))) return;
    subjectsApi.getDetail(s.id).then(res => {
      if (res && res.topics && res.topics.length > 0) {
        setTopics(res.topics);
      }
    }).catch(err => console.error(err));

    subjectsApi.getQuestions(s.id).then(res => {
      if (res && res.length > 0) {
        setQuestions(res);
      }
    }).catch(err => console.error(err));
  }, [s]);

  const mockScores = [
    { test: "Mock 1", score: 62 }, { test: "Mock 2", score: 71 },
    { test: "Mock 3", score: 68 }, { test: "Mock 4", score: 79 }, { test: "Mock 5", score: 84 },
  ];
  const weakAreas = [
    { area: "Graph Algorithms", score: 42, color: C.red },
    { area: "Dynamic Programming", score: 55, color: C.amber },
    { area: "Segment Trees", score: 38, color: C.red },
  ];
  const importantQs = questions.length > 0 ? questions.slice(0, 4).map(q => ({
    q: q.question, freq: q.difficulty === "Hard" ? "Very High" : "Medium", tag: "Interview", id: q.id, completed: q.completed
  })) : [
    { q: "What is the time complexity of Quicksort in best, average and worst case?", freq: "Very High", tag: "Complexity", id: 1, completed: false },
    { q: "Explain the difference between DFS and BFS with use cases.", freq: "High", tag: "Graphs", id: 2, completed: false },
    { q: "How does a HashMap work internally in Java?", freq: "Very High", tag: "Hashing", id: 3, completed: false },
    { q: "Describe the process of cycle detection in a directed graph.", freq: "Medium", tag: "Graphs", id: 4, completed: false },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Completed", value: `${s.done}/${s.total}`, color: s.color, icon: <Check size={14} /> },
          { label: "Practice Qs", value: "428", color: C.cyan, icon: <Target size={14} /> },
          { label: "Mock Tests", value: "5 done", color: C.green, icon: <BarChart3 size={14} /> },
          { label: "Avg Score", value: "73%", color: C.amber, icon: <TrendingUp size={14} /> },
        ].map(st => (
          <div key={st.label} className="p-3 rounded-2xl" style={{ background: `${st.color}10`, border: `1px solid ${st.color}25` }}>
            <div className="flex items-center gap-1.5 mb-1" style={{ color: st.color }}>{st.icon}<span className="text-xs">{st.label}</span></div>
            <div className="text-lg font-black text-white">{st.value}</div>
          </div>
        ))}
      </div>

      {/* Topic progress tracker */}
      <Card className="p-5">
        <SecHead icon={<Layers size={16} />} title="Topic Progress Tracker" sub={`${s.name} — chapter by chapter`} />
        <div className="space-y-2">
          {topics.map(t => (
            <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl transition-colors"
              style={{ background: t.current ? `${s.color}10` : C.surface, border: `1px solid ${t.current ? s.color + "40" : C.border}` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: t.done ? `${C.green}20` : t.current ? `${s.color}20` : C.border, border: `1px solid ${t.done ? C.green : t.current ? s.color : C.border}` }}>
                {t.done ? <Check size={10} style={{ color: C.green }} /> : t.current ? <Play size={9} style={{ color: s.color }} fill={s.color} /> : null}
              </div>
              <span className="flex-1 text-xs font-medium" style={{ color: t.done ? C.muted : t.current ? C.text : C.muted }}>
                {t.name}
              </span>
              {t.current && <Pill label="In Progress" color={s.color} />}
              <span className="text-xs" style={{ color: C.muted }}>{t.q} questions</span>
              {t.done && <span className="text-xs font-semibold" style={{ color: C.green }}>✓ Done</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* Practice Qs + Mock Tests grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Practice Questions */}
        <Card className="p-5">
          <SecHead icon={<Target size={16} />} title="Practice Questions"
            action={<button className="text-xs font-medium" style={{ color: s.color }}>View all</button>} />
          <div className="space-y-2.5">
            {[
              { title: "Two Sum", diff: "Easy", solved: true },
              { title: "Longest Substring Without Repeating Characters", diff: "Medium", solved: true },
              { title: "Merge K Sorted Lists", diff: "Hard", solved: false },
              { title: "Binary Tree Maximum Path Sum", diff: "Hard", solved: false },
            ].map(q => (
              <div key={q.title} className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: q.solved ? `${C.green}20` : C.border }}>
                  {q.solved && <Check size={10} style={{ color: C.green }} />}
                </div>
                <span className="flex-1 text-xs text-white truncate">{q.title}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${diffColor(q.diff)}15`, color: diffColor(q.diff) }}>{q.diff}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
            <Play size={11} /> Start Practice Session
          </button>
        </Card>

        {/* Mock Test Section */}
        <Card className="p-5">
          <SecHead icon={<BarChart3 size={16} />} title="Mock Test Scores" sub="Last 5 attempts" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart id="dash-mock-bar" data={mockScores} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="test" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="score" name="Score" radius={[5, 5, 0, 0]} fill={s.color} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <button className="w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-white"
            style={{ background: C.grad }}>
            <Play size={11} /> Take New Mock Test
          </button>
        </Card>
      </div>

      {/* Important Interview Questions */}
      <Card className="p-5">
        <SecHead icon={<Star size={16} />} title="Important Interview Questions"
          sub="Most frequently asked in FAANG & top companies" />
        <div className="space-y-2.5">
          {importantQs.map((q, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="text-xs font-black w-5 flex-shrink-0 mt-0.5" style={{ color: C.border }}>
                #{String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white leading-snug mb-1.5">{q.q}</div>
                <div className="flex items-center gap-2">
                  <Pill label={q.tag} color={s.color} />
                  <span className="text-xs" style={{ color: q.freq === "Very High" ? C.red : q.freq === "High" ? C.amber : C.muted }}>
                    {q.freq} frequency
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (q.id) {
                    subjectsApi.submitAnswer(q.id, "Mock valid answer").then(() => {
                      alert("Answer submitted and evaluated!");
                    }).catch(e => console.error(e));
                  }
                }}
                className="text-xs flex-shrink-0 px-2.5 py-1 rounded-lg"
                style={{ background: q.completed ? `${C.green}15` : `${s.color}15`, color: q.completed ? C.green : s.color }}>
                {q.completed ? "Done" : "Answer"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Weak Areas + AI Recommendations row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weak Areas */}
        <Card className="p-5">
          <SecHead icon={<AlertTriangle size={16} />} title="Weak Areas Analysis"
            sub="Topics needing the most attention" />
          <div className="space-y-3">
            {weakAreas.map(w => (
              <div key={w.area}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-white">{w.area}</span>
                  <span className="font-bold" style={{ color: w.color }}>{w.score}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${w.score}%`, background: w.color }} />
                </div>
              </div>
            ))}
            <button className="w-full mt-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: "rgba(239,68,68,.1)", color: C.red, border: "1px solid rgba(239,68,68,.25)" }}>
              <Target size={11} /> Practice Weak Areas
            </button>
          </div>
        </Card>

        {/* AI Recommended Topics */}
        <Card className="p-5">
          <SecHead icon={<Sparkles size={16} />} title="AI Recommended Topics"
            sub="Based on your weak areas and exam patterns" />
          <div className="space-y-2.5">
            {[
              { topic: "Kruskal's & Prim's Algorithm", reason: "Frequently asked, not practiced yet", icon: "🔗" },
              { topic: "Fenwick Tree (BIT)", reason: "Common in competitive coding rounds", icon: "🌲" },
              { topic: "Trie Data Structure", reason: "Appears in 67% of string-related FAANG questions", icon: "📚" },
            ].map(r => (
              <div key={r.topic} className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: "rgba(168,85,247,.07)", border: "1px solid rgba(168,85,247,.2)" }}>
                <span className="text-base flex-shrink-0">{r.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-white">{r.topic}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{r.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Study Streak + Daily Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Study Streak */}
        <Card className="p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(245,158,11,.12),rgba(239,68,68,.08))", border: "1px solid rgba(245,158,11,.35)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={18} style={{ color: C.amber }} />
                <span className="text-sm font-bold text-white">Study Streak</span>
              </div>
              <div className="text-xs" style={{ color: C.muted }}>Keep it going — consistency beats intensity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: C.amber }}>{s.streak}</div>
              <div className="text-xs" style={{ color: C.muted }}>days</div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="flex-1 h-5 rounded"
                style={{ background: i < s.streak ? C.amber : C.border, opacity: i < s.streak ? 0.7 + i * 0.02 : 1 }} />
            ))}
          </div>
          <div className="text-xs mt-2" style={{ color: C.muted }}>Last 14 days — {s.streak} active</div>
        </Card>

        {/* Daily Goal */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crosshair size={16} style={{ color: C.cyan }} />
              <span className="text-sm font-bold text-white">Daily Goal</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: C.cyan }}>3/5 done</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Solve 5 practice questions", done: true },
              { label: "Complete 1 topic module", done: true },
              { label: "Review yesterday's notes", done: true },
              { label: "Take 1 mock quiz", done: false },
              { label: "Watch 1 concept video", done: false },
            ].map((g, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: g.done ? `${C.green}20` : C.surface, border: `1px solid ${g.done ? C.green : C.border}` }}>
                  {g.done && <Check size={9} style={{ color: C.green }} />}
                </div>
                <span className="text-xs" style={{ color: g.done ? C.muted : C.text, textDecoration: g.done ? "line-through" : "none" }}>
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Revision Notes */}
      <Card className="p-5">
        <SecHead icon={<BookMarked size={16} />} title="Quick Revision Notes"
          sub={`Key concepts for ${s.name}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Big O Cheat Sheet", preview: "O(1) < O(log n) < O(n) < O(n log n) < O(n²)...", tag: "Complexity" },
            { title: "Sorting Algorithms", preview: "QuickSort avg O(n log n), MergeSort stable O(n log n), HeapSort...", tag: "Sorting" },
            { title: "Tree Traversals", preview: "Inorder (LNR), Preorder (NLR), Postorder (LRN). BFS uses queue...", tag: "Trees" },
            { title: "Graph Representations", preview: "Adjacency matrix: O(V²) space. Adjacency list: O(V+E) space...", tag: "Graphs" },
          ].map(n => (
            <div key={n.title} className="p-3.5 rounded-xl cursor-pointer hover:border-purple-500/40 transition-colors"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-semibold text-white">{n.title}</span>
                <Pill label={n.tag} color={s.color} />
              </div>
              <div className="text-xs leading-relaxed font-mono" style={{ color: C.muted, fontSize: 11 }}>{n.preview}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SubjectPrepPage() {
  const [subjectsList, setSubjectsList] = useState<any[]>(SUBJECTS);
  const [selected, setSelected] = useState("dsa");

  useEffect(() => {
    subjectsApi.getAll().then(res => {
      if (res && res.length > 0) {
        const mapped = res.map((s: any, i: number) => ({
          id: String(s.id),
          name: s.subject_name,
          icon: s.icon || "📚",
          color: [C.purple, C.cyan, C.green, C.amber, C.indigo, C.teal, C.pink, C.amber][i % 8],
          progress: s.progress,
          difficulty: s.difficulty || "Medium",
          total: s.total_topics || 1,
          done: s.done_topics || 0,
          streak: s.streak || 0,
          tags: s.tags || []
        }));
        setSubjectsList(mapped);
        setSelected(mapped[0].id);
      }
    }).catch(err => console.error("Error fetching subjects:", err));
  }, []);

  const selectedSubject = subjectsList.find(s => s.id === selected) || subjectsList[0];

  const overallProgress = subjectsList.length > 0 ? Math.round(subjectsList.reduce((a, s) => a + s.progress, 0) / subjectsList.length) : 0;
  const totalDone = subjectsList.reduce((a, s) => a + s.done, 0);
  const totalTopics = subjectsList.reduce((a, s) => a + s.total, 0);

  const radarData = subjectsList.slice(0, 6).map(s => ({ subject: s.name.split(" ")[0], A: s.progress }));

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <BookOpen size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Subject-wise Preparation</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>
              Master core computer science subjects with <Grad>AI-powered learning</Grad>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Download size={14} /> Export Progress
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: C.grad }}>
              <Play size={14} /> Continue Learning
            </button>
          </div>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Overall Progress", value: `${overallProgress}%`, icon: <TrendingUp size={16} />, color: C.purple },
            { label: "Topics Completed", value: `${totalDone}/${totalTopics}`, icon: <Check size={16} />, color: C.cyan },
            { label: "Current Streak", value: "14 days", icon: <Flame size={16} />, color: C.amber },
            { label: "Subjects Active", value: `${subjectsList.filter(s => s.progress > 0).length}/${subjectsList.length}`, icon: <BookOpen size={16} />, color: C.green },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black text-white">{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Subject cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {subjectsList.map(s => (
            <SubjectCard key={s.id} s={s} selected={selected === s.id} onSelect={() => setSelected(s.id)} />
          ))}
        </div>

        {/* Recent Learning Progress + Radar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <Card className="md:col-span-2 p-5">
            <SecHead icon={<BarChart3 size={16} />} title="Recent Learning Progress"
              sub="Weekly topic completion trend" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart id="sp-progress-area"
                data={[
                  { day: "Mon", dsa: 4, dbms: 2, os: 3 },
                  { day: "Tue", dsa: 6, dbms: 3, os: 2 },
                  { day: "Wed", dsa: 3, dbms: 4, os: 5 },
                  { day: "Thu", dsa: 7, dbms: 2, os: 4 },
                  { day: "Fri", dsa: 5, dbms: 5, os: 3 },
                  { day: "Sat", dsa: 8, dbms: 3, os: 6 },
                  { day: "Sun", dsa: 4, dbms: 6, os: 2 },
                ]}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="dsa" stroke={C.purple} fill={C.purple} fillOpacity={0.15} strokeWidth={2} name="DSA" />
                <Area type="monotone" dataKey="os" stroke={C.cyan} fill={C.cyan} fillOpacity={0.12} strokeWidth={2} name="OS" />
                <Area type="monotone" dataKey="dbms" stroke={C.green} fill="none" strokeWidth={2} name="DBMS" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <SecHead icon={<Crosshair size={16} />} title="Subject Mastery Radar" />
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart id="sp-mastery-radar" data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: C.muted, fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar dataKey="A" stroke={C.purple} fill={C.purple} fillOpacity={0.18} strokeWidth={2} />
                <Tooltip content={<ChartTip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detail panel for selected subject */}
        <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl"
          style={{ background: `${selectedSubject.color}10`, border: `1px solid ${selectedSubject.color}35` }}>
          <span className="text-2xl">{selectedSubject.icon}</span>
          <div>
            <div className="text-sm font-bold text-white">Detailed View: {selectedSubject.name}</div>
            <div className="text-xs" style={{ color: C.muted }}>
              {selectedSubject.progress}% complete · {selectedSubject.done}/{selectedSubject.total} topics
            </div>
          </div>
          <div className="ml-auto">
            <Pill label={selectedSubject.difficulty} color={diffColor(selectedSubject.difficulty)} />
          </div>
        </div>
        <SubjectDetailPanel s={selectedSubject} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2: DOMAIN-WISE PREPARATION
// ═══════════════════════════════════════════════════════════════════════════════

const DOMAINS = [
  {
    id: "web", name: "Web Development", icon: "🌐", color: C.purple,
    progress: 72, difficulty: "Intermediate", time: "8 weeks left",
    skills: ["React", "Node.js", "TypeScript", "CSS", "REST APIs"],
    demand: 96, salary: "₹18–35 LPA",
  },
  {
    id: "ai", name: "AI / Machine Learning", icon: "🤖", color: C.cyan,
    progress: 38, difficulty: "Advanced", time: "14 weeks left",
    skills: ["Python", "PyTorch", "Transformers", "MLOps"],
    demand: 99, salary: "₹25–60 LPA",
  },
  {
    id: "ds", name: "Data Science", icon: "📊", color: C.green,
    progress: 51, difficulty: "Intermediate", time: "10 weeks left",
    skills: ["Python", "SQL", "Pandas", "Statistics", "Power BI"],
    demand: 94, salary: "₹15–30 LPA",
  },
  {
    id: "cloud", name: "Cloud Computing", icon: "☁️", color: C.blue,
    progress: 29, difficulty: "Intermediate", time: "12 weeks left",
    skills: ["AWS", "GCP", "Terraform", "Docker", "Kubernetes"],
    demand: 92, salary: "₹20–45 LPA",
  },
  {
    id: "cyber", name: "Cybersecurity", icon: "🔒", color: C.red,
    progress: 18, difficulty: "Advanced", time: "16 weeks left",
    skills: ["Penetration Testing", "SIEM", "Cryptography", "OWASP"],
    demand: 88, salary: "₹20–50 LPA",
  },
  {
    id: "devops", name: "DevOps", icon: "⚙️", color: C.amber,
    progress: 44, difficulty: "Intermediate", time: "9 weeks left",
    skills: ["CI/CD", "Docker", "Kubernetes", "Ansible", "Monitoring"],
    demand: 91, salary: "₹18–40 LPA",
  },
  {
    id: "mobile", name: "Mobile App Development", icon: "📱", color: C.pink,
    progress: 63, difficulty: "Intermediate", time: "7 weeks left",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"],
    demand: 84, salary: "₹15–28 LPA",
  },
  {
    id: "test", name: "Software Testing", icon: "🧪", color: C.teal,
    progress: 57, difficulty: "Beginner", time: "6 weeks left",
    skills: ["Selenium", "Jest", "Cypress", "Postman", "JUnit"],
    demand: 79, salary: "₹10–22 LPA",
  },
];

function DomainCard({ d, onSelect, selected }: { d: typeof DOMAINS[0]; onSelect: () => void; selected: boolean }) {
  return (
    <div onClick={onSelect} className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-4"
      style={{
        background: selected ? `linear-gradient(135deg,${d.color}18,${d.color}08)` : C.card,
        border: selected ? `1px solid ${d.color}55` : `1px solid ${C.border}`,
        boxShadow: selected ? `0 0 32px ${d.color}18` : "0 4px 20px rgba(0,0,0,.25)",
      }}>
      {/* Icon + meta */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>{d.icon}</div>
        <div className="text-right">
          <div className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${diffColor(d.difficulty)}15`, color: diffColor(d.difficulty) }}>
            {d.difficulty}
          </div>
          <div className="flex items-center gap-1 mt-1.5 justify-end text-xs" style={{ color: C.muted }}>
            <Clock size={10} /> {d.time}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-bold text-white mb-2">{d.name}</div>
        <div className="flex flex-wrap gap-1">
          {d.skills.slice(0, 3).map(sk => (
            <span key={sk} className="text-xs px-1.5 py-0.5 rounded-md"
              style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>{sk}</span>
          ))}
          {d.skills.length > 3 && (
            <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: C.surface, color: C.muted }}>
              +{d.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: C.muted }}>Demand Score</span>
          <span className="font-bold" style={{ color: C.green }}>{d.demand}%</span>
        </div>
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: C.muted }}>Your Progress</span>
          <span className="font-bold" style={{ color: d.color }}>{d.progress}%</span>
        </div>
        <div className="h-2 rounded-full mb-1" style={{ background: C.border }}>
          <div className="h-full rounded-full" style={{ width: `${d.progress}%`, background: d.color, boxShadow: `0 0 8px ${d.color}50` }} />
        </div>
      </div>

      <button onClick={e => { e.stopPropagation(); onSelect(); }}
        className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{ background: selected ? d.color : C.surface, border: `1px solid ${selected ? d.color : C.border}`, color: selected ? "#fff" : C.muted }}>
        <Map size={11} /> Explore Roadmap
      </button>
    </div>
  );
}

function DomainDetailPanel({ d }: { d: typeof DOMAINS[0] }) {
  const roadmap = [
    { phase: "Foundation", topics: ["Core concepts", "Setup & tooling", "First project"], done: true, weeks: "Weeks 1–2" },
    { phase: "Core Skills", topics: ["Key frameworks", "Best practices", "Mini projects"], done: true, weeks: "Weeks 3–5" },
    { phase: "Advanced", topics: ["Architecture patterns", "Performance", "Real-world projects"], done: false, current: true, weeks: "Weeks 6–9" },
    { phase: "Portfolio", topics: ["Capstone project", "Deployment", "Documentation"], done: false, weeks: "Weeks 10–12" },
    { phase: "Interview Prep", topics: ["Domain questions", "Mock interviews", "Case studies"], done: false, weeks: "Weeks 13–14" },
  ];

  const courses = [
    { name: "The Complete Guide to " + d.name.split(" ")[0], platform: "Udemy", rating: 4.8, students: "124K", free: false },
    { name: d.name + " Fundamentals", platform: "Coursera", rating: 4.7, students: "89K", free: false },
    { name: "Official " + d.skills[0] + " Documentation", platform: "Official Docs", rating: 5.0, students: "—", free: true },
  ];

  const companies = [
    { name: "Google", openings: 42, color: C.purple },
    { name: "Meta", openings: 38, color: C.blue },
    { name: "Amazon", openings: 67, color: C.amber },
    { name: "Stripe", openings: 24, color: C.cyan },
    { name: "Flipkart", openings: 31, color: C.pink },
  ];

  const salaryData = [
    { level: "Junior", salary: 12 }, { level: "Mid", salary: 22 },
    { level: "Senior", salary: 38 }, { level: "Lead", salary: 55 },
  ];

  const skillGap = [
    { skill: d.skills[0], current: d.progress, target: 90, color: d.color },
    { skill: d.skills[1] || "Core Tools", current: Math.max(10, d.progress - 20), target: 85, color: C.cyan },
    { skill: "System Design", current: 45, target: 80, color: C.amber },
    { skill: "Interview Skills", current: 62, target: 90, color: C.green },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Skills Covered", value: `${d.skills.length} core`, color: d.color, icon: <Code2 size={14} /> },
          { label: "Market Demand", value: `${d.demand}%`, color: C.green, icon: <TrendingUp size={14} /> },
          { label: "Avg Salary", value: d.salary, color: C.amber, icon: <Briefcase size={14} /> },
          { label: "Time Left", value: d.time, color: C.purple, icon: <Clock size={14} /> },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-2xl" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
            <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>{s.icon}<span className="text-xs">{s.label}</span></div>
            <div className="text-sm font-black text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Roadmap Timeline */}
      <Card className="p-5">
        <SecHead icon={<Map size={16} />} title="Learning Roadmap Timeline"
          sub={`Structured ${d.time.replace(" left", "")} learning path for ${d.name}`} />
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-0.5" style={{ background: C.border }} />
          <div className="space-y-4">
            {roadmap.map((r, i) => (
              <div key={r.phase} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 text-xs font-bold ${r.done ? 'text-white' : ''}`}
                  style={{
                    background: r.done ? C.green : r.current ? d.color : C.surface,
                    border: `2px solid ${r.done ? C.green : r.current ? d.color : C.border}`,
                    color: r.done ? "#fff" : r.current ? d.color : C.muted,
                  }}>
                  {r.done ? <Check size={12} /> : i + 1}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{r.phase}</span>
                    {r.current && <Pill label="Current" color={d.color} />}
                    <span className="text-xs ml-auto" style={{ color: C.muted }}>{r.weeks}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.topics.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md"
                        style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Required Skills + Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Required Skills */}
        <Card className="p-5">
          <SecHead icon={<Cpu size={16} />} title="Required Skills" sub={`Core competencies for ${d.name}`} />
          <div className="flex flex-wrap gap-2 mb-4">
            {d.skills.map(sk => <Pill key={sk} label={sk} color={d.color} />)}
          </div>
          <div className="space-y-2.5">
            {d.skills.slice(0, 4).map((sk, i) => {
              const pct = Math.max(20, d.progress - i * 8);
              return (
                <div key={sk}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{sk}</span><span className="font-bold" style={{ color: d.color }}>{pct}%</span></div>
                  <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recommended Courses */}
        <Card className="p-5">
          <SecHead icon={<BookOpen size={16} />} title="Recommended Courses" sub="Curated by AI based on your progress" />
          <div className="space-y-3">
            {courses.map(c => (
              <div key={c.name} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: d.color }}>{c.platform[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white leading-snug truncate">{c.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: C.amber }}>★ {c.rating}</span>
                    <span className="text-xs" style={{ color: C.muted }}>{c.students} students</span>
                    {c.free && <Pill label="Free" color={C.green} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hands-on Projects + Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <SecHead icon={<Boxes size={16} />} title="Hands-on Projects" sub="Build to learn, build to impress" />
          <div className="space-y-2.5">
            {[
              { name: `${d.name.split(" ")[0]} Starter Boilerplate`, diff: "Beginner", time: "3 days", done: true },
              { name: "Full CRUD Application with Auth", diff: "Intermediate", time: "1 week", done: true },
              { name: "Real-time Dashboard Project", diff: "Intermediate", time: "1 week", done: false },
              { name: "Production-ready Capstone", diff: "Advanced", time: "3 weeks", done: false },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: p.done ? `${C.green}20` : C.border, border: `1px solid ${p.done ? C.green : C.border}` }}>
                  {p.done && <Check size={9} style={{ color: C.green }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{p.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{p.time}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${diffColor(p.diff)}15`, color: diffColor(p.diff) }}>{p.diff}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SecHead icon={<Award size={16} />} title="Certification Suggestions"
            sub="Industry-recognized credentials" />
          <div className="space-y-3">
            {[
              { name: `${d.skills[0]} Certified Developer`, org: "Official Body", priority: "High", color: C.purple },
              { name: "Google Professional Certificate", org: "Coursera", priority: "Medium", color: C.cyan },
              { name: "Meta Front-End Developer", org: "Meta", priority: "Medium", color: C.blue },
            ].map(c => (
              <div key={c.name} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c.color}18`, color: c.color }}>
                  <Award size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">{c.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: C.muted }}>{c.org}</span>
                    <Pill label={c.priority + " Priority"} color={c.priority === "High" ? C.red : C.amber} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Industry Demand + Salary + Top Companies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Industry Demand */}
        <Card className="p-5">
          <SecHead icon={<TrendingUp size={16} />} title="Industry Demand" sub="2025 job market trend" />
          <div className="flex flex-col items-center gap-3">
            {(() => {
              const r = 38, c = Math.PI * r, d2 = (d.demand / 100) * c;
              return (
                <svg width={96} height={56} viewBox="0 0 96 56">
                  <path d="M 10 48 A 38 38 0 0 1 86 48" fill="none" stroke={C.border} strokeWidth={8} strokeLinecap="round" />
                  <path d="M 10 48 A 38 38 0 0 1 86 48" fill="none" stroke={d.color} strokeWidth={8} strokeLinecap="round"
                    strokeDasharray={`${d2} ${c - d2}`} style={{ filter: `drop-shadow(0 0 6px ${d.color}80)` }} />
                  <text x="48" y="44" textAnchor="middle" fill={C.text}
                    style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Inter',sans-serif" }}>{d.demand}</text>
                </svg>
              );
            })()}
            <div className="text-xs text-center" style={{ color: C.muted }}>
              {d.demand >= 90 ? "🔥 Extremely high demand" : d.demand >= 80 ? "📈 High demand" : "📊 Moderate demand"}
            </div>
            <div className="w-full space-y-2">
              {[{ l: "Job Postings", v: d.demand }, { l: "Salary Growth", v: 78 }, { l: "Future Outlook", v: 88 }].map(m => (
                <div key={m.l}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{m.l}</span><span style={{ color: d.color }}>{m.v}%</span></div>
                  <div className="h-1 rounded-full" style={{ background: C.border }}>
                    <div className="h-full rounded-full" style={{ width: `${m.v}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Salary Insights */}
        <Card className="p-5">
          <SecHead icon={<BarChart2 size={16} />} title="Salary Insights" sub={d.salary + " avg range"} />
          <ResponsiveContainer width="100%" height={150}>
            <BarChart id="dp-salary-bar" data={salaryData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="level" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="salary" name="LPA" radius={[5, 5, 0, 0]}>
                {salaryData.map((_, i) => <Cell key={`sal-cell-${i}`} fill={d.color} fillOpacity={0.5 + i * 0.12} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-center mt-1" style={{ color: C.muted }}>Salary in LPA (India market)</div>
        </Card>

        {/* Top Companies */}
        <Card className="p-5">
          <SecHead icon={<Briefcase size={16} />} title="Top Companies Hiring"
            sub={`Active ${d.name} openings`} />
          <div className="space-y-2.5">
            {companies.map(co => (
              <div key={co.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `${co.color}20`, color: co.color, border: `1px solid ${co.color}35` }}>
                  {co.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-white">{co.name}</span>
                    <span style={{ color: C.green }}>{co.openings} open</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: C.border }}>
                    <div className="h-full rounded-full" style={{ width: `${(co.openings / 70) * 100}%`, background: co.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Skill Gap + Recommended Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <SecHead icon={<Sparkles size={16} />} title="AI Skill Gap Analysis"
            sub="Current vs. target proficiency" />
          <div className="space-y-4">
            {skillGap.map(sg => (
              <div key={sg.skill}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-white">{sg.skill}</span>
                  <span style={{ color: C.muted }}>
                    <span style={{ color: sg.color }}>{sg.current}%</span> → <span style={{ color: C.green }}>{sg.target}%</span>
                  </span>
                </div>
                <div className="relative h-2.5 rounded-full" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${sg.target}%`, background: `${sg.color}30` }} />
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${sg.current}%`, background: sg.color }} />
                </div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>
                  Gap: {sg.target - sg.current}% to close
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,.1),rgba(34,211,238,.07))", border: "1px solid rgba(168,85,247,.3)" }}>
          <SecHead icon={<ArrowRight size={16} />} title="Recommended Next Steps"
            sub="Your AI-personalised action plan" />
          <div className="space-y-3">
            {[
              { n: 1, action: `Complete "${d.skills[2] || "Core Tools"}" module this week`, tag: "Learning", color: d.color },
              { n: 2, action: "Build the Hands-on Project #3: Real-time Dashboard", tag: "Project", color: C.cyan },
              { n: 3, action: `Take Mock Test for ${d.name} fundamentals`, tag: "Assessment", color: C.green },
              { n: 4, action: `Earn the ${d.skills[0]} certification by end of month`, tag: "Certification", color: C.amber },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(31,41,55,.6)", border: `1px solid ${C.border}` }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: s.color }}>{s.n}</div>
                <div className="flex-1">
                  <div className="text-xs text-white leading-snug">{s.action}</div>
                  <Pill label={s.tag} color={s.color} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DomainPrepPage() {
  const [domainsList, setDomainsList] = useState<any[]>(DOMAINS);
  const [selected, setSelected] = useState("web");
  const [genLoading, setGenLoading] = useState(false);
  const [genQuestions, setGenQuestions] = useState<any[]>([]);

  useEffect(() => {
    domainsApi.getAll().then(res => {
      if (res && res.length > 0) {
        const mapped = res.map((d: any, i: number) => ({
          id: String(d.id),
          name: d.domain_name,
          icon: d.icon || ["🌐","🤖","📊","☁️","🔒","⚙️","📱","🧪"][i % 8],
          color: [C.purple, C.cyan, C.green, C.blue, C.red, C.amber, C.pink, C.teal][i % 8],
          progress: d.progress,
          difficulty: "Intermediate",
          time: "10 weeks left",
          skills: ["Core Skills"],
          demand: 90,
          salary: "₹15–35 LPA",
        }));
        setDomainsList(mapped);
        setSelected(mapped[0].id);
      }
    }).catch(err => console.error("Error fetching domains:", err));
  }, []);

  const dom = domainsList.find(d => d.id === selected) || domainsList[0];

  const handleGenerateQuestions = async () => {
    if (!dom) return;
    setGenLoading(true);
    try {
      const result = await aiPrepApi.generateQuestions({
        domain: dom.name,
        skills: dom.skills,
        difficulty: "Medium",
        number_of_questions: 5,
        category: "Technical"
      });
      setGenQuestions(result?.questions || []);
    } catch(e) {
      console.error("AI generation failed:", e);
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <GraduationCap size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Domain-wise Preparation</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>
              Prepare for your target career domain with <Grad>personalized AI learning paths</Grad>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Download size={14} /> Export Plan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: C.grad }}>
              <Map size={14} /> View My Roadmap
            </button>
          </div>
        </div>

        {/* Domain summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Domains Enrolled", value: `${domainsList.filter(d => d.progress > 0).length}/${domainsList.length}`, icon: <Boxes size={16} />, color: C.purple },
            { label: "Skills In Progress", value: "12", icon: <Code2 size={16} />, color: C.cyan },
            { label: "Certifications", value: "1 earned", icon: <Award size={16} />, color: C.amber },
            { label: "AI Match Score", value: "84%", icon: <Sparkles size={16} />, color: C.green },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black text-white">{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Domain cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {domainsList.map(d => (
            <DomainCard key={d.id} d={d} selected={selected === d.id} onSelect={() => setSelected(d.id)} />
          ))}
        </div>

        {/* AI Question Generation Panel */}
        {dom && (
          <Card className="p-5 mb-6" style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.3)" }}>
            <div className="flex items-start justify-between">
              <SecHead icon={<Sparkles size={16} />} title="AI Question Generator" sub={`Generate personalized ${dom.name} interview questions`} />
              <button
                onClick={handleGenerateQuestions}
                disabled={genLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: C.grad }}>
                {genLoading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {genLoading ? "Generating..." : "Generate Questions"}
              </button>
            </div>
            {genQuestions.length > 0 && (
              <div className="space-y-2.5 mt-4">
                {genQuestions.map((q: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: C.grad }}>Q{i + 1}</div>
                    <div className="flex-1">
                      <div className="text-xs text-white leading-relaxed">{q.question}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Pill label={q.category} color={C.purple} />
                        <Pill label={q.difficulty} color={q.difficulty === "Hard" ? C.red : q.difficulty === "Medium" ? C.amber : C.green} />
                        <span className="text-xs" style={{ color: C.muted }}>{q.topic}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Selected domain header */}
        {dom && (
          <>
            <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl"
              style={{ background: `${dom.color}10`, border: `1px solid ${dom.color}35` }}>
              <span className="text-2xl">{dom.icon}</span>
              <div>
                <div className="text-sm font-bold text-white">{dom.name} — Detailed Learning Path</div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {dom.progress}% complete · {dom.time} to finish · {dom.skills.length} core skills
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Pill label={dom.difficulty} color={diffColor(dom.difficulty)} />
                <Pill label={dom.salary} color={C.green} />
              </div>
            </div>
            <DomainDetailPanel d={dom} />
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3: AI MOCK INTERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function useTimer(running: boolean) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return { secs, display: `${mm}:${ss}`, reset: () => setSecs(0) };
}

function AIAvatar({ speaking, size = 80 }: { speaking: boolean; size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {speaking && [1, 2, 3].map(i => (
        <div key={i} className="absolute inset-0 rounded-full animate-ping"
          style={{ border: `2px solid ${C.purple}`, opacity: 0.35 / i, animationDelay: `${i * 0.22}s`, animationDuration: "1.4s" }} />
      ))}
      <div className="w-full h-full rounded-full flex items-center justify-center relative z-10 flex-shrink-0"
        style={{
          background: speaking
            ? `radial-gradient(circle at 40% 40%, rgba(168,85,247,.45), rgba(34,211,238,.3))`
            : `radial-gradient(circle at 40% 40%, rgba(31,41,55,1), rgba(17,24,39,1))`,
          border: `2px solid ${speaking ? C.purple : C.border}`,
          boxShadow: speaking ? `0 0 32px rgba(168,85,247,.4)` : "none",
          transition: "all .35s ease",
        }}>
        <Brain size={size * 0.38} style={{ color: speaking ? C.purple : C.muted }} />
      </div>
    </div>
  );
}

function Waveform({ active, bars = 22 }: { active: boolean; bars?: number }) {
  const heights = useRef(Array.from({ length: bars }, () => Math.random()));
  return (
    <div className="flex items-center gap-0.5 h-8">
      {heights.current.map((h, i) => (
        <div key={i} className="rounded-full transition-all"
          style={{
            width: 3,
            height: active ? `${8 + h * 24}px` : "4px",
            background: active
              ? `linear-gradient(to top, ${C.purple}, ${C.cyan})`
              : C.border,
            transition: `height ${0.2 + (i % 5) * 0.06}s ease ${i * 0.02}s`,
          }} />
      ))}
    </div>
  );
}

const INTERVIEW_TYPES = [
  { id: "hr", label: "HR Interview", icon: "🤝", desc: "Behavioural & cultural fit", color: C.purple },
  { id: "technical", label: "Technical", icon: "💻", desc: "DSA, system design", color: C.cyan },
  { id: "behavioral", label: "Behavioral", icon: "🧠", desc: "STAR method & scenarios", color: C.green },
  { id: "mixed", label: "Mixed Round", icon: "🔀", desc: "HR + Technical combined", color: C.amber },
  { id: "coding", label: "Live Coding", icon: "⌨️", desc: "Real-time problem solving", color: C.pink },
];

const QUESTIONS_BANK = [
  { q: "Tell me about yourself and your most recent project.", type: "HR", follow: "What was your specific contribution?" },
  { q: "Explain the time complexity of Quick Sort. When would you prefer Merge Sort?", type: "Technical", follow: "Can you trace through an example array?" },
  { q: "Describe a time you faced a conflict with a teammate. How did you resolve it?", type: "Behavioral", follow: "What would you do differently now?" },
  { q: "Design a URL shortening service like bit.ly at scale.", type: "Technical", follow: "How would you handle 100M daily redirects?" },
  { q: "Where do you see yourself in 5 years? Why this company?", type: "HR", follow: "What specific role are you targeting?" },
  { q: "Write a function to detect a cycle in a linked list.", type: "Coding", follow: "Can you optimize to O(1) space?" },
];

function InterviewSetup({ onStart }: { onStart: (cfg: any) => void }) {
  const [type, setType] = useState("technical");
  const [difficulty, setDiff] = useState("Medium");
  const [role, setRole] = useState("Software Engineer");
  const [exp, setExp] = useState("2-4 years");
  const [duration, setDuration] = useState("30 min");
  const [lang, setLang] = useState("English");

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <Mic size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">AI Mock Interview</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>
              Practice real interview scenarios with an <Grad>AI-powered interviewer</Grad>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: C.green }} />
              <span className="text-xs font-semibold" style={{ color: C.green }}>AI Ready</span>
            </div>
          </div>
        </div>

        {/* Interview Type */}
        <Card className="p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: C.grad }}>1</div>
            <div>
              <div className="text-sm font-bold text-white">Select Interview Type</div>
              <div className="text-xs" style={{ color: C.muted }}>Choose the interview format that matches your goal</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {INTERVIEW_TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all hover:scale-[1.03]"
                style={{
                  background: type === t.id ? `linear-gradient(135deg,${t.color}20,${t.color}10)` : C.surface,
                  border: `1px solid ${type === t.id ? t.color + "55" : C.border}`,
                  boxShadow: type === t.id ? `0 0 20px ${t.color}20` : "none",
                }}>
                <span className="text-2xl">{t.icon}</span>
                <div className="text-xs font-bold" style={{ color: type === t.id ? t.color : C.text }}>{t.label}</div>
                <div className="text-xs leading-tight" style={{ color: C.muted }}>{t.desc}</div>
                {type === t.id && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.color }}>
                    <Check size={9} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Difficulty */}
        <Card className="p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: C.grad }}>2</div>
            <div>
              <div className="text-sm font-bold text-white">Select Difficulty Level</div>
              <div className="text-xs" style={{ color: C.muted }}>Match your current preparation level</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Easy", icon: "🟢", desc: "Freshers & campus interviews", bars: 1, color: C.green },
              { label: "Medium", icon: "🟡", desc: "1–3 years experience", bars: 2, color: C.amber },
              { label: "Hard", icon: "🔴", desc: "Senior & FAANG level", bars: 3, color: C.red },
            ].map(d => (
              <button key={d.label} onClick={() => setDiff(d.label)}
                className="flex flex-col gap-3 p-5 rounded-2xl text-left transition-all"
                style={{
                  background: difficulty === d.label ? `${d.color}12` : C.surface,
                  border: `1px solid ${difficulty === d.label ? d.color + "50" : C.border}`,
                }}>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{d.icon}</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(b => (
                      <div key={b} className="w-4 h-2 rounded-sm"
                        style={{ background: b <= d.bars ? d.color : C.border }} />
                    ))}
                  </div>
                </div>
                <div className="text-sm font-bold text-white">{d.label}</div>
                <div className="text-xs" style={{ color: C.muted }}>{d.desc}</div>
                {difficulty === d.label && <Pill label="Selected" color={d.color} />}
              </button>
            ))}
          </div>
        </Card>

        {/* Setup Form */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: C.grad }}>3</div>
            <div>
              <div className="text-sm font-bold text-white">Configure Your Session</div>
              <div className="text-xs" style={{ color: C.muted }}>Personalise the interview to your target role</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Job Role", val: role, onChange: setRole,
                options: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager"],
              },
              {
                label: "Experience Level", val: exp, onChange: setExp,
                options: ["Fresher", "0–1 year", "1–2 years", "2–4 years", "4–7 years", "7+ years"],
              },
              {
                label: "Duration", val: duration, onChange: setDuration,
                options: ["15 min", "30 min", "45 min", "60 min", "90 min"],
              },
              {
                label: "Language", val: lang, onChange: setLang,
                options: ["English", "Hindi", "Tamil", "Telugu", "Kannada"],
              },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.muted }}>{f.label}</label>
                <select value={f.val} onChange={e => f.onChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>

        {/* Start button */}
        <div className="flex justify-center">
          <button
            onClick={() => onStart({ type, difficulty, role, exp, duration, lang })}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-[1.03] hover:opacity-95"
            style={{ background: C.grad, boxShadow: "0 8px 32px rgba(168,85,247,.4)" }}>
            <Play size={18} fill="white" />
            Start Interview Session
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const CODING_PROBLEM = {
  title: "Two Sum",
  difficulty: "Easy",
  tag: "Arrays · Hash Map",
  timeLimit: "30 min",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", note: "nums[0] + nums[1] = 2 + 7 = 9" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", note: "nums[1] + nums[2] = 2 + 4 = 6" },
  ],
  starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  testCases: [
    { input: "[2,7,11,15], 9", expected: "[0,1]", status: "pass" },
    { input: "[3,2,4], 6", expected: "[1,2]", status: "pass" },
    { input: "[3,3], 6", expected: "[0,1]", status: "pending" },
  ],
};

function CodingChallengePanel() {
  const [code, setCode] = useState(CODING_PROBLEM.starterCode);
  const [lang, setLang] = useState("Python");
  const [activeTab, setActiveTab] = useState<"problem" | "output">("problem");
  const [ran, setRan] = useState(false);

  const runCode = () => {
    setRan(true);
    setActiveTab("output");
  };

  const lineCount = code.split("\n").length;

  return (
    <Card className="flex flex-col overflow-hidden" style={{ minHeight: 480 }}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(31,41,55,.6)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(34,211,238,.15)", color: C.cyan }}>
            <Terminal size={13} />
          </div>
          <span className="text-sm font-bold text-white">Coding Challenge</span>
          <Pill label={CODING_PROBLEM.difficulty} color={C.green} />
          <Pill label={CODING_PROBLEM.tag} color={C.cyan} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.amber }}>
            <Clock size={11} /> {CODING_PROBLEM.timeLimit}
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs outline-none appearance-none"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }}>
            {["Python", "JavaScript", "Java", "C++", "Go"].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Split pane: Problem + Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — problem description */}
        <div className="w-2/5 overflow-y-auto p-4 space-y-4 flex-shrink-0"
          style={{ borderRight: `1px solid ${C.border}`, scrollbarWidth: "none" }}>
          <div>
            <div className="text-sm font-black text-white mb-1">{CODING_PROBLEM.title}</div>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{CODING_PROBLEM.description}</p>
          </div>

          {/* Examples */}
          <div>
            <div className="text-xs font-bold text-white mb-2">Examples</div>
            {CODING_PROBLEM.examples.map((ex, i) => (
              <div key={i} className="mb-2 p-3 rounded-xl text-xs"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="mb-1"><span style={{ color: C.muted }}>Input: </span>
                  <span className="font-mono" style={{ color: C.cyan }}>{ex.input}</span></div>
                <div className="mb-1"><span style={{ color: C.muted }}>Output: </span>
                  <span className="font-mono" style={{ color: C.green }}>{ex.output}</span></div>
                <div style={{ color: C.muted }}>// {ex.note}</div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div>
            <div className="text-xs font-bold text-white mb-2">Constraints</div>
            <div className="space-y-1.5">
              {CODING_PROBLEM.constraints.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.purple }} />
                  <span className="text-xs font-mono" style={{ color: C.muted }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Hint */}
          <div className="p-3 rounded-xl"
            style={{ background: "rgba(168,85,247,.07)", border: "1px solid rgba(168,85,247,.2)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={11} style={{ color: C.purple }} />
              <span className="text-xs font-bold" style={{ color: C.purple }}>AI Hint</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
              Try using a hash map to store visited numbers. For each element, check if its complement already exists in O(1) time.
            </p>
          </div>
        </div>

        {/* Right — code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(17,24,39,.8)" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F56" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27C93F" }} />
            </div>
            <span className="text-xs ml-2" style={{ color: C.muted }}>solution.{lang === "Python" ? "py" : lang === "JavaScript" ? "js" : lang === "Java" ? "java" : lang === "C++" ? "cpp" : "go"}</span>
          </div>

          {/* Code area with line numbers */}
          <div className="flex flex-1 overflow-hidden" style={{ background: "#0D1117" }}>
            {/* Line numbers */}
            <div className="px-3 py-3 text-right flex-shrink-0 select-none"
              style={{ background: "#0D1117", borderRight: `1px solid ${C.border}`, minWidth: 40 }}>
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="text-xs leading-5" style={{ color: "#3B4048", fontFamily: "'JetBrains Mono',monospace" }}>
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Editor */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 text-xs outline-none resize-none leading-5"
              style={{
                background: "#0D1117",
                color: "#E6EDF3",
                fontFamily: "'JetBrains Mono',monospace",
                caretColor: C.purple,
              }}
            />
          </div>

          {/* Bottom tabs: test cases / output */}
          <div className="flex-shrink-0" style={{ borderTop: `1px solid ${C.border}`, background: "rgba(17,24,39,.95)" }}>
            <div className="flex items-center gap-1 px-3 pt-2">
              {(["problem", "output"] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className="px-3 py-1.5 rounded-t-lg text-xs font-semibold capitalize transition-colors"
                  style={{
                    background: activeTab === t ? C.surface : "transparent",
                    color: activeTab === t ? C.text : C.muted,
                    borderBottom: activeTab === t ? `2px solid ${C.purple}` : "2px solid transparent",
                  }}>
                  {t === "problem" ? "Test Cases" : "Output"}
                </button>
              ))}
            </div>

            <div className="px-3 pb-3" style={{ maxHeight: 160, overflowY: "auto", scrollbarWidth: "none" }}>
              {activeTab === "problem" ? (
                <div className="space-y-2 pt-2">
                  {CODING_PROBLEM.testCases.map((tc, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl text-xs"
                      style={{ background: C.surface, border: `1px solid ${tc.status === "pass" ? C.green + "35" : tc.status === "fail" ? C.red + "35" : C.border}` }}>
                      <div className="flex-shrink-0">
                        {tc.status === "pass" ? <CheckCircle2 size={13} style={{ color: C.green }} />
                          : tc.status === "fail" ? <XCircle size={13} style={{ color: C.red }} />
                            : <div className="w-3 h-3 rounded-full border" style={{ borderColor: C.muted }} />}
                      </div>
                      <div className="flex-1 font-mono">
                        <span style={{ color: C.muted }}>Input: </span><span style={{ color: C.text }}>{tc.input}</span>
                        <span className="mx-2" style={{ color: C.border }}>→</span>
                        <span style={{ color: C.muted }}>Expected: </span><span style={{ color: C.cyan }}>{tc.expected}</span>
                      </div>
                      <Pill label={tc.status === "pending" ? "Not run" : tc.status} color={tc.status === "pass" ? C.green : tc.status === "fail" ? C.red : C.muted} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-2">
                  {ran ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={14} style={{ color: C.green }} />
                        <span className="text-xs font-bold" style={{ color: C.green }}>All 2 test cases passed · Runtime: 42ms · Memory: 14.3 MB</span>
                      </div>
                      {[
                        { case: "Case 1", input: "[2,7,11,15], 9", got: "[0,1]", ok: true },
                        { case: "Case 2", input: "[3,2,4], 6", got: "[1,2]", ok: true },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono"
                          style={{ background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)" }}>
                          <CheckCircle2 size={12} style={{ color: C.green }} />
                          <span style={{ color: C.muted }}>{r.case}:</span>
                          <span style={{ color: C.text }}>{r.input}</span>
                          <span style={{ color: C.border }}>→</span>
                          <span style={{ color: C.green }}>{r.got} ✓</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-3" style={{ color: C.muted }}>
                      <Terminal size={13} />
                      <span className="text-xs">Run your code to see output here</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Run/Submit bar */}
            <div className="flex items-center justify-between px-3 pb-3">
              <span className="text-xs" style={{ color: C.muted }}>
                {ran ? "✓ Passed 2/2 test cases" : "Ready to run"}
              </span>
              <div className="flex gap-2">
                <button onClick={runCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.3)", color: C.green }}>
                  <Play size={11} fill={C.green} /> Run
                </button>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: C.grad }}>
                  <ArrowRight size={11} /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActiveInterview({ cfg, onEnd }: { cfg: any; onEnd: () => void }) {
  const [speaking, setSpeaking] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [qIndex, setQIndex] = useState(0);
  const [showFollow, setShowFollow] = useState(false);
  const [notes, setNotes] = useState("");
  const [mainTab, setMainTab] = useState<"interview" | "coding">("interview");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI interviewer. Before we start coding, let me ask — can you walk me through your problem-solving approach?" },
    { role: "user", text: "Sure! I usually start by understanding the problem clearly, then think about edge cases before writing any code." },
    { role: "ai", text: QUESTIONS_BANK[0].q },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const timer = useTimer(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentQ = QUESTIONS_BANK[qIndex];
  const typeInfo = INTERVIEW_TYPES.find(t => t.id === cfg.type) || INTERVIEW_TYPES[1];

  const sendMsg = () => {
    if (!inputMsg.trim()) return;
    setMessages(m => [...m, { role: "user", text: inputMsg }]);
    setInputMsg("");
    setTimeout(() => {
      setSpeaking(true);
      setMessages(m => [...m, { role: "ai", text: "Great response! Let me dig a bit deeper on that point." }]);
      setTimeout(() => setSpeaking(false), 2800);
    }, 700);
  };

  const nextQuestion = () => {
    const next = (qIndex + 1) % QUESTIONS_BANK.length;
    setQIndex(next);
    setShowFollow(false);
    setSpeaking(true);
    setMessages(m => [...m, { role: "ai", text: QUESTIONS_BANK[next].q }]);
    setTimeout(() => setSpeaking(false), 3000);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Live header strip */}
      <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0"
        style={{ background: "rgba(17,24,39,.97)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(12px)" }}>
        {/* Live badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.35)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.red }} />
          <span className="text-xs font-black tracking-widest" style={{ color: C.red }}>LIVE</span>
        </div>
        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <Clock size={12} style={{ color: C.cyan }} />
          <span className="text-xs font-black font-mono" style={{ color: C.cyan }}>{timer.display}</span>
        </div>
        <Pill label={typeInfo.label} color={typeInfo.color} />
        <Pill label={cfg.difficulty} color={cfg.difficulty === "Hard" ? C.red : cfg.difficulty === "Medium" ? C.amber : C.green} />
        {/* Main tabs */}
        <div className="flex items-center gap-1 ml-4 p-1 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {[
            { id: "interview", label: "Interview", icon: <Mic size={11} /> },
            { id: "coding", label: "Coding Challenge", icon: <Terminal size={11} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: mainTab === t.id ? C.grad : "transparent",
                color: mainTab === t.id ? "#fff" : C.muted,
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <span className="text-xs hidden md:block" style={{ color: C.muted }}>{cfg.role} · {cfg.exp}</span>
          <button onClick={onEnd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.4)", color: C.red }}>
            <XCircle size={13} /> End Interview
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── INTERVIEW TAB ── */}
        {mainTab === "interview" && (
          <>
            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: "none" }}>
              {/* AI + Camera row */}
              <div className="grid grid-cols-2 gap-4">
                {/* AI Avatar panel */}
                <Card className="p-5 flex flex-col items-center gap-3"
                  style={{ background: "linear-gradient(135deg,rgba(168,85,247,.09),rgba(34,211,238,.04))", border: "1px solid rgba(168,85,247,.28)" }}>
                  <AIAvatar speaking={speaking} size={80} />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <svg width={12} height={12} viewBox="0 0 18 18" fill="none">
                        <path d="M11 2L5 10h5l-2 6 8-9h-5.5L11 2z" fill="url(#aiLogoGrad)" strokeLinejoin="round" />
                        <defs><linearGradient id="aiLogoGrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A855F7"/><stop offset="1" stopColor="#22D3EE"/></linearGradient></defs>
                      </svg>
                      <div className="text-sm font-black" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CrackIt AI</div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full transition-colors"
                        style={{ background: speaking ? C.green : C.muted }} />
                      <span className="text-xs transition-colors" style={{ color: speaking ? C.green : C.muted }}>
                        {speaking ? "Speaking…" : "Listening"}
                      </span>
                    </div>
                  </div>
                  <Waveform active={speaking} bars={22} />
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSpeaking(!speaking)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: speaking ? "rgba(239,68,68,.1)" : "rgba(52,211,153,.1)", border: `1px solid ${speaking ? C.red + "35" : C.green + "35"}`, color: speaking ? C.red : C.green }}>
                      {speaking ? <><XCircle size={11} /> Pause</> : <><Play size={11} /> Resume</>}
                    </button>
                  </div>
                </Card>

                {/* Camera panel */}
                <Card className="p-5 flex flex-col items-center gap-3" style={{ background: C.surface }}>
                  <div className="w-full rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ height: 112, background: "linear-gradient(135deg,#0D1117,#1C2433)", border: `1px solid ${C.border}` }}>
                    {camOn ? (
                      <>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white"
                          style={{ background: C.grad }}>DS</div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.3)" }}>
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.green }} />
                          <span className="text-xs font-bold" style={{ color: C.green }}>Live</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Eye size={22} style={{ color: C.muted }} />
                        <span className="text-xs" style={{ color: C.muted }}>Camera Off</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white">Dhruti Shah</div>
                  <Waveform active={micOn} bars={22} />
                  <div className="flex items-center gap-3">
                    <button onClick={() => setMicOn(!micOn)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: micOn ? "rgba(168,85,247,.12)" : "rgba(239,68,68,.12)", border: `1px solid ${micOn ? C.purple + "40" : C.red + "40"}`, color: micOn ? C.purple : C.red }}>
                      <Mic size={13} />{micOn ? "Mute" : "Unmute"}
                    </button>
                    <button onClick={() => setCamOn(!camOn)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: camOn ? "rgba(34,211,238,.1)" : "rgba(239,68,68,.12)", border: `1px solid ${camOn ? C.cyan + "40" : C.red + "40"}`, color: camOn ? C.cyan : C.red }}>
                      <Eye size={13} />{camOn ? "Hide" : "Show"}
                    </button>
                  </div>
                </Card>
              </div>

              {/* Current question + follow-up */}
              <Card className="p-5"
                style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.04))", border: "1px solid rgba(168,85,247,.32)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pill label={`Q${qIndex + 1} / ${QUESTIONS_BANK.length}`} color={C.purple} />
                    <Pill label={currentQ.type} color={typeInfo.color} />
                  </div>
                  <button onClick={() => setShowFollow(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: showFollow ? "rgba(34,211,238,.15)" : "rgba(34,211,238,.06)", border: "1px solid rgba(34,211,238,.25)", color: C.cyan }}>
                    <Sparkles size={11} /> {showFollow ? "Hide" : "AI Follow-up"}
                  </button>
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">{currentQ.q}</p>
                {showFollow && (
                  <div className="mt-3 p-3.5 rounded-xl flex items-start gap-2.5"
                    style={{ background: "rgba(34,211,238,.07)", border: "1px solid rgba(34,211,238,.2)" }}>
                    <Sparkles size={13} style={{ color: C.cyan, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div className="text-xs font-bold mb-1" style={{ color: C.cyan }}>AI Follow-up Question</div>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{currentQ.follow}</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Live Transcript */}
              <Card className="p-5">
                <SecHead icon={<FileText size={15} />} title="Live Transcript" sub="Real-time conversation log" />
                <div ref={chatRef} className="space-y-3 overflow-y-auto" style={{ maxHeight: 200, scrollbarWidth: "none" }}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: m.role === "ai" ? "rgba(168,85,247,.2)" : "rgba(34,211,238,.15)",
                          border: `1px solid ${m.role === "ai" ? "rgba(168,85,247,.3)" : "rgba(34,211,238,.25)"}`,
                        }}>
                        {m.role === "ai" ? <Brain size={10} style={{ color: C.purple }} /> : <User size={10} style={{ color: C.cyan }} />}
                      </div>
                      <div className="max-w-[76%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
                        style={{
                          background: m.role === "ai" ? C.surface : `linear-gradient(135deg,${C.purple}CC,${C.cyan}CC)`,
                          color: "#F9FAFB",
                          borderBottomLeftRadius: m.role === "ai" ? 4 : 16,
                          borderBottomRightRadius: m.role === "user" ? 4 : 16,
                        }}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input value={inputMsg} onChange={e => setInputMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMsg()}
                    placeholder="Type your answer, or speak using the microphone…"
                    className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  <button onClick={() => setMicOn(v => !v)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: micOn ? "rgba(168,85,247,.15)" : C.surface, border: `1px solid ${micOn ? C.purple + "50" : C.border}` }}>
                    <Mic size={14} style={{ color: micOn ? C.purple : C.muted }} />
                  </button>
                  <button onClick={sendMsg}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 flex-shrink-0"
                    style={{ background: C.grad }}>
                    <ArrowRight size={12} /> Send
                  </button>
                </div>
              </Card>

              {/* Notes panel */}
              <Card className="p-5">
                <SecHead icon={<BookMarked size={15} />} title="Session Notes"
                  sub="Your private notepad during the interview"
                  action={<Pill label={`${notes.split("\n").filter(Boolean).length} lines`} color={C.muted} />} />
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="• Key points to remember&#10;• Terms to research later&#10;• Follow-up topics"
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-xl text-xs outline-none resize-none leading-relaxed"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="w-68 flex-shrink-0 overflow-y-auto p-4 space-y-4 border-l"
              style={{ width: 268, borderColor: C.border, scrollbarWidth: "none" }}>
              {/* Question Progress */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Question Progress</span>
                  <span className="text-xs font-bold" style={{ color: C.purple }}>{qIndex + 1}/{QUESTIONS_BANK.length}</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full mb-3" style={{ background: C.border }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${((qIndex) / QUESTIONS_BANK.length) * 100}%`, background: C.grad }} />
                </div>
                <div className="space-y-1.5 mb-3">
                  {QUESTIONS_BANK.map((q, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
                      style={{
                        background: i === qIndex ? "rgba(168,85,247,.1)" : i < qIndex ? "rgba(52,211,153,.06)" : C.surface,
                        border: `1px solid ${i === qIndex ? C.purple + "40" : i < qIndex ? C.green + "30" : C.border}`,
                      }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: i < qIndex ? C.green : i === qIndex ? C.purple : C.border, color: i <= qIndex ? "#fff" : C.muted }}>
                        {i < qIndex ? <Check size={9} /> : i + 1}
                      </div>
                      <span className="text-xs flex-1 truncate" style={{ color: i === qIndex ? C.text : C.muted }}>{q.type}</span>
                      {i === qIndex && <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: C.purple }} />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={nextQuestion}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
                    Skip
                  </button>
                  <button onClick={nextQuestion}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1"
                    style={{ background: C.grad }}>
                    <ArrowRight size={11} /> Next
                  </button>
                </div>
              </Card>

              {/* Interview Tips */}
              <Card className="p-4">
                <SecHead icon={<Lightbulb size={14} />} title="Interview Tips" />
                <div className="space-y-2">
                  {[
                    { tip: "Use the STAR method for behavioural answers", icon: "⭐" },
                    { tip: "Think out loud — process matters as much as the answer", icon: "💭" },
                    { tip: "Ask clarifying questions before jumping in", icon: "❓" },
                    { tip: "Keep eye contact with the camera", icon: "👁️" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl"
                      style={{ background: "rgba(168,85,247,.06)", border: "1px solid rgba(168,85,247,.14)" }}>
                      <span className="flex-shrink-0">{t.icon}</span>
                      <span className="text-xs leading-snug" style={{ color: C.muted }}>{t.tip}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Confidence Meter */}
              <Card className="p-4">
                <SecHead icon={<Zap size={14} />} title="Live Confidence" sub="AI-detected real-time signals" />
                <div className="space-y-3">
                  {[
                    { label: "Clarity", value: 78, color: C.purple },
                    { label: "Confidence", value: 65, color: C.cyan },
                    { label: "Pace", value: 82, color: C.green },
                    { label: "Engagement", value: 71, color: C.amber },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: C.muted }}>{m.label}</span>
                        <span className="font-bold" style={{ color: m.color }}>{m.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                        <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color, boxShadow: `0 0 6px ${m.color}60` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Speaking Speed */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Speaking Speed</span>
                  <span className="text-xs font-black" style={{ color: C.cyan }}>142 wpm</span>
                </div>
                <div className="relative h-3 rounded-full mb-2" style={{ background: C.border }}>
                  <div className="absolute inset-y-0 left-[30%] right-[30%] rounded-full opacity-20"
                    style={{ background: C.green }} />
                  <div className="h-full rounded-full transition-all"
                    style={{ width: "56%", background: `linear-gradient(90deg,${C.green},${C.cyan})` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                    style={{ left: "54%", background: C.cyan }} />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
                  <span>60</span>
                  <span style={{ color: C.green }}>Ideal: 120–160 wpm</span>
                  <span>200</span>
                </div>
              </Card>

              {/* Time remaining + quick stats */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Session Stats</span>
                  <span className="text-xs font-mono font-black" style={{ color: C.cyan }}>{timer.display}</span>
                </div>
                <div className="space-y-0">
                  {[
                    { label: "Questions Done", value: `${qIndex}/${QUESTIONS_BANK.length}`, color: C.purple },
                    { label: "Avg Response Time", value: "1m 42s", color: C.green },
                    { label: "Filler Words", value: "8 detected", color: C.amber },
                    { label: "AI Score (so far)", value: "74%", color: C.cyan },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center py-2 border-b last:border-b-0"
                      style={{ borderColor: C.border }}>
                      <span className="text-xs" style={{ color: C.muted }}>{s.label}</span>
                      <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ── CODING CHALLENGE TAB ── */}
        {mainTab === "coding" && (
          <>
            <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none" }}>
              <CodingChallengePanel />
            </div>
            {/* Slim coding sidebar */}
            <div className="w-64 flex-shrink-0 overflow-y-auto p-4 space-y-4 border-l"
              style={{ borderColor: C.border, scrollbarWidth: "none" }}>
              {/* AI observer */}
              <Card className="p-4 flex flex-col items-center gap-3"
                style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.04))", border: "1px solid rgba(168,85,247,.25)" }}>
                <AIAvatar speaking={speaking} size={60} />
                <div className="text-center">
                  <div className="text-xs font-bold text-white">AI Observing</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>Watching your approach</div>
                </div>
                <Waveform active={speaking} bars={14} />
              </Card>

              {/* Coding Tips */}
              <Card className="p-4">
                <SecHead icon={<Lightbulb size={14} />} title="Coding Tips" />
                <div className="space-y-2">
                  {[
                    { tip: "Clarify constraints before coding", icon: "📐" },
                    { tip: "Start with brute force, optimise later", icon: "🔄" },
                    { tip: "Write clean, readable variable names", icon: "✏️" },
                    { tip: "Handle edge cases explicitly", icon: "⚠️" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl"
                      style={{ background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.12)" }}>
                      <span className="text-sm flex-shrink-0">{t.icon}</span>
                      <span className="text-xs leading-snug" style={{ color: C.muted }}>{t.tip}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Complexity guide */}
              <Card className="p-4">
                <SecHead icon={<BarChart2 size={14} />} title="Big O Quick Ref" />
                <div className="space-y-1.5">
                  {[
                    { label: "O(1)", desc: "Constant", color: C.green },
                    { label: "O(log n)", desc: "Logarithmic", color: C.cyan },
                    { label: "O(n)", desc: "Linear", color: C.purple },
                    { label: "O(n log n)", desc: "Linearithmic", color: C.amber },
                    { label: "O(n²)", desc: "Quadratic", color: C.red },
                  ].map(c => (
                    <div key={c.label} className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold" style={{ color: c.color }}>{c.label}</span>
                      <span style={{ color: C.muted }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick stats */}
              <Card className="p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-white">Coding Stats</span>
                  <span className="text-xs font-mono font-bold" style={{ color: C.cyan }}>{timer.display}</span>
                </div>
                {[
                  { label: "Lines Written", value: "9", color: C.purple },
                  { label: "Test Cases", value: "2/3 Pass", color: C.green },
                  { label: "Complexity", value: "O(n)", color: C.cyan },
                ].map(s => (
                  <div key={s.label} className="flex justify-between py-1.5 border-b last:border-b-0"
                    style={{ borderColor: C.border }}>
                    <span className="text-xs" style={{ color: C.muted }}>{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MockInterviewPage({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState<"setup" | "active">("setup");
  const [cfg, setCfg] = useState<any>(null);
  return stage === "setup"
    ? <InterviewSetup onStart={c => { setCfg(c); setStage("active"); }} />
    : <ActiveInterview cfg={cfg} onEnd={onFinish} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4: AI EVALUATION & REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

function HalfGauge({ value, size, color, label }: { value: number; size: number; color: string; label: string }) {
  const r = (size / 2) - 8;
  const circ = Math.PI * r;
  const fill = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path d={`M 8 ${size / 2} A ${r} ${r} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none" stroke={C.border} strokeWidth={8} strokeLinecap="round" />
        <path d={`M 8 ${size / 2} A ${r} ${r} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${fill} ${circ - fill}`}
          style={{ filter: `drop-shadow(0 0 5px ${color}70)` }} />
        <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fill={C.text}
          style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Inter',sans-serif" }}>{value}</text>
      </svg>
      <span className="text-xs text-center" style={{ color: C.muted }}>{label}</span>
    </div>
  );
}

const SCORE_CARDS = [
  { label: "Technical Knowledge", score: 76, grade: "B+", color: C.cyan, icon: <Code2 size={16} /> },
  { label: "Communication", score: 88, grade: "A", color: C.green, icon: <Mic size={16} /> },
  { label: "Confidence", score: 78, grade: "B+", color: C.purple, icon: <Zap size={16} /> },
  { label: "Problem Solving", score: 73, grade: "B", color: C.amber, icon: <Brain size={16} /> },
  { label: "Body Language", score: 82, grade: "A−", color: C.pink, icon: <User size={16} /> },
  { label: "Voice Clarity", score: 91, grade: "A+", color: C.teal, icon: <Sparkles size={16} /> },
  { label: "Logical Depth", score: 74, grade: "B", color: C.indigo, icon: <Layers size={16} /> },
  { label: "Professionalism", score: 87, grade: "A", color: C.blue, icon: <Award size={16} /> },
];

const RADAR_DATA = [
  { axis: "Technical", A: 76 }, { axis: "Communication", A: 88 },
  { axis: "Confidence", A: 78 }, { axis: "Solving", A: 73 },
  { axis: "Clarity", A: 91 }, { axis: "Logic", A: 74 },
];

const TREND_DATA = [
  { session: "S1", score: 58 }, { session: "S2", score: 63 },
  { session: "S3", score: 67 }, { session: "S4", score: 71 },
  { session: "S5", score: 76 }, { session: "S6", score: 81 },
];

function ReportsPage({ onRetake }: { onRetake: () => void }) {
  const overallScore = 81;

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <ClipboardList size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Interview Evaluation Report</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>
              AI-generated analysis of your <Grad>Mock Interview Session</Grad>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Share2 size={13} /> Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        {/* Overall score banner */}
        <div className="p-6 rounded-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,.15) 0%,rgba(34,211,238,.08) 100%)", border: "1px solid rgba(168,85,247,.35)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: C.grad, transform: "translate(30%,-30%)" }} />
          <div className="flex items-center gap-8">
            {/* Big score */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="text-7xl font-black" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {overallScore}
              </div>
              <div className="text-xs font-medium" style={{ color: C.muted }}>out of 100</div>
              <div className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(52,211,153,.15)", border: "1px solid rgba(52,211,153,.35)", color: C.green }}>
                Top 18% 🏆
              </div>
            </div>
            {/* Meta info */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Interview Type", value: "Technical", icon: <Code2 size={14} />, color: C.cyan },
                { label: "Difficulty", value: "Medium", icon: <Target size={14} />, color: C.amber },
                { label: "Duration", value: "28m 14s", icon: <Clock size={14} />, color: C.purple },
                { label: "Questions", value: "6 / 6", icon: <Check size={14} />, color: C.green },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl"
                  style={{ background: "rgba(31,41,55,.6)", border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-1.5 mb-1.5" style={{ color: s.color }}>{s.icon}<span className="text-xs">{s.label}</span></div>
                  <div className="text-sm font-black text-white">{s.value}</div>
                </div>
              ))}
            </div>
            {/* Half gauges */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <HalfGauge value={overallScore} size={110} color={C.purple} label="Overall" />
              <HalfGauge value={88} size={90} color={C.green} label="Comm." />
              <HalfGauge value={76} size={90} color={C.cyan} label="Tech." />
            </div>
          </div>
        </div>

        {/* Score cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SCORE_CARDS.map(sc => (
            <Card key={sc.label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${sc.color}18`, color: sc.color }}>{sc.icon}</div>
                <div className="text-right">
                  <div className="text-xl font-black text-white">{sc.score}</div>
                  <div className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${sc.color}15`, color: sc.color }}>{sc.grade}</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-white mb-2">{sc.label}</div>
              <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: `${sc.score}%`, background: sc.color, boxShadow: `0 0 6px ${sc.color}60` }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Charts row — Radar + Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Radar */}
          <Card className="p-5">
            <SecHead icon={<Crosshair size={16} />} title="Skill Radar" sub="Multi-dimension performance analysis" />
            <div className="grid grid-cols-2 gap-0 items-center">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart id="rp-skills-radar" data={RADAR_DATA} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
                  <PolarGrid stroke={C.border} />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 9 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="A" stroke={C.purple} fill={C.purple} fillOpacity={0.22} strokeWidth={2} name="Score" />
                  <Tooltip content={<ChartTip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="space-y-2 pl-2">
                {RADAR_DATA.map(d => (
                  <div key={d.axis}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: C.muted }}>{d.axis}</span>
                      <span className="font-bold text-white">{d.A}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${d.A}%`, background: C.purple }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Horizontal bar breakdown */}
          <Card className="p-5">
            <SecHead icon={<BarChart2 size={16} />} title="Score Breakdown" sub="All categories ranked" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="rp-score-bar" data={SCORE_CARDS.map(s => ({ name: s.label.split(" ")[0], score: s.score, fill: s.color }))}
                layout="vertical" margin={{ top: 4, right: 20, left: -4, bottom: 4 }} barSize={9}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} width={66} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="score" name="Score" radius={[0, 5, 5, 0]}>
                  {SCORE_CARDS.map((s, i) => <Cell key={`score-cell-${s.label || i}`} fill={s.color} fillOpacity={0.88} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Progress Timeline + Performance Trend */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Performance Trend (wider) */}
          <Card className="md:col-span-3 p-5">
            <SecHead icon={<TrendingUp size={16} />} title="Performance Trend"
              sub="Score improvement across 6 mock sessions"
              action={
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)" }}>
                  <TrendingUp size={11} style={{ color: C.green }} />
                  <span className="text-xs font-bold" style={{ color: C.green }}>+23 pts</span>
                </div>
              } />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart id="rp-trend-area" data={TREND_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="session" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[45, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="score" stroke={C.purple} fill={C.purple} fillOpacity={0.18} strokeWidth={2.5} name="Overall Score"
                  dot={{ fill: C.purple, strokeWidth: 2, r: 4, stroke: C.bg }} activeDot={{ r: 6, stroke: C.purple, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Progress Timeline (narrower) */}
          <Card className="md:col-span-2 p-5">
            <SecHead icon={<Calendar size={16} />} title="Progress Timeline" sub="Session history" />
            <div className="relative pl-5">
              <div className="absolute left-[7px] top-1 bottom-1 w-0.5 rounded-full"
                style={{ background: `linear-gradient(to bottom,${C.purple},${C.cyan}30)` }} />
              <div className="space-y-4">
                {[
                  { session: "Session 6", date: "Today", score: 81, grade: "A−", color: C.purple, note: "Technical · Medium · 28m" },
                  { session: "Session 5", date: "3 days ago", score: 76, grade: "B+", color: C.cyan, note: "Behavioral · Easy · 22m" },
                  { session: "Session 4", date: "1 week ago", score: 71, grade: "B", color: C.green, note: "Mixed · Medium · 35m" },
                  { session: "Session 3", date: "2 weeks ago", score: 67, grade: "C+", color: C.amber, note: "HR · Easy · 20m" },
                  { session: "Session 2", date: "3 weeks ago", score: 63, grade: "C", color: C.amber, note: "Technical · Hard · 40m" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 relative z-10"
                      style={{ background: i === 0 ? s.color : C.bg, borderColor: s.color }} />
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white">{s.session}</span>
                        <span className="text-xs font-black px-1.5 py-0.5 rounded-md"
                          style={{ background: `${s.color}18`, color: s.color }}>{s.grade}</span>
                      </div>
                      <div className="text-xs" style={{ color: C.muted }}>{s.note}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full" style={{ background: C.border }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                        </div>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: s.color }}>{s.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Strengths + Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5">
            <SecHead icon={<CheckCircle2 size={16} />} title="Strengths" sub="Areas where you excelled" />
            <div className="space-y-2.5">
              {[
                { s: "Excellent articulation and sentence structure", score: 91 },
                { s: "Confident tone throughout the session", score: 88 },
                { s: "Strong knowledge of data structures fundamentals", score: 85 },
                { s: "Professional demeanour and presentation", score: 87 },
                { s: "Effective use of real-world examples", score: 83 },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)" }}>
                  <CheckCircle2 size={14} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                  <div className="flex-1">
                    <div className="text-xs text-white leading-snug mb-1">{item.s}</div>
                    <div className="h-1 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: C.green }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: C.green }}>{item.score}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<AlertTriangle size={16} />} title="Areas to Improve" sub="Focus these before your next interview" />
            <div className="space-y-2.5">
              {[
                { s: "System design answers lacked depth", score: 58 },
                { s: "Filler words used frequently (um, uh)", score: 62 },
                { s: "Rushed through Dynamic Programming explanation", score: 55 },
                { s: "Could be more concise in HR answers", score: 66 },
                { s: "Missing edge cases in coding problem", score: 60 },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)" }}>
                  <AlertTriangle size={14} style={{ color: C.red, flexShrink: 0, marginTop: 1 }} />
                  <div className="flex-1">
                    <div className="text-xs text-white leading-snug mb-1">{item.s}</div>
                    <div className="h-1 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: C.red }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: C.red }}>{item.score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Suggestions */}
        <Card className="p-5">
          <SecHead icon={<Sparkles size={16} />} title="AI Improvement Suggestions"
            sub="Personalised recommendations based on your session"
            action={<Pill label="4 suggestions" color={C.purple} />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Practise System Design Patterns", icon: "🏗️", color: C.cyan,
                detail: "Study HLD concepts: load balancing, caching, sharding, and consistent hashing.",
                impact: "High Impact", est: "+12 pts",
              },
              {
                title: "Reduce Filler Word Habit", icon: "🎙️", color: C.purple,
                detail: "Record yourself answering questions. Pause instead of using um/uh.",
                impact: "Medium Impact", est: "+7 pts",
              },
              {
                title: "Deep Dive: Dynamic Programming", icon: "📚", color: C.amber,
                detail: "Solve 20 DP problems on LeetCode (easy → medium). Focus on memoisation vs tabulation.",
                impact: "High Impact", est: "+10 pts",
              },
              {
                title: "Structure HR Answers with STAR", icon: "⭐", color: C.green,
                detail: "Rewrite your top-5 STAR stories with a 2-minute time limit each.",
                impact: "Medium Impact", est: "+8 pts",
              },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl flex items-start gap-3"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}25` }}>
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white mb-1">{s.title}</div>
                  <div className="text-xs leading-relaxed mb-2" style={{ color: C.muted }}>{s.detail}</div>
                  <div className="flex items-center gap-2">
                    <Pill label={s.impact} color={s.color} />
                    <span className="text-xs font-bold" style={{ color: C.green }}>{s.est}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Common Mistakes */}
          <Card className="p-4">
            <SecHead icon={<XCircle size={14} />} title="Common Mistakes" sub="This session" />
            <div className="space-y-2">
              {[
                { m: "Skipped edge case analysis", count: 2 },
                { m: "Overexplained simple concepts", count: 3 },
                { m: "Used filler words 18 times", count: 18 },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl"
                  style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(239,68,68,.2)", color: C.red }}>{e.count}</div>
                  <span className="text-xs" style={{ color: C.muted }}>{e.m}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Learning */}
          <Card className="p-4">
            <SecHead icon={<BookOpen size={14} />} title="Recommended Learning" sub="Curated for you" />
            <div className="space-y-2">
              {[
                { t: "Grokking System Design", tag: "Course" },
                { t: "FAANG DP Patterns — 50 Problems", tag: "Practice" },
                { t: "Toastmasters Public Speaking", tag: "Soft Skills" },
                { t: "Clean Code by Robert C. Martin", tag: "Book" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ArrowRight size={10} style={{ color: C.purple, flexShrink: 0 }} />
                  <span className="text-xs flex-1" style={{ color: C.text }}>{r.t}</span>
                  <Pill label={r.tag} color={C.purple} />
                </div>
              ))}
            </div>
          </Card>

          {/* Action Plan */}
          <Card className="p-4">
            <SecHead icon={<Zap size={14} />} title="Action Plan" sub="Next 30 days" />
            <div className="space-y-2">
              {[
                { task: "Solve 5 system design problems", due: "Week 1", color: C.cyan },
                { task: "30 DP questions on LeetCode", due: "Week 2", color: C.purple },
                { task: "Record 5 mock HR answers", due: "Week 3", color: C.green },
                { task: "Take Full Mock Interview", due: "Week 4", color: C.amber },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                  <div>
                    <div className="text-xs text-white">{a.task}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{a.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Interview Recommendation */}
          <Card className="p-4"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,.1),rgba(34,211,238,.06))", border: "1px solid rgba(168,85,247,.3)" }}>
            <SecHead icon={<Target size={14} />} title="Next Mock" sub="AI recommendation" />
            <div className="space-y-2 mb-4">
              {[
                { label: "Type", value: "System Design", color: C.cyan },
                { label: "Difficulty", value: "Hard", color: C.red },
                { label: "Duration", value: "60 min", color: C.purple },
                { label: "Focus", value: "HLD + Scalability", color: C.amber },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span style={{ color: C.muted }}>{s.label}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button onClick={onRetake}
              className="w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
              style={{ background: C.grad }}>
              <Play size={11} fill="white" /> Start Now
            </button>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 pb-4">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
            <Share2 size={15} /> Share Report
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
            <Download size={15} /> Download PDF
          </button>
          <button onClick={onRetake}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(168,85,247,.15)", border: "1px solid rgba(168,85,247,.4)", color: C.purple }}>
            <RefreshCw size={15} /> Retake Interview
          </button>
          <button onClick={onRetake}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: C.grad, boxShadow: "0 4px 20px rgba(168,85,247,.35)" }}>
            <Plus size={15} /> Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED UTILITIES FOR NEW PAGES
// ═══════════════════════════════════════════════════════════════════════════════

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative inline-flex items-center rounded-full flex-shrink-0 transition-all duration-200"
      style={{ width: 44, height: 24, background: on ? C.purple : C.border, border: "none", padding: 0 }}>
      <div className="absolute rounded-full transition-all duration-200"
        style={{ width: 18, height: 18, background: "#fff", left: on ? 22 : 4, boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
    </button>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const WEEK_ACTIVITY = [
  { day: "Mon", topics: 4, mock: 1 }, { day: "Tue", topics: 6, mock: 0 },
  { day: "Wed", topics: 3, mock: 1 }, { day: "Thu", topics: 7, mock: 0 },
  { day: "Fri", topics: 5, mock: 2 }, { day: "Sat", topics: 8, mock: 1 },
  { day: "Sun", topics: 2, mock: 0 },
];
const MONTHLY_PROG = [
  { week: "Week 1", progress: 42, target: 60 }, { week: "Week 2", progress: 58, target: 65 },
  { week: "Week 3", progress: 67, target: 70 }, { week: "Week 4", progress: 79, target: 75 },
];
const SKILLS_GROWTH = [
  { month: "Mar", DSA: 38, System: 20, OOP: 55, SQL: 45 },
  { month: "Apr", DSA: 48, System: 28, OOP: 62, SQL: 52 },
  { month: "May", DSA: 57, System: 35, OOP: 70, SQL: 58 },
  { month: "Jun", DSA: 63, System: 44, OOP: 75, SQL: 62 },
  { month: "Jul", DSA: 72, System: 52, OOP: 82, SQL: 68 },
  { month: "Aug", DSA: 78, System: 60, OOP: 88, SQL: 74 },
];
const ACHIEVEMENTS_LIST = [
  { title: "First Mock", icon: "🎯", earned: true, date: "Jun 12" },
  { title: "7-Day Streak", icon: "🔥", earned: true, date: "Jul 3" },
  { title: "DSA Beginner", icon: "⚡", earned: true, date: "May 28" },
  { title: "Resume Pro", icon: "📄", earned: true, date: "Apr 15" },
  { title: "LinkedIn Ready", icon: "💼", earned: true, date: "May 1" },
  { title: "30-Day Streak", icon: "🏆", earned: false, date: null },
  { title: "Perfect Score", icon: "💯", earned: false, date: null },
  { title: "Top 10%", icon: "🌟", earned: false, date: null },
];
const RECENT_ACTS = [
  { icon: <Mic size={13} />, label: "Technical Mock Interview — Score: 81", time: "2h ago", color: C.purple },
  { icon: <BookOpen size={13} />, label: "DSA: Binary Trees module — 68%", time: "5h ago", color: C.cyan },
  { icon: <FileText size={13} />, label: "Resume AI Score updated — 87/100", time: "Yesterday", color: C.green },
  { icon: <GraduationCap size={13} />, label: "Web Dev Domain — 72% complete", time: "2 days ago", color: C.amber },
  { icon: <Linkedin size={13} />, label: "LinkedIn Profile Analysis — 74", time: "3 days ago", color: C.blue },
  { icon: <FolderOpen size={13} />, label: "E-commerce Project analyzed — 82", time: "4 days ago", color: C.pink },
];

const CAREER_GOALS_LIST = [
  { id: "sde", label: "Software Engineer", icon: "💻", color: C.purple, companies: "Google · Meta · Amazon" },
  { id: "fe", label: "Frontend Developer", icon: "🎨", color: C.cyan, companies: "Flipkart · Swiggy · Zomato" },
  { id: "ds", label: "Data Scientist", icon: "📊", color: C.green, companies: "Microsoft · IBM · Google" },
  { id: "devops", label: "DevOps Engineer", icon: "⚙️", color: C.amber, companies: "AWS · Azure · GCP" },
  { id: "ml", label: "ML Engineer", icon: "🤖", color: C.pink, companies: "OpenAI · HuggingFace · NVIDIA" },
];
const ROADMAP_PHASES_LIST = [
  { phase: 1, title: "Foundation Building", weeks: "Weeks 1–3", status: "done",
    items: ["Big O notation mastery", "Arrays, Strings, Linked Lists", "Basic SQL queries", "Git & GitHub basics"] },
  { phase: 2, title: "Core Data Structures", weeks: "Weeks 4–7", status: "current",
    items: ["Trees & Graphs", "Hash Maps & Sets", "Stacks & Queues", "Binary Search patterns"] },
  { phase: 3, title: "Advanced Algorithms", weeks: "Weeks 8–12", status: "upcoming",
    items: ["Dynamic Programming", "Graph algorithms (BFS/DFS)", "Greedy approaches", "Divide & Conquer"] },
  { phase: 4, title: "System Design", weeks: "Weeks 13–16", status: "upcoming",
    items: ["Scalability principles", "Database design patterns", "API design & REST", "Caching strategies"] },
  { phase: 5, title: "Interview Preparation", weeks: "Weeks 17–20", status: "upcoming",
    items: ["Mock interviews (×10)", "Behavioural prep (STAR)", "Resume finalization", "Company research"] },
];
const SKILL_GAP_RADAR = [
  { axis: "DSA", current: 78, target: 90 },
  { axis: "System Design", current: 45, target: 85 },
  { axis: "OOP", current: 88, target: 90 },
  { axis: "SQL", current: 72, target: 80 },
  { axis: "Behavioral", current: 65, target: 88 },
  { axis: "Communication", current: 80, target: 92 },
];

const NOTIFICATIONS_DATA = [
  { id: 1, type: "interview", title: "Mock Interview Reminder", body: "Your scheduled Technical mock interview starts in 30 minutes.", time: "10 min ago", read: false, icon: <Mic size={14} />, color: C.purple },
  { id: 2, type: "achievement", title: "Achievement Unlocked!", body: "You earned the '7-Day Streak' badge. Keep it going!", time: "2h ago", read: false, icon: <Award size={14} />, color: C.amber },
  { id: 3, type: "ai", title: "AI Suggestion Available", body: "New personalised study plan generated based on your mock interview results.", time: "3h ago", read: false, icon: <Sparkles size={14} />, color: C.cyan },
  { id: 4, type: "progress", title: "Weekly Progress Report", body: "You completed 78% of your weekly goal. Great work this week!", time: "5h ago", read: true, icon: <BarChart3 size={14} />, color: C.green },
  { id: 5, type: "resume", title: "Resume Score Updated", body: "Your resume score improved from 72 to 87 after the latest AI analysis.", time: "Yesterday", read: true, icon: <FileText size={14} />, color: C.blue },
  { id: 6, type: "interview", title: "Interview Results Ready", body: "Your Behavioral round evaluation is now available in Reports.", time: "Yesterday", read: true, icon: <ClipboardList size={14} />, color: C.purple },
  { id: 7, type: "study", title: "Study Reminder", body: "You haven't studied today yet. Your streak is at risk — 14 days!", time: "2 days ago", read: true, icon: <BookOpen size={14} />, color: C.red },
  { id: 8, type: "ai", title: "AI Roadmap Updated", body: "Your personalized roadmap has been updated based on your latest performance.", time: "3 days ago", read: true, icon: <Map size={14} />, color: C.indigo },
  { id: 9, type: "progress", title: "Monthly Milestone Reached", body: "You hit 75% overall progress! You're in the top 22% of all users.", time: "4 days ago", read: true, icon: <Trophy size={14} />, color: C.amber },
  { id: 10, type: "resume", title: "LinkedIn Profile Tips", body: "AI found 5 improvements to boost your LinkedIn score from 74 to 86.", time: "5 days ago", read: true, icon: <Linkedin size={14} />, color: C.cyan },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5: PROGRESS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function ProgressDashboardPage() {
  const [range, setRange] = useState<"week" | "month" | "all">("week");
  const overallPct = 68; const streak = 14;

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <BarChart3 size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Progress Dashboard</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Your complete learning journey with <Grad>AI-powered insights</Grad>.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {(["week", "month", "all"] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: range === r ? C.grad : "transparent", color: range === r ? "#fff" : C.muted }}>
                  {r === "week" ? "This Week" : r === "month" ? "This Month" : "All Time"}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Overall Progress", value: `${overallPct}%`, icon: <TrendingUp size={16} />, color: C.purple, sub: "Across all modules", badge: "+8% this week", trend: "+8%" },
            { label: "Mock Interviews", value: "6 done", icon: <Mic size={16} />, color: C.cyan, sub: "Avg score: 74/100", badge: "Last: 81", trend: "+12pts" },
            { label: "Study Streak", value: `${streak} days`, icon: <Flame size={16} />, color: C.amber, sub: "Personal best: 14 days", badge: "🔥 On fire!", trend: "Active" },
            { label: "Goals Completed", value: "7 / 10", icon: <Target size={16} />, color: C.green, sub: "70% completion rate", badge: "3 upcoming", trend: "70%" },
          ].map(s => (
            <Card key={s.label} className="p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5"
                style={{ background: s.color, transform: "translate(30%, -30%)" }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${s.color}15`, color: s.color }}>{s.badge}</span>
              </div>
              <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-bold text-white mb-1">{s.label}</div>
              <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
              <div className="mt-3 h-1 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: s.trend.includes("%") ? s.trend : "60%", background: s.color, maxWidth: "100%" }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Goal Completion Percentage — prominent visual */}
        <Card className="p-5"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,.07),rgba(34,211,238,.04))", border: "1px solid rgba(168,85,247,.22)" }}>
          <div className="flex items-center justify-between mb-4">
            <SecHead icon={<Target size={16} />} title="Goal Completion" sub="Progress across all 10 active goals" />
            <Pill label="7 / 10 Done" color={C.green} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { goal: "Complete DSA Module", pct: 100, done: true, color: C.green },
              { goal: "Take 5 Mock Interviews", pct: 100, done: true, color: C.green },
              { goal: "Resume Score 80+", pct: 100, done: true, color: C.green },
              { goal: "LinkedIn Score 70+", pct: 100, done: true, color: C.green },
              { goal: "System Design Basics", pct: 100, done: true, color: C.green },
              { goal: "3 Portfolio Projects", pct: 100, done: true, color: C.green },
              { goal: "HR Interview Practice", pct: 100, done: true, color: C.green },
              { goal: "Advanced DP Patterns", pct: 55, done: false, color: C.purple },
              { goal: "10 Mock Interviews", pct: 60, done: false, color: C.cyan },
              { goal: "Final System Design", pct: 20, done: false, color: C.amber },
            ].map((g, i) => (
              <div key={i} className="p-3 rounded-xl flex flex-col gap-2"
                style={{ background: g.done ? "rgba(52,211,153,.06)" : C.surface, border: `1px solid ${g.done ? C.green + "30" : C.border}` }}>
                <div className="flex items-center gap-1.5">
                  {g.done
                    ? <CheckCircle2 size={12} style={{ color: C.green, flexShrink: 0 }} />
                    : <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: g.color }} />}
                  <span className="text-xs font-medium leading-tight" style={{ color: g.done ? C.green : C.text }}>{g.goal}</span>
                </div>
                {!g.done && (
                  <>
                    <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
                    </div>
                    <div className="text-xs font-bold" style={{ color: g.color }}>{g.pct}%</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Ring progress + weekly activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 flex flex-col items-center gap-4"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.25)" }}>
            <div className="relative" style={{ width: 136, height: 136 }}>
              <svg width={136} height={136} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={68} cy={68} r={52} fill="none" stroke={C.border} strokeWidth={12} />
                <circle cx={68} cy={68} r={52} fill="none" stroke="url(#pd_ringGrad)" strokeWidth={12}
                  strokeLinecap="round" strokeDasharray={`${(overallPct / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`} />
                <defs>
                  <linearGradient id="pd_ringGrad" x1="1" y1="0" x2="0" y2="1">
                    <stop stopColor={C.purple} /><stop offset="1" stopColor={C.cyan} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-black" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{overallPct}%</div>
                <div className="text-xs" style={{ color: C.muted }}>Overall</div>
              </div>
            </div>
            <div className="text-sm font-bold text-white text-center">Overall Learning Progress</div>
            <div className="w-full space-y-2">
              {[["DSA & Algo", 68, C.purple], ["Domain Skills", 44, C.cyan], ["Interview Prep", 81, C.green]].map(([l, p, c]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{l}</span><span className="font-bold" style={{ color: c as string }}>{p}%</span></div>
                  <div className="h-1.5 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${p}%`, background: c as string }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 p-5">
            <SecHead icon={<BarChart3 size={16} />} title="Weekly Activity" sub="Topics studied vs mock interviews per day" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart id="pd-activity-bar" data={WEEK_ACTIVITY} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="topics" name="Topics" radius={[4, 4, 0, 0]} fill={C.purple} fillOpacity={0.85} />
                <Bar dataKey="mock" name="Mocks" radius={[4, 4, 0, 0]} fill={C.cyan} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              {[["Topics", C.purple], ["Mock Interviews", C.cyan]].map(([l, c]) => (
                <div key={l as string} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c as string }} />{l}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skills growth + monthly progress */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <Card className="md:col-span-3 p-5">
            <SecHead icon={<TrendingUp size={16} />} title="Skills Growth Timeline" sub="6-month proficiency improvement per subject" />
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart id="pd-skills-area" data={SKILLS_GROWTH} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="DSA" stroke={C.purple} fill={C.purple} fillOpacity={0.14} strokeWidth={2} name="DSA" />
                <Area type="monotone" dataKey="System" stroke={C.cyan} fill={C.cyan} fillOpacity={0.14} strokeWidth={2} name="System Design" />
                <Area type="monotone" dataKey="OOP" stroke={C.green} fill={C.green} fillOpacity={0.14} strokeWidth={2} name="OOP" />
                <Area type="monotone" dataKey="SQL" stroke={C.amber} fill={C.amber} fillOpacity={0.14} strokeWidth={2} name="SQL" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 flex-wrap mt-1">
              {([["DSA", C.purple], ["System Design", C.cyan], ["OOP", C.green], ["SQL", C.amber]] as [string, string][]).map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 p-5">
            <SecHead icon={<Calendar size={16} />} title="Monthly Progress" sub="Weekly targets vs achieved" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart id="pd-monthly-bar" data={MONTHLY_PROG} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} fill={C.border} />
                <Bar dataKey="progress" name="Achieved" radius={[4, 4, 0, 0]}>
                  {MONTHLY_PROG.map((_, i) => <Cell key={`mp-cell-${i}`} fill={i === 3 ? C.green : C.purple} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* History columns + recent activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Interview history */}
          <Card className="p-5">
            <SecHead icon={<Mic size={15} />} title="Interview History" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="space-y-2">
              {[
                { type: "Technical", score: 81, date: "Aug 1", grade: "A−", color: C.cyan },
                { type: "Behavioral", score: 76, date: "Jul 28", grade: "B+", color: C.green },
                { type: "Mixed", score: 71, date: "Jul 22", grade: "B", color: C.purple },
                { type: "HR Interview", score: 84, date: "Jul 15", grade: "A", color: C.amber },
                { type: "Coding Round", score: 67, date: "Jul 8", grade: "C+", color: C.red },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${h.color}18`, color: h.color }}><Mic size={12} /></div>
                  <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white">{h.type}</div><div className="text-xs" style={{ color: C.muted }}>{h.date}</div></div>
                  <div className="text-right"><div className="text-sm font-black text-white">{h.score}</div><span className="text-xs font-bold" style={{ color: h.color }}>{h.grade}</span></div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis history */}
          <Card className="p-5">
            <SecHead icon={<FileText size={15} />} title="Analysis History" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="text-xs font-bold mb-2" style={{ color: C.muted }}>Resume Uploads</div>
            <div className="space-y-1.5 mb-4">
              {[["Resume_v3.pdf", 87, C.green, "Jul 30"], ["Resume_v2.pdf", 72, C.amber, "Jul 10"], ["Resume_v1.pdf", 58, C.red, "Jun 18"]].map(([n, s, c, d], i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <FileText size={12} style={{ color: c as string, flexShrink: 0 }} />
                  <span className="flex-1 text-xs text-white truncate">{n}</span>
                  <span className="text-xs font-black" style={{ color: c as string }}>{s}</span>
                  <span className="text-xs" style={{ color: C.muted }}>{d}</span>
                </div>
              ))}
            </div>
            <div className="text-xs font-bold mb-2" style={{ color: C.muted }}>Project Analyses</div>
            <div className="space-y-1.5">
              {[["E-commerce App", 82, C.purple], ["Chat Application", 74, C.cyan]].map(([n, s, c], i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <FolderOpen size={12} style={{ color: c as string, flexShrink: 0 }} />
                  <span className="flex-1 text-xs text-white truncate">{n}</span>
                  <span className="text-xs font-black" style={{ color: c as string }}>{s}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="p-5">
            <SecHead icon={<Zap size={15} />} title="Recent Activity" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="relative pl-6">
              <div className="absolute left-[9px] top-1 bottom-1 w-0.5" style={{ background: C.border }} />
              <div className="space-y-3">
                {RECENT_ACTS.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                      style={{ background: `${a.color}20`, border: `1.5px solid ${a.color}` }}>
                      <div style={{ color: a.color }}>{a.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white leading-snug">{a.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Subject / Domain completion + Streak calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5">
            <SecHead icon={<BookOpen size={15} />} title="Subject Completion" sub="8 core subjects" />
            <div className="space-y-2.5">
              {SUBJECTS.slice(0, 5).map(s => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{s.name.split(" ").slice(0, 2).join(" ")}</span><span className="font-bold" style={{ color: s.color }}>{s.progress}%</span></div>
                  <div className="h-2 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.color, boxShadow: `0 0 6px ${s.color}50` }} /></div>
                </div>
              ))}
              <button className="w-full mt-1 py-2 rounded-xl text-xs font-semibold" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>View all 8 subjects</button>
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<GraduationCap size={15} />} title="Domain Completion" sub="8 career domains" />
            <div className="space-y-2.5">
              {DOMAINS.slice(0, 5).map(d => (
                <div key={d.id}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{d.name.split(" ")[0]}</span><span className="font-bold" style={{ color: d.color }}>{d.progress}%</span></div>
                  <div className="h-2 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${d.progress}%`, background: d.color, boxShadow: `0 0 6px ${d.color}50` }} /></div>
                </div>
              ))}
              <button className="w-full mt-1 py-2 rounded-xl text-xs font-semibold" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>View all 8 domains</button>
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<Flame size={15} />} title="Study Streak" sub="Daily activity — last 28 days" />
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-black" style={{ color: C.amber }}>{streak}</div>
              <div><div className="text-xs font-bold text-white">day streak</div><div className="text-xs" style={{ color: C.muted }}>Personal best: {streak}</div></div>
            </div>
            <div className="grid gap-1.5 mb-2" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {Array.from({ length: 28 }, (_, i) => {
                const active = i >= 14; const today = i === 27;
                return (
                  <div key={i} className="rounded aspect-square"
                    style={{ background: today ? C.amber : active ? `rgba(245,158,11,${0.25 + (i - 14) * 0.05})` : C.surface, border: today ? `1px solid ${C.amber}` : "1px solid transparent" }} />
                );
              })}
            </div>
            <div className="flex justify-between text-xs" style={{ color: C.muted }}><span>4 weeks ago</span><span>Today</span></div>
          </Card>
        </div>

        {/* Achievements + AI Insights + Upcoming Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5">
            <SecHead icon={<Award size={15} />} title="Achievement Badges"
              sub={`${ACHIEVEMENTS_LIST.filter(a => a.earned).length} earned · ${ACHIEVEMENTS_LIST.filter(a => !a.earned).length} locked`} />
            <div className="grid grid-cols-4 gap-3">
              {ACHIEVEMENTS_LIST.map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                  style={{ background: a.earned ? "rgba(168,85,247,.08)" : C.surface, border: `1px solid ${a.earned ? "rgba(168,85,247,.22)" : C.border}`, opacity: a.earned ? 1 : 0.55 }}>
                  <div className="text-2xl" style={{ filter: a.earned ? "none" : "grayscale(1)" }}>{a.icon}</div>
                  <div className="text-xs font-semibold leading-tight" style={{ color: a.earned ? C.text : C.muted }}>{a.title}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{a.earned ? a.date : "Locked"}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-5" style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.25)" }}>
              <SecHead icon={<Sparkles size={15} />} title="AI Performance Insights" sub="Personalised weekly analysis" />
              <div className="space-y-2.5">
                {[
                  { text: "You perform 34% better in Technical vs Behavioral rounds — invest more in STAR stories.", color: C.amber },
                  { text: "DSA score improved +30% over 6 months — excellent consistency!", color: C.green },
                  { text: "System Design is weakest at 45%. Target 2 HLD problems daily for the next week.", color: C.purple },
                ].map((ins, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}20` }}>
                    <Sparkles size={12} style={{ color: ins.color, flexShrink: 0, marginTop: 1 }} />
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{ins.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <SecHead icon={<Target size={15} />} title="Upcoming Goals" sub="7/10 completed"
                action={<button className="text-xs flex items-center gap-1" style={{ color: C.purple }}><Plus size={11} /> Add</button>} />
              <div className="space-y-2.5">
                {[
                  { goal: "Complete DSA: Binary Trees module", due: "Aug 5", pct: 70, color: C.purple },
                  { goal: "Take 2 Mock Interviews this week", due: "Aug 7", pct: 50, color: C.cyan },
                  { goal: "Upload updated Resume v4", due: "Aug 10", pct: 0, color: C.amber },
                ].map((g, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-white flex-1 mr-3 leading-snug">{g.goal}</span>
                      <div className="flex items-center gap-1 flex-shrink-0" style={{ color: C.muted }}><Clock size={10} /><span className="text-xs">{g.due}</span></div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
                    </div>
                    <div className="text-xs mt-1 font-semibold" style={{ color: g.pct === 0 ? C.muted : g.color }}>{g.pct === 0 ? "Not started" : `${g.pct}% complete`}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6: AI PERSONALIZED ROADMAP
// ═══════════════════════════════════════════════════════════════════════════════
function RoadmapPage() {
  const [goalId, setGoalId] = useState("sde");
  const [level, setLevel] = useState(2);
  const goal = CAREER_GOALS_LIST.find(g => g.id === goalId)!;

  const readinessPct = 62;

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}><Map size={18} /></div>
              <h1 className="text-xl font-bold text-white">AI Personalized Learning Roadmap</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Your <Grad>AI-generated path</Grad> to your dream job — tailored to your current skills.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: C.grad }}>
            <Sparkles size={14} /> Regenerate Plan
          </button>
        </div>

        {/* Career goal + skill level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Goal cards */}
          <Card className="md:col-span-2 p-5">
            <SecHead icon={<Target size={16} />} title="Career Goal Selection" sub="Choose your target role" />
            <div className="grid grid-cols-5 gap-3">
              {CAREER_GOALS_LIST.map(g => (
                <button key={g.id} onClick={() => setGoalId(g.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.03]"
                  style={{ background: goalId === g.id ? `linear-gradient(135deg,${g.color}22,${g.color}10)` : C.surface, border: `1px solid ${goalId === g.id ? g.color + "55" : C.border}`, boxShadow: goalId === g.id ? `0 0 20px ${g.color}20` : "none" }}>
                  <span className="text-2xl">{g.icon}</span>
                  <div className="text-xs font-bold leading-tight" style={{ color: goalId === g.id ? g.color : C.text }}>{g.label}</div>
                  <div className="text-xs leading-tight" style={{ color: C.muted, fontSize: 10 }}>{g.companies}</div>
                  {goalId === g.id && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: g.color }}><Check size={9} className="text-white" /></div>}
                </button>
              ))}
            </div>
          </Card>

          {/* Skill level + readiness */}
          <Card className="p-5">
            <SecHead icon={<Zap size={16} />} title="Current Skill Level" sub="Self-assessed" />
            <div className="space-y-3 mb-5">
              {["Beginner", "Intermediate", "Advanced", "Expert"].map((l, i) => (
                <button key={l} onClick={() => setLevel(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{ background: level === i ? `${goal.color}12` : C.surface, border: `1px solid ${level === i ? goal.color + "45" : C.border}` }}>
                  <div className="flex gap-1">
                    {[0,1,2,3].map(b => <div key={b} className="w-3 h-3 rounded-sm" style={{ background: b <= i ? goal.color : C.border }} />)}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: level === i ? goal.color : C.muted }}>{l}</span>
                  {level === i && <Check size={12} style={{ color: goal.color, marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
            {/* Interview readiness */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.2)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Interview Readiness</span>
                <span className="text-sm font-black" style={{ color: C.purple }}>{readinessPct}%</span>
              </div>
              <div className="h-2.5 rounded-full mb-2" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: `${readinessPct}%`, background: C.grad, boxShadow: "0 0 8px rgba(168,85,247,.5)" }} />
              </div>
              <div className="text-xs" style={{ color: C.muted }}>~8 weeks to interview-ready</div>
            </div>
          </Card>
        </div>

        {/* Skill gap radar + estimated timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="md:col-span-2 p-5">
            <SecHead icon={<Crosshair size={16} />} title="Skill Gap Analysis" sub="Current vs target proficiency" />
            <div className="grid grid-cols-2 gap-0 items-center">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart id="rm-gap-radar" data={SKILL_GAP_RADAR} margin={{ top: 16, right: 28, bottom: 16, left: 28 }}>
                  <PolarGrid stroke={C.border} />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 9 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="target" stroke={`${goal.color}50`} fill={`${goal.color}08`} strokeWidth={1.5} name="Target" strokeDasharray="4 3" />
                  <Radar dataKey="current" stroke={goal.color} fill={goal.color} fillOpacity={0.2} strokeWidth={2} name="Current" />
                  <Tooltip content={<ChartTip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="space-y-2 pl-2">
                {SKILL_GAP_RADAR.map(d => (
                  <div key={d.axis}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: C.muted }}>{d.axis}</span>
                      <span className="font-bold text-white">{d.current}%<span style={{ color: C.muted }}>/{d.target}</span></span>
                    </div>
                    <div className="relative h-1.5 rounded-full" style={{ background: C.border }}>
                      <div className="absolute h-full rounded-full opacity-30" style={{ width: `${d.target}%`, background: goal.color }} />
                      <div className="absolute h-full rounded-full" style={{ width: `${d.current}%`, background: goal.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<Clock size={16} />} title="Estimated Timeline" sub={`For ${goal.label}`} />
            <div className="space-y-3 mb-5">
              {[
                { label: "Preparation Duration", value: "20 weeks", color: C.purple },
                { label: "Daily Study Time", value: "2–3 hours", color: C.cyan },
                { label: "Weekly Mock Tests", value: "1–2 mocks", color: C.green },
                { label: "Practice Problems", value: "150+ solved", color: C.amber },
                { label: "Target Companies", value: "Top 10 FAANG", color: C.pink },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-2 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <span className="text-xs" style={{ color: C.muted }}>{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2" style={{ background: C.grad }}>
              <Rocket size={13} /> Start This Roadmap
            </button>
          </Card>
        </div>

        {/* Roadmap Timeline */}
        <Card className="p-6">
          <SecHead icon={<Map size={16} />} title="AI-Generated Roadmap Timeline" sub={`Structured 20-week path to ${goal.label}`} />
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-0.5" style={{ background: `linear-gradient(to bottom,${goal.color},${goal.color}20)` }} />
            <div className="space-y-5">
              {ROADMAP_PHASES_LIST.map((p, i) => (
                <div key={p.phase} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 text-sm font-bold"
                    style={{
                      background: p.status === "done" ? C.green : p.status === "current" ? goal.color : C.surface,
                      border: `2px solid ${p.status === "done" ? C.green : p.status === "current" ? goal.color : C.border}`,
                      color: p.status !== "upcoming" ? "#fff" : C.muted,
                      boxShadow: p.status === "current" ? `0 0 16px ${goal.color}50` : "none",
                    }}>
                    {p.status === "done" ? <Check size={16} /> : p.phase}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white">{p.title}</span>
                      {p.status === "current" && <Pill label="In Progress" color={goal.color} />}
                      {p.status === "done" && <Pill label="Completed" color={C.green} />}
                      <span className="text-xs ml-auto" style={{ color: C.muted }}>{p.weeks}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {p.items.map(item => (
                        <div key={item} className="flex items-start gap-2 p-2.5 rounded-xl text-xs"
                          style={{ background: p.status === "done" ? "rgba(52,211,153,.06)" : p.status === "current" ? `${goal.color}08` : C.surface, border: `1px solid ${p.status === "done" ? C.green + "25" : p.status === "current" ? goal.color + "25" : C.border}` }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: p.status === "done" ? C.green : p.status === "current" ? goal.color : C.muted }} />
                          <span style={{ color: p.status === "upcoming" ? C.muted : C.text }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Resources: Topics + Courses + Certs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Recommended Topics */}
          <Card className="p-5">
            <SecHead icon={<BookOpen size={15} />} title="Recommended Topics" sub="Curated for your goal" />
            <div className="space-y-2">
              {[
                { t: "Dynamic Programming Patterns", tag: "DSA", priority: "High", color: C.red },
                { t: "System Design Fundamentals", tag: "Design", priority: "High", color: C.red },
                { t: "Graph Algorithms (BFS/DFS/Dijkstra)", tag: "DSA", priority: "Med", color: C.amber },
                { t: "Object-Oriented Design Patterns", tag: "OOP", priority: "Med", color: C.amber },
                { t: "SQL Advanced Queries & Indexing", tag: "DB", priority: "Low", color: C.green },
                { t: "Behavioral Interview (STAR Method)", tag: "HR", priority: "Med", color: C.amber },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <ArrowRight size={11} style={{ color: goal.color, flexShrink: 0 }} />
                  <span className="flex-1 text-xs text-white">{item.t}</span>
                  <Pill label={item.priority} color={item.color} />
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Courses */}
          <Card className="p-5">
            <SecHead icon={<GraduationCap size={15} />} title="Recommended Courses" sub="AI-curated for you" />
            <div className="space-y-2.5">
              {[
                { name: "Grokking Algorithms & Patterns", platform: "Educative", rating: 4.9, free: false, color: C.purple },
                { name: "System Design Interview Guide", platform: "Coursera", rating: 4.8, free: false, color: C.cyan },
                { name: "CS Fundamentals — MIT 6.006", platform: "MIT OCW", rating: 5.0, free: true, color: C.green },
                { name: "FAANG Interview Bootcamp", platform: "Udemy", rating: 4.7, free: false, color: C.amber },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: c.color }}>{c.platform[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white leading-snug">{c.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: C.amber }}>★ {c.rating}</span>
                      <span className="text-xs" style={{ color: C.muted }}>{c.platform}</span>
                      {c.free && <Pill label="Free" color={C.green} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications + Daily Plan */}
          <div className="space-y-5">
            <Card className="p-5">
              <SecHead icon={<Award size={15} />} title="Certifications" sub="Industry-recognised" />
              <div className="space-y-2">
                {[
                  { name: "AWS Solutions Architect", org: "Amazon", color: C.amber },
                  { name: "Google Cloud Professional", org: "Google", color: C.blue },
                  { name: "Meta Front-End Developer", org: "Coursera", color: C.cyan },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                    <Award size={14} style={{ color: c.color, flexShrink: 0 }} />
                    <div className="flex-1"><div className="text-xs font-semibold text-white">{c.name}</div><div className="text-xs" style={{ color: C.muted }}>{c.org}</div></div>
                    <ExternalLink size={11} style={{ color: C.muted }} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <SecHead icon={<Calendar size={15} />} title="Daily Study Plan" sub="Recommended schedule" />
              <div className="space-y-2">
                {[
                  { time: "7:00 AM", task: "30 min — Revision notes", color: C.purple },
                  { time: "6:00 PM", task: "1 hr — 2 LeetCode problems", color: C.cyan },
                  { time: "8:00 PM", task: "1 hr — Course module / reading", color: C.green },
                  { time: "9:30 PM", task: "30 min — Mock Q&A with AI", color: C.amber },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-xs font-mono font-bold w-16 flex-shrink-0" style={{ color: d.color }}>{d.time}</div>
                    <div className="flex-1 text-xs py-1.5 px-2.5 rounded-lg" style={{ background: `${d.color}10`, border: `1px solid ${d.color}25`, color: C.muted }}>{d.task}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Weekly milestones */}
        <Card className="p-5">
          <SecHead icon={<Zap size={16} />} title="Weekly Milestones" sub="Your week-by-week targets for the next month"
            action={<Pill label="Month 1" color={C.purple} />} />
          <div className="grid grid-cols-4 gap-4">
            {[
              { week: "Week 1", target: "Complete Arrays & Strings (30 problems)", tasks: ["Solve 30 easy problems", "Read sorting algorithms", "1 mock interview"], done: true, color: C.green },
              { week: "Week 2", target: "Master Trees & Recursion", tasks: ["Solve 25 tree problems", "DFS/BFS practice", "System Design intro"], done: true, color: C.green },
              { week: "Week 3", target: "Dynamic Programming Basics", tasks: ["10 DP problems", "Memoisation patterns", "2nd mock interview"], done: false, current: true, color: C.purple },
              { week: "Week 4", target: "Graph Algorithms + Review", tasks: ["Graph traversal", "Full revision", "Mock test + evaluation"], done: false, color: C.muted },
            ].map((w, i) => (
              <div key={i} className="p-4 rounded-2xl"
                style={{ background: (w as any).current ? `${w.color}10` : w.done ? "rgba(52,211,153,.06)" : C.surface, border: `1px solid ${(w as any).current ? w.color + "45" : w.done ? C.green + "30" : C.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black" style={{ color: (w as any).current ? w.color : w.done ? C.green : C.muted }}>{w.week}</span>
                  {w.done && <CheckCircle2 size={14} style={{ color: C.green }} />}
                  {(w as any).current && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: w.color }} />}
                </div>
                <p className="text-xs font-semibold text-white leading-snug mb-3">{w.target}</p>
                <div className="space-y-1">
                  {w.tasks.map((t, ti) => (
                    <div key={ti} className="flex items-start gap-1.5 text-xs" style={{ color: C.muted }}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: w.done ? C.green : (w as any).current ? w.color : C.border }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Projects */}
        <Card className="p-6">
          <SecHead icon={<FolderOpen size={16} />} title="Recommended Projects" sub={`Build these to strengthen your ${goal.label} portfolio`}
            action={<Pill label="AI Curated" color={goal.color} />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "URL Shortener Service", difficulty: "Beginner", type: "Backend",
                tech: ["Node.js", "Redis", "PostgreSQL"], color: C.cyan,
                desc: "Build a scalable URL shortener with analytics, custom slugs, and rate limiting.",
                skills: ["REST API Design", "Database Schema", "Caching with Redis"],
                impact: "High",
              },
              {
                name: "Real-time Collaborative Editor", difficulty: "Intermediate", type: "Full Stack",
                tech: ["React", "Socket.io", "Node.js", "MongoDB"], color: C.purple,
                desc: "Google Docs-style editor with operational transforms, live cursors, and conflict resolution.",
                skills: ["WebSockets", "OT Algorithms", "React State Management"],
                impact: "Very High",
              },
              {
                name: "Mini E-commerce Platform", difficulty: "Intermediate", type: "Full Stack",
                tech: ["React", "Express", "PostgreSQL", "Stripe"], color: C.green,
                desc: "Full-stack shopping app with cart, auth, payments, and order management system.",
                skills: ["Payment Integration", "Auth Flows", "Database Relations"],
                impact: "High",
              },
              {
                name: "System Design: News Feed", difficulty: "Advanced", type: "Architecture",
                tech: ["System Design", "HLD", "Scalability"], color: goal.color,
                desc: "Design and document a Twitter/Instagram news feed at 10M DAU scale. Write HLD + LLD docs.",
                skills: ["System Design", "Scalability Patterns", "Technical Writing"],
                impact: "Very High",
              },
            ].map((proj, i) => (
              <div key={i} className="p-4 rounded-2xl"
                style={{ background: `${proj.color}07`, border: `1px solid ${proj.color}28` }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${proj.color}18`, color: proj.color }}>
                        <FolderOpen size={12} />
                      </div>
                      <span className="text-sm font-bold text-white">{proj.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Pill label={proj.difficulty} color={proj.difficulty === "Advanced" ? C.red : proj.difficulty === "Intermediate" ? C.amber : C.green} />
                    <Pill label={proj.type} color={proj.color} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: C.muted }}>{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proj.tech.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: `${proj.color}10`, border: `1px solid ${proj.color}30`, color: proj.color }}>{t}</span>
                  ))}
                </div>
                <div className="border-t pt-3" style={{ borderColor: `${proj.color}20` }}>
                  <div className="text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Skills you'll gain:</div>
                  <div className="flex flex-col gap-1">
                    {proj.skills.map(s => (
                      <div key={s} className="flex items-center gap-1.5 text-xs" style={{ color: C.text }}>
                        <Check size={10} style={{ color: proj.color, flexShrink: 0 }} /> {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                    <TrendingUp size={11} />
                    <span>Interview Impact: <span className="font-bold" style={{ color: proj.impact === "Very High" ? C.green : C.amber }}>{proj.impact}</span></span>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: `${proj.color}12`, color: proj.color, border: `1px solid ${proj.color}30` }}>
                    View Guide →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Next-Step Recommendations */}
        <Card className="p-6"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,.1),rgba(34,211,238,.06))", border: "1px solid rgba(168,85,247,.3)", boxShadow: "0 8px 32px rgba(168,85,247,.12)" }}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,.2)", color: C.purple }}>
                <Brain size={18} />
              </div>
              <div>
                <div className="text-base font-bold text-white">AI Next-Step Recommendations</div>
                <div className="text-xs" style={{ color: C.muted }}>Personalised actions based on your performance data — updated daily</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(168,85,247,.12)", border: "1px solid rgba(168,85,247,.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.purple }} />
              <span className="text-xs font-semibold" style={{ color: C.purple }}>Live AI</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              {
                priority: "Do Today", icon: <Zap size={14} />, color: C.red,
                action: "Solve 3 DP problems on LeetCode",
                reason: "You've skipped DP for 4 days. Consistency drops sharply after 3 days of inactivity.",
                time: "~90 min", cta: "Open LeetCode →",
              },
              {
                priority: "This Week", icon: <Target size={14} />, color: C.amber,
                action: "Complete System Design: URL Shortener module",
                reason: "System Design is your weakest area at 45%. One module/week brings it to 65% in 6 weeks.",
                time: "~3 hrs total", cta: "Start Module →",
              },
              {
                priority: "Next Step", icon: <TrendingUp size={14} />, color: C.cyan,
                action: "Schedule your 2nd Behavioral Mock Interview",
                reason: "Your last behavioral round was 18 days ago. Regular practice improves scores by 22%.",
                time: "45 min session", cta: "Book Now →",
              },
            ].map((rec, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl"
                style={{ background: `${rec.color}08`, border: `1px solid ${rec.color}30` }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${rec.color}18`, color: rec.color }}>{rec.icon}</div>
                  <span className="text-xs font-black" style={{ color: rec.color }}>{rec.priority}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1 leading-snug">{rec.action}</div>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{rec.reason}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: `${rec.color}20` }}>
                  <div className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                    <Clock size={10} /> {rec.time}
                  </div>
                  <button className="text-xs font-bold" style={{ color: rec.color }}>{rec.cta}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Problems to solve this week", value: "8 / 12", color: C.purple, pct: 67 },
              { label: "Modules to complete", value: "1 / 3", color: C.cyan, pct: 33 },
              { label: "Mocks scheduled", value: "1 / 2", color: C.green, pct: 50 },
              { label: "Days until target date", value: "48 days", color: C.amber, pct: 68 },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${s.color}20` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: C.muted }}>{s.label}</span>
                </div>
                <div className="text-base font-black mb-2" style={{ color: s.color }}>{s.value}</div>
                <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 7: USER PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "skills" | "certs">("personal");

  const inputStyle: React.CSSProperties = {
    background: editing ? C.surface : "transparent",
    border: `1px solid ${editing ? C.border : "transparent"}`,
    color: C.text,
    borderRadius: 10,
    padding: "6px 10px",
    fontFamily: "'Inter',sans-serif",
    fontSize: 13,
    outline: "none",
    width: "100%",
    transition: "all .2s",
  };

  const skills = ["React", "TypeScript", "Node.js", "Python", "DSA", "SQL", "System Design", "Docker", "Git", "REST APIs"];
  const certs = [
    { name: "AWS Cloud Practitioner", org: "Amazon Web Services", date: "Mar 2024", color: C.amber },
    { name: "Google Data Analytics", org: "Coursera · Google", date: "Jan 2024", color: C.blue },
    { name: "Meta Frontend Developer", org: "Meta Platforms", date: "Nov 2023", color: C.cyan },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}><User size={18} /></div>
              <h1 className="text-xl font-bold text-white">User Profile</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Manage your personal information and <Grad>track your achievements</Grad>.</p>
          </div>
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: editing ? C.grad : C.surface, border: `1px solid ${editing ? "transparent" : C.border}`, color: editing ? "#fff" : C.muted }}>
            {editing ? <><Check size={14} /> Save Changes</> : <><Pencil size={14} /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="space-y-5">
            {/* Avatar card */}
            <Card className="p-6 flex flex-col items-center gap-4"
              style={{ background: "linear-gradient(135deg,rgba(168,85,247,.1),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.25)" }}>
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white"
                  style={{ background: C.grad, boxShadow: "0 0 30px rgba(168,85,247,.4)" }}>DS</div>
                {editing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: C.purple, border: `2px solid ${C.bg}` }}>
                    <Camera size={13} className="text-white" />
                  </button>
                )}
                <div className="absolute top-0 right-0 w-4 h-4 rounded-full" style={{ background: C.green, border: `2px solid ${C.bg}` }} />
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-white">Dhruti Shah</div>
                <div className="text-sm" style={{ color: C.muted }}>B.Tech · Computer Science</div>
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <Pill label="Pro Plan" color={C.purple} />
                  <Pill label="Active" color={C.green} />
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-5">
              <div className="text-xs font-bold mb-3 text-white">Performance Stats</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Interviews", value: "6", color: C.purple },
                  { label: "Avg Score", value: "74", color: C.cyan },
                  { label: "Streak", value: "14d", color: C.amber },
                  { label: "Progress", value: "68%", color: C.green },
                  { label: "Badges", value: "5", color: C.pink },
                  { label: "Solved", value: "243", color: C.indigo },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                    <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-5">
              <div className="text-xs font-bold mb-3 text-white">Connected Profiles</div>
              <div className="space-y-2.5">
                {[
                  { label: "LinkedIn", url: "linkedin.com/in/dhrutishah", icon: <Linkedin size={14} />, color: C.blue, connected: true },
                  { label: "GitHub", url: "github.com/dhrutishah", icon: <GitBranch size={14} />, color: C.muted, connected: true },
                  { label: "Portfolio", url: "dhrutishah.dev", icon: <Globe size={14} />, color: C.purple, connected: false },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div style={{ color: l.color }}>{l.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{l.label}</div>
                      <div className="text-xs truncate" style={{ color: C.muted }}>{l.connected ? l.url : "Not connected"}</div>
                    </div>
                    {l.connected
                      ? <ExternalLink size={12} style={{ color: C.muted, flexShrink: 0 }} />
                      : <button className="text-xs px-2 py-1 rounded-lg flex-shrink-0" style={{ background: `${C.purple}18`, color: C.purple }}>Connect</button>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-5">
              <div className="text-xs font-bold mb-3 text-white">Earned Badges</div>
              <div className="grid grid-cols-4 gap-2">
                {ACHIEVEMENTS_LIST.filter(a => a.earned).map((a, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl"
                    style={{ background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.18)" }}>
                    <span className="text-xl">{a.icon}</span>
                    <div className="text-xs text-center leading-tight" style={{ color: C.muted, fontSize: 9 }}>{a.title}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right panel — forms */}
          <div className="md:col-span-2 space-y-5">
            {/* Tab nav */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {(["personal", "academic", "skills", "certs"] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{ background: activeTab === t ? C.grad : "transparent", color: activeTab === t ? "#fff" : C.muted }}>
                  {t === "certs" ? "Certifications" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Personal Info */}
            {activeTab === "personal" && (
              <Card className="p-6">
                <SecHead icon={<User size={16} />} title="Personal Information" sub="Your basic profile details" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "First Name", val: "Dhruti" }, { label: "Last Name", val: "Shah" },
                    { label: "Email Address", val: "dhruti.shah@email.com" }, { label: "Phone Number", val: "+91 98765 43210" },
                    { label: "City", val: "Ahmedabad" }, { label: "State", val: "Gujarat" },
                    { label: "Date of Birth", val: "15 March 2002" }, { label: "Gender", val: "Female" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{f.label}</label>
                      <input defaultValue={f.val} readOnly={!editing} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Bio / About Me</label>
                  <textarea defaultValue="Final year B.Tech CSE student passionate about AI/ML and full-stack development. Currently preparing for product-based company placements." readOnly={!editing} rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: editing ? C.surface : "transparent", border: `1px solid ${editing ? C.border : "transparent"}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                </div>
              </Card>
            )}

            {/* Academic Details */}
            {activeTab === "academic" && (
              <Card className="p-6">
                <SecHead icon={<GraduationCap size={16} />} title="Academic Details" sub="Your educational background" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Degree", val: "B.Tech" }, { label: "Specialisation", val: "Computer Science & Engineering" },
                    { label: "University", val: "Gujarat Technological University" }, { label: "College", val: "LDRP Institute of Technology" },
                    { label: "Graduation Year", val: "2025" }, { label: "Current CGPA", val: "8.7 / 10" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{f.label}</label>
                      <input defaultValue={f.val} readOnly={!editing} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold mb-3 text-white">Resume</div>
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,.15)", color: C.purple }}><FileText size={18} /></div>
                  <div className="flex-1"><div className="text-sm font-semibold text-white">Resume_v3_Dhruti_Shah.pdf</div><div className="text-xs" style={{ color: C.muted }}>Uploaded Jul 30, 2025 · AI Score: 87/100</div></div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(168,85,247,.12)", color: C.purple }}>View</button>
                    {editing && <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>Replace</button>}
                  </div>
                </div>
              </Card>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <Card className="p-6">
                <SecHead icon={<Code2 size={16} />} title="Skills & Technologies" sub="Your technical skill set"
                  action={editing && <button className="text-xs flex items-center gap-1" style={{ color: C.purple }}><Plus size={11} /> Add skill</button>} />
                <div className="flex flex-wrap gap-2 mb-6">
                  {skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(168,85,247,.1)", border: "1px solid rgba(168,85,247,.25)", color: C.purple }}>
                      <span className="text-sm font-semibold">{s}</span>
                      {editing && <button style={{ color: C.muted }}><XCircle size={12} /></button>}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold mb-3 text-white">Skill Proficiency</div>
                <div className="grid grid-cols-2 gap-4">
                  {[["React", 85, C.cyan], ["TypeScript", 78, C.blue], ["Python", 70, C.green], ["DSA", 68, C.purple], ["SQL", 74, C.amber], ["System Design", 45, C.red]].map(([s, p, c]) => (
                    <div key={s as string}>
                      <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{s}</span><span className="font-bold" style={{ color: c as string }}>{p}%</span></div>
                      <div className="h-2 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${p}%`, background: c as string }} /></div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certifications */}
            {activeTab === "certs" && (
              <Card className="p-6">
                <SecHead icon={<Award size={16} />} title="Certifications" sub="Your earned credentials"
                  action={editing && <button className="text-xs flex items-center gap-1" style={{ color: C.purple }}><Plus size={11} /> Add</button>} />
                <div className="space-y-3 mb-6">
                  {certs.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}18`, color: c.color }}><Award size={18} /></div>
                      <div className="flex-1"><div className="text-sm font-bold text-white">{c.name}</div><div className="text-xs" style={{ color: C.muted }}>{c.org} · {c.date}</div></div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: `${c.color}12`, color: c.color }}>View</button>
                        {editing && <button><Trash2 size={14} style={{ color: C.muted }} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: C.surface, border: `2px dashed ${C.border}` }}>
                  <Award size={24} style={{ color: C.muted, margin: "0 auto 8px" }} />
                  <div className="text-sm font-semibold text-white mb-1">Add a new certification</div>
                  <div className="text-xs mb-3" style={{ color: C.muted }}>Upload certificate image or enter details manually</div>
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: C.grad }}>
                    <Plus size={11} className="inline mr-1" /> Add Certification
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 8: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsPage() {
  const [section, setSection] = useState("account");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    emailMock: true, emailProgress: true, emailResume: false,
    pushAll: true, pushInterview: true, pushStreak: true, pushAI: false,
    profilePublic: false, showActivity: true, shareProgress: false,
    darkMode: true, animations: true, compactView: false,
    twoFA: false, loginAlerts: true,
  });

  const tog = (k: string) => setToggles(t => ({ ...t, [k]: !t[k] }));

  const sections = [
    { id: "account", label: "Account", icon: <User size={15} /> },
    { id: "security", label: "Security", icon: <Shield size={15} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
    { id: "privacy", label: "Privacy", icon: <Lock size={15} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
    { id: "language", label: "Language", icon: <Globe size={15} /> },
    { id: "connected", label: "Connected Accounts", icon: <Link size={15} /> },
    { id: "danger", label: "Danger Zone", icon: <AlertTriangle size={15} /> },
  ];

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Settings sidebar */}
      <div className="w-56 flex-shrink-0 border-r overflow-y-auto py-4 px-2" style={{ borderColor: C.border, scrollbarWidth: "none" }}>
        <div className="px-3 pb-3 mb-2 border-b" style={{ borderColor: C.border }}>
          <div className="text-xs font-black text-white">Settings</div>
          <div className="text-xs" style={{ color: C.muted }}>Manage your account</div>
        </div>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left mb-0.5 transition-all"
            style={{
              background: section === s.id ? (s.id === "danger" ? "rgba(239,68,68,.1)" : C.gradSubtle) : "transparent",
              border: section === s.id ? `1px solid ${s.id === "danger" ? "rgba(239,68,68,.3)" : "rgba(168,85,247,.3)"}` : "1px solid transparent",
              color: section === s.id ? (s.id === "danger" ? C.red : C.text) : s.id === "danger" ? "rgba(239,68,68,.7)" : C.muted,
            }}>
            {s.icon}<span className="text-sm">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "none" }}>
        {section === "account" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Account Settings</div><div className="text-sm" style={{ color: C.muted }}>Update your personal details and preferences.</div></div>
            <Card className="p-6">
              <SecHead icon={<User size={16} />} title="Profile Details" sub="Shown on your public profile" />
              <div className="grid grid-cols-2 gap-4">
                {[["Full Name", "Dhruti Shah"], ["Display Name", "DhrutiS"], ["Email", "dhruti.shah@email.com"], ["Phone", "+91 98765 43210"]].map(([l, v]) => (
                  <div key={l}><label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{l}</label>
                    <input defaultValue={v} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Profile Bio</label>
                <textarea defaultValue="Final year B.Tech CSE student preparing for product-based company placements." rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
              </div>
              <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: C.grad }}>Save Changes</button>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Mail size={16} />} title="Email Preferences" sub="Manage what emails you receive" />
              {[
                { key: "emailMock", label: "Mock Interview Reminders", sub: "Get notified before scheduled sessions" },
                { key: "emailProgress", label: "Weekly Progress Reports", sub: "Summary of your weekly activity" },
                { key: "emailResume", label: "Resume Update Suggestions", sub: "AI tips to improve your resume score" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "security" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Security Settings</div><div className="text-sm" style={{ color: C.muted }}>Keep your account safe and secure.</div></div>
            <Card className="p-6">
              <SecHead icon={<Lock size={16} />} title="Change Password" />
              <div className="space-y-3">
                {["Current Password", "New Password", "Confirm New Password"].map(l => (
                  <div key={l}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{l}</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  </div>
                ))}
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white mt-1" style={{ background: C.grad }}>Update Password</button>
              </div>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Shield size={16} />} title="Two-Factor Authentication" sub="Add an extra layer of security" />
              <div className="flex items-center justify-between py-3.5 border-b" style={{ borderColor: C.border }}>
                <div>
                  <div className="text-sm font-medium text-white">Enable 2FA via Authenticator App</div>
                  <div className="text-xs" style={{ color: C.muted }}>Use Google Authenticator or Authy</div>
                </div>
                <ToggleSwitch on={toggles.twoFA} onToggle={() => tog("twoFA")} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div><div className="text-sm font-medium text-white">Login Alerts via Email</div><div className="text-xs" style={{ color: C.muted }}>Get notified of new logins</div></div>
                <ToggleSwitch on={toggles.loginAlerts} onToggle={() => tog("loginAlerts")} />
              </div>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Eye size={16} />} title="Active Sessions" sub="Devices currently logged in" />
              {[
                { device: "MacBook Pro — Chrome", location: "Ahmedabad, IN", time: "Now", current: true },
                { device: "iPhone 15 Pro — Safari", location: "Ahmedabad, IN", time: "2h ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{s.device}</div><div className="text-xs" style={{ color: C.muted }}>{s.location} · {s.time}</div></div>
                  {s.current ? <Pill label="Current" color={C.green} /> : <button className="text-xs font-semibold" style={{ color: C.red }}>Revoke</button>}
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "notifications" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Notification Preferences</div><div className="text-sm" style={{ color: C.muted }}>Control how and when you get notified.</div></div>
            <Card className="p-5">
              <SecHead icon={<Bell size={16} />} title="Push Notifications" sub="In-app and browser notifications" />
              {[
                { key: "pushAll", label: "All Notifications", sub: "Master toggle for push notifications" },
                { key: "pushInterview", label: "Interview Reminders", sub: "30 minutes before scheduled sessions" },
                { key: "pushStreak", label: "Streak Alerts", sub: "Daily reminders to maintain your streak" },
                { key: "pushAI", label: "AI Suggestions", sub: "New personalised learning tips" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "privacy" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Privacy Settings</div><div className="text-sm" style={{ color: C.muted }}>Control your data and visibility.</div></div>
            <Card className="p-5">
              <SecHead icon={<Lock size={16} />} title="Profile Visibility" />
              {[
                { key: "profilePublic", label: "Public Profile", sub: "Allow others to see your profile" },
                { key: "showActivity", label: "Show Activity Status", sub: "Display when you were last active" },
                { key: "shareProgress", label: "Share Progress Reports", sub: "Allow AI to use your data for insights" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
            <Card className="p-5">
              <SecHead icon={<Download size={16} />} title="Data Management" />
              <div className="space-y-3">
                {[{ label: "Export My Data", sub: "Download a copy of all your data", action: "Export", color: C.cyan },
                  { label: "Clear Interview History", sub: "Remove all past mock interview records", action: "Clear", color: C.amber }].map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div><div className="text-sm font-medium text-white">{d.label}</div><div className="text-xs" style={{ color: C.muted }}>{d.sub}</div></div>
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}30` }}>{d.action}</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "appearance" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Appearance</div><div className="text-sm" style={{ color: C.muted }}>Customise how the app looks and feels.</div></div>
            <Card className="p-5">
              <SecHead icon={<Moon size={16} />} title="Theme" sub="Choose your preferred colour scheme" />
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Dark Mode", icon: <Moon size={20} />, active: true },
                  { label: "Light Mode", icon: <Star size={20} />, active: false },
                  { label: "System Default", icon: <SlidersHorizontal size={20} />, active: false },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer"
                    style={{ background: t.active ? C.gradSubtle : C.surface, border: `1px solid ${t.active ? "rgba(168,85,247,.35)" : C.border}` }}>
                    <div style={{ color: t.active ? C.purple : C.muted }}>{t.icon}</div>
                    <span className="text-xs font-semibold" style={{ color: t.active ? C.text : C.muted }}>{t.label}</span>
                    {t.active && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: C.purple }}><Check size={9} className="text-white" /></div>}
                  </div>
                ))}
              </div>
              <SecHead icon={<Palette size={16} />} title="UI Preferences" />
              {[
                { key: "animations", label: "Enable Animations", sub: "Smooth transitions and micro-interactions" },
                { key: "compactView", label: "Compact View", sub: "Reduce spacing for more content density" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "language" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Language & Region</div><div className="text-sm" style={{ color: C.muted }}>Set your preferred language and timezone.</div></div>
            <Card className="p-5">
              <SecHead icon={<Globe size={16} />} title="Language Settings" />
              <div className="grid grid-cols-2 gap-4">
                {[["App Language", ["English", "Hindi", "Tamil", "Telugu", "Gujarati"], "English"],
                  ["Interview Language", ["English", "Hindi", "Tamil", "Telugu"], "English"],
                  ["Time Zone", ["Asia/Kolkata (IST)", "UTC", "US/Eastern"], "Asia/Kolkata (IST)"],
                  ["Date Format", ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], "DD/MM/YYYY"],
                ].map(([label, opts, val]) => (
                  <div key={label as string}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{label}</label>
                    <select defaultValue={val as string} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }}>
                      {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "connected" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Connected Accounts</div><div className="text-sm" style={{ color: C.muted }}>Manage third-party integrations.</div></div>
            <Card className="p-5">
              <div className="space-y-3">
                {[
                  { label: "LinkedIn", icon: <Linkedin size={18} />, color: C.blue, connected: true, username: "linkedin.com/in/dhrutishah" },
                  { label: "GitHub", icon: <GitBranch size={18} />, color: "#fff", connected: true, username: "github.com/dhrutishah" },
                  { label: "Google", icon: <Globe size={18} />, color: C.red, connected: true, username: "dhruti.shah@gmail.com" },
                  { label: "Portfolio Website", icon: <ExternalLink size={18} />, color: C.purple, connected: false, username: "" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{a.label}</div>
                      <div className="text-xs" style={{ color: C.muted }}>{a.connected ? a.username : "Not connected"}</div>
                    </div>
                    {a.connected
                      ? <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(239,68,68,.1)", color: C.red, border: "1px solid rgba(239,68,68,.25)" }}>Disconnect</button>
                      : <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: C.grad }}>Connect</button>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "danger" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold" style={{ color: C.red }}>Danger Zone</div><div className="text-sm" style={{ color: C.muted }}>Irreversible actions — proceed with caution.</div></div>
            {[
              { title: "Clear All Progress Data", desc: "Permanently delete your learning progress, streaks and history. This cannot be undone.", btn: "Clear Data", color: C.amber },
              { title: "Deactivate Account", desc: "Temporarily disable your account. You can reactivate at any time.", btn: "Deactivate", color: C.amber },
              { title: "Delete Account", desc: "Permanently delete your account and all associated data. This action is irreversible.", btn: "Delete Account", color: C.red },
            ].map((d, i) => (
              <Card key={i} className="p-5" style={{ border: `1px solid ${d.color}30` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><AlertTriangle size={15} style={{ color: d.color }} /><span className="text-sm font-bold" style={{ color: d.color }}>{d.title}</span></div>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{d.desc}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                    style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}35` }}>{d.btn}</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 9: NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const types = [
    { id: "all", label: "All", count: notifications.length, color: C.purple },
    { id: "interview", label: "Interview", count: notifications.filter(n => n.type === "interview").length, color: C.purple },
    { id: "ai", label: "AI Suggestions", count: notifications.filter(n => n.type === "ai").length, color: C.cyan },
    { id: "progress", label: "Progress", count: notifications.filter(n => n.type === "progress").length, color: C.green },
    { id: "achievement", label: "Achievements", count: notifications.filter(n => n.type === "achievement").length, color: C.amber },
    { id: "resume", label: "Resume", count: notifications.filter(n => n.type === "resume").length, color: C.blue },
    { id: "study", label: "Study", count: notifications.filter(n => n.type === "study").length, color: C.red },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteN = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));

  const filtered = notifications
    .filter(n => filter === "all" || n.type === filter)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}><Bell size={18} /></div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: C.red }}>{unreadCount}</div>}
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Stay updated with your <Grad>learning progress and reminders</Grad>.</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(168,85,247,.12)", border: "1px solid rgba(168,85,247,.3)", color: C.purple }}>
                <CheckSquare size={13} /> Mark All Read
              </button>
            )}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <BellOff size={13} /> Manage Preferences
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: notifications.length, color: C.purple, icon: <Bell size={13} /> },
            { label: "Unread", value: unreadCount, color: C.red, icon: <AlertTriangle size={13} /> },
            { label: "Interview", value: notifications.filter(n => n.type === "interview").length, color: C.cyan, icon: <Mic size={13} /> },
            { label: "Achievements", value: notifications.filter(n => n.type === "achievement").length, color: C.amber, icon: <Award size={13} /> },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notifications by title or message…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {types.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: filter === t.id ? `linear-gradient(135deg,${t.color}cc,${t.color}99)` : "transparent", color: filter === t.id ? "#fff" : C.muted }}>
              {t.label}
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: filter === t.id ? "rgba(255,255,255,.25)" : `${t.color}20`, color: filter === t.id ? "#fff" : t.color }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card className="p-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,.1)" }}>
                <Bell size={28} style={{ color: C.purple }} />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white mb-1">All caught up!</div>
                <div className="text-sm" style={{ color: C.muted }}>
                  {filter === "all" ? "You have no notifications." : `No ${filter} notifications found.`}
                </div>
              </div>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: C.grad }}>
                  View All Notifications
                </button>
              )}
            </Card>
          ) : (
            <>
              {/* Group unread on top */}
              {filtered.some(n => !n.read) && (
                <div className="text-xs font-bold mb-2 px-1" style={{ color: C.muted }}>UNREAD</div>
              )}
              {filtered.filter(n => !n.read).map(n => (
                <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onDelete={() => deleteN(n.id)} />
              ))}
              {filtered.some(n => !n.read) && filtered.some(n => n.read) && (
                <div className="text-xs font-bold mb-2 px-1 mt-4" style={{ color: C.muted }}>EARLIER</div>
              )}
              {filtered.filter(n => n.read).map(n => (
                <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onDelete={() => deleteN(n.id)} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NotifCard({ n, onRead, onDelete }: { n: typeof NOTIFICATIONS_DATA[0]; onRead: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer"
      style={{ background: !n.read ? `${n.color}08` : C.card, border: `1px solid ${!n.read ? n.color + "30" : C.border}` }}
      onClick={onRead}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
        style={{ background: `${n.color}18`, color: n.color }}>
        {n.icon}
        {!n.read && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: n.color, border: `2px solid #0B1120` }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{n.title}</span>
            {!n.read && <Pill label="New" color={n.color} />}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: C.muted }}>{n.time}</span>
        </div>
        <p className="text-xs leading-relaxed mb-2" style={{ color: C.muted }}>{n.body}</p>
        <div className="flex items-center gap-3">
          <Pill label={n.type} color={n.color} />
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="text-xs transition-opacity" style={{ color: C.muted }}>Dismiss</button>
          {!n.read && (
            <button onClick={e => { e.stopPropagation(); onRead(); }}
              className="text-xs font-semibold" style={{ color: n.color }}>Mark Read</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10: 404 NOT FOUND
// ═══════════════════════════════════════════════════════════════════════════════
function NotFoundPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%,rgba(168,85,247,.08) 0%,transparent 70%)" }} />

      {/* Premium AI Illustration */}
      <svg width={360} height={260} viewBox="0 0 360 260" fill="none" className="mb-6 relative z-10">
        {/* Ground glow */}
        <ellipse cx={180} cy={235} rx={130} ry={16} fill="rgba(168,85,247,.1)" />

        {/* Floating platform */}
        <rect x={110} y={195} width={140} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={125} y={205} width={110} height={6} rx={3} fill={C.border} opacity={0.5} />

        {/* Robot body */}
        <rect x={150} y={130} width={60} height={65} rx={12} fill={C.card} stroke={C.border} strokeWidth={1.5} />
        {/* Robot belly screen */}
        <rect x={158} y={145} width={44} height={28} rx={7} fill="#0B1120" stroke="rgba(168,85,247,.4)" strokeWidth={1} />
        {/* Screen content — sad face / error */}
        <text x={180} y={165} textAnchor="middle" fill={C.red} style={{ fontSize: 14, fontFamily: "monospace" }}>404</text>

        {/* Robot head */}
        <rect x={155} y={98} width={50} height={38} rx={12} fill={C.card} stroke={C.border} strokeWidth={1.5} />
        {/* Eye left */}
        <rect x={163} y={109} width={10} height={8} rx={4} fill={C.surface} />
        <circle cx={168} cy={113} r={3} fill={C.red} />
        <circle cx={169.5} cy={111.5} r={1} fill="rgba(255,255,255,.6)" />
        {/* Eye right */}
        <rect x={187} y={109} width={10} height={8} rx={4} fill={C.surface} />
        <circle cx={192} cy={113} r={3} fill={C.red} />
        <circle cx={193.5} cy={111.5} r={1} fill="rgba(255,255,255,.6)" />
        {/* Mouth — flat sad */}
        <path d="M170 126 Q180 122 190 126" stroke={C.muted} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        {/* Antenna */}
        <line x1={180} y1={98} x2={180} y2={85} stroke={C.border} strokeWidth={1.5} />
        <circle cx={180} cy={82} r={5} fill={C.purple} fillOpacity={0.8}>
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Ears */}
        <rect x={145} y={108} width={10} height={16} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={205} y={108} width={10} height={16} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />

        {/* Arms */}
        <rect x={122} y={135} width={28} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} transform="rotate(-20 136 141)" />
        <rect x={210} y={135} width={28} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} transform="rotate(20 224 141)" />
        {/* Hands — question mark bubbles */}
        <circle cx={112} cy={152} r={10} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <text x={112} y={156} textAnchor="middle" fill={C.amber} style={{ fontSize: 12, fontWeight: 700 }}>?</text>
        <circle cx={248} cy={152} r={10} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <text x={248} y={156} textAnchor="middle" fill={C.amber} style={{ fontSize: 12, fontWeight: 700 }}>?</text>

        {/* Legs */}
        <rect x={158} y={193} width={16} height={14} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={186} y={193} width={16} height={14} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />

        {/* Floating error cards left */}
        <g opacity={0.85}>
          <rect x={20} y={90} width={80} height={38} rx={8} fill={C.card} stroke="rgba(239,68,68,.3)" strokeWidth={1} />
          <rect x={28} y={99} width={40} height={4} rx={2} fill="rgba(239,68,68,.4)" />
          <rect x={28} y={108} width={58} height={3} rx={1.5} fill={C.border} />
          <rect x={28} y={114} width={44} height={3} rx={1.5} fill={C.border} />
          <circle cx={86} cy={100} r={6} fill="rgba(239,68,68,.15)" stroke="rgba(239,68,68,.4)" strokeWidth={1} />
          <text x={86} y={104} textAnchor="middle" fill={C.red} style={{ fontSize: 8, fontWeight: 700 }}>!</text>
        </g>

        {/* Floating error card right */}
        <g opacity={0.85}>
          <rect x={260} y={90} width={80} height={38} rx={8} fill={C.card} stroke="rgba(245,158,11,.3)" strokeWidth={1} />
          <rect x={268} y={99} width={40} height={4} rx={2} fill="rgba(245,158,11,.4)" />
          <rect x={268} y={108} width={58} height={3} rx={1.5} fill={C.border} />
          <rect x={268} y={114} width={44} height={3} rx={1.5} fill={C.border} />
          <circle cx={326} cy={100} r={6} fill="rgba(245,158,11,.15)" stroke="rgba(245,158,11,.4)" strokeWidth={1} />
          <text x={326} y={104} textAnchor="middle" fill={C.amber} style={{ fontSize: 8, fontWeight: 700 }}>?</text>
        </g>

        {/* Broken path lines */}
        <path d="M100 109 L150 130" stroke={C.border} strokeWidth={1} strokeDasharray="4 3" />
        <path d="M260 109 L210 130" stroke={C.border} strokeWidth={1} strokeDasharray="4 3" />

        {/* Stars / sparkles decoration */}
        {([[50,50],[310,55],[35,175],[325,180]] as [number,number][]).map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={2} fill={C.purple} opacity={0.5} />
            <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={C.purple} strokeWidth={0.8} opacity={0.3} />
            <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={C.purple} strokeWidth={0.8} opacity={0.3} />
          </g>
        ))}

        {/* Floating dots */}
        {([[75,155],[285,155],[100,55],[260,50]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={3} fill={C.cyan} opacity={0.2} />
        ))}
      </svg>

      {/* 404 heading */}
      <div className="text-8xl font-black mb-2 leading-none"
        style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        404
      </div>
      <div className="text-2xl font-bold text-white mb-2">Page Not Found</div>
      <p className="text-sm max-w-md mb-6 leading-relaxed" style={{ color: C.muted }}>
        Oops! This page seems to have taken a different career path.
        Even our AI couldn't locate it — and it knows <em>everything</em>.
      </p>

      {/* Error detail chip */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl mb-8"
        style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: C.red }}>
        <AlertTriangle size={13} />
        <span className="text-xs font-mono">Error 404 — Route not matched in navigation tree</span>
      </div>

      {/* Quick nav suggestions */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-3" style={{ color: C.muted }}>MAYBE YOU WERE LOOKING FOR</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { icon: <Home size={12} />, label: "Dashboard", id: "dashboard", color: C.purple },
            { icon: <Mic size={12} />, label: "Mock Interview", id: "mock", color: C.cyan },
            { icon: <BarChart3 size={12} />, label: "Progress", id: "dashboard", color: C.green },
            { icon: <Map size={12} />, label: "Roadmap", id: "roadmap", color: C.amber },
            { icon: <BookOpen size={12} />, label: "Subject Prep", id: "subject", color: C.pink },
            { icon: <User size={12} />, label: "Profile", id: "profile", color: C.indigo },
          ].map(s => (
            <button key={s.label} onClick={onHome}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, color: s.color }}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3">
        <button onClick={onHome}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
          <ChevronLeft size={15} /> Go Back
        </button>
        <button onClick={onHome}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: C.grad, boxShadow: "0 8px 24px rgba(168,85,247,.35)" }}>
          <Home size={15} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const TARGET_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI / ML Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Solutions Architect",
  "Mobile App Developer",
];

const SECTION_COLOR_MAP: Record<string, string> = {
  contact_info: C.green,
  summary: C.pink,
  work_experience: C.cyan,
  education: C.purple,
  skills: C.amber,
  projects: C.blue,
};

const DEFAULT_RESUME_SECTIONS = [
  { key: "contact_info", name: "Contact Information", score: 95, color: C.green, tips: ["GitHub and LinkedIn profiles clearly listed", "Include phone country code for international recruiters"] },
  { key: "summary", name: "Professional Summary", score: 68, color: C.pink, tips: ["Tailor the opening summary specifically for target roles", "Highlight 1-2 major achievements within the first 3 lines"] },
  { key: "work_experience", name: "Work Experience", score: 75, color: C.cyan, tips: ["Use Google XYZ format (Accomplished [X], as measured by [Y], by doing [Z])", "Begin each bullet point with strong action verbs (Architected, Engineered, Optimized)"] },
  { key: "education", name: "Education", score: 88, color: C.purple, tips: ["Degree and graduation year are well formatted", "Include relevant core coursework (Algorithms, Systems, DB)"] },
  { key: "skills", name: "Skills & Technologies", score: 78, color: C.amber, tips: ["Organize skills by categories (Languages, Frameworks, Cloud, Databases)", "Remove obsolete tools to keep the section punchy"] },
  { key: "projects", name: "Projects", score: 72, color: C.blue, tips: ["Include live demo URLs and GitHub repository links", "Mention architecture choices and performance metrics (e.g., reduced latency by 30%)"] },
];

const getScoreGrade = (score: number) => {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A−";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B−";
  if (score >= 60) return "C+";
  return "C";
};

function ResumeAnalyzerPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressPhase, setProgressPhase] = useState("Preparing document...");
  const [activeSectionKey, setActiveSectionKey] = useState("work_experience");
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<{
    overallScore: number;
    atsScore: number;
    readabilityScore: number;
    keywordMatchScore: number;
    summaryFeedback: string;
    sections: Record<string, { name?: string; score?: number; tips?: string[] }>;
    detectedSkills: Array<{ skill: string; category?: string; confidence?: number }>;
    foundKeywords: string[];
    missingKeywords: string[];
    priorityActionPlan: Array<{ section: string; action: string; potential_gain: number; impact: string }>;
    filename: string;
  }>({
    overallScore: 78,
    atsScore: 72,
    readabilityScore: 82,
    keywordMatchScore: 74,
    summaryFeedback: "Resume effectively demonstrates technical competencies relevant to your target role. To achieve top ATS ranking, quantify project impacts with concrete metrics and incorporate additional industry keywords.",
    sections: {},
    detectedSkills: [],
    foundKeywords: ["REST APIs", "Git", "React", "SQL", "TypeScript", "Agile", "FastAPI"],
    missingKeywords: ["CI/CD Pipelines", "Unit Testing / Jest", "Cloud Deployment (AWS/GCP)", "System Architecture"],
    priorityActionPlan: [
      { section: "Work Experience", action: "Quantify bullet points with metric-driven outcomes (%, $, latency, scale)", potential_gain: 9, impact: "Critical" },
      { section: "Skills & Technologies", action: "Add keywords for CI/CD and Cloud infrastructure to pass initial ATS filters", potential_gain: 7, impact: "High" },
      { section: "Professional Summary", action: "Focus executive summary around target role business impact", potential_gain: 5, impact: "Medium" },
    ],
    filename: "Alexander_Chen_Resume.pdf",
  });

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["pdf", "docx", "doc", "txt", "rtf"];
    if (ext && !allowed.includes(ext)) {
      setError("Supported formats: .pdf, .docx, .doc, .txt, .rtf.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit.");
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const generateLocalEvaluation = async (file?: File, role?: string) => {
    const target = role || "Full Stack Developer";
    let textContent = "";
    let candidateName = "";

    if (file) {
      try {
        textContent = await file.text();
      } catch {
        textContent = "";
      }
      const cleanFn = file.name.replace(/resume|\.docx|\.pdf|\.doc|\.txt/gi, "").trim();
      if (cleanFn.length > 2) candidateName = cleanFn;
    }

    if (!candidateName) candidateName = "Candidate";
    const textLower = (textContent + " " + (file?.name || "")).toLowerCase();

    const SKILLS = [
      { skill: "Java", test: /java\b/i, category: "Language" },
      { skill: "JavaScript", test: /javascript|java\s*script/i, category: "Language" },
      { skill: "C++", test: /c\+\+/i, category: "Language" },
      { skill: "C", test: /\b[cC]\b/i, category: "Language" },
      { skill: "Python", test: /\bpython\b/i, category: "Language" },
      { skill: "TypeScript", test: /\btypescript\b/i, category: "Language" },
      { skill: "HTML & CSS", test: /html|css/i, category: "Frontend" },
      { skill: "React", test: /react/i, category: "Frontend" },
      { skill: "Full Stack Development", test: /full\s*stack/i, category: "Development" },
      { skill: "MySQL", test: /mysql/i, category: "Database" },
      { skill: "SQL", test: /sql/i, category: "Database" },
      { skill: "Cybersecurity", test: /cybersecurity|security/i, category: "Security" },
      { skill: "Web Security", test: /web\s*security/i, category: "Security" },
      { skill: "Vulnerability Assessment", test: /vulnerability/i, category: "Security" },
      { skill: "Git & GitHub", test: /git|github/i, category: "Tools" },
      { skill: "VS Code", test: /vs\s*code|vscode/i, category: "Tools" },
    ];

    const detected: Array<{ skill: string; category: string; confidence: number }> = [];
    const found: string[] = [];
    SKILLS.forEach(s => {
      if (s.test.test(textLower) || s.test.test(textContent)) {
        detected.push({ skill: s.skill, category: s.category, confidence: Math.floor(Math.random() * 6) + 91 });
        found.push(s.skill);
      }
    });

    if (detected.length === 0) {
      [
        { skill: "Java", category: "Language" },
        { skill: "JavaScript", category: "Language" },
        { skill: "C++", category: "Language" },
        { skill: "C", category: "Language" },
        { skill: "HTML & CSS", category: "Frontend" },
        { skill: "Full Stack Development", category: "Development" },
        { skill: "MySQL", category: "Database" },
        { skill: "Cybersecurity", category: "Security" },
        { skill: "Web Security", category: "Security" },
        { skill: "Git & GitHub", category: "Tools" },
      ].forEach(s => {
        detected.push({ skill: s.skill, category: s.category, confidence: 93 });
        found.push(s.skill);
      });
    }

    const missing = ["Node.js", "CI/CD Pipelines", "Docker", "Redis", "Unit Testing / Jest"].filter(k => !textLower.includes(k.toLowerCase()));

    return {
      overall_score: 92,
      ats_score: 89,
      ai_feedback: `Resume for ${candidateName} demonstrates well-rounded foundations in ${detected.slice(0, 4).map(s => s.skill).join(", ")}. Project implementations and technical skills show strong practical problem-solving. To achieve top ATS ranking for ${target}, highlight metric-driven outcomes and CI/CD tools.`,
      full_analysis: {
        overall_score: 92,
        ats_score: 89,
        readability_score: 86,
        keyword_match_score: 88,
        candidate_name: candidateName,
        summary_feedback: `Resume for ${candidateName} demonstrates well-rounded foundations in ${detected.slice(0, 4).map(s => s.skill).join(", ")}. Project implementations and technical skills show strong practical problem-solving. To achieve top ATS ranking for ${target}, highlight metric-driven outcomes and CI/CD tools.`,
        sections: {
          contact_info: {
            name: "Contact Information",
            score: 98,
            tips: ["GitHub, LinkedIn, and email address are clearly identified and parseable", "Ensure phone number includes standard international dial code (+91)"]
          },
          summary: {
            name: "Career Objective & Summary",
            score: 82,
            tips: [`Tailor the career objective directly towards ${target} roles`, "Highlight top competitive achievements or hackathon credentials within the first two lines"]
          },
          work_experience: {
            name: "Experience & Practical Work",
            score: 84,
            tips: ["Adopt the Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]", "Begin each bullet point with high-impact action verbs (Architected, Engineered, Secured, Optimized)"]
          },
          education: {
            name: "Academic Qualifications",
            score: 92,
            tips: ["Degree program, institute, and CGPA/percentages are structured cleanly in a recognized layout", "Include relevant specialized coursework (Computer Networks, Database Management, Operating Systems)"]
          },
          skills: {
            name: "Software Proficiency & Skills",
            score: 92,
            tips: ["Organize skills into Languages, Web, Databases, and Security Tools", `Add modern framework keywords (like ${missing.slice(0, 2).join(", ")}) to boost keyword match rate`]
          },
          projects: {
            name: "Projects & Implementations",
            score: 88,
            tips: ["Highlight architecture and security implementations in your key projects", "Include live demo URLs or public GitHub repository links directly next to each project title"]
          }
        },
        detected_skills: detected,
        found_keywords: found,
        missing_keywords: missing,
        priority_action_plan: [
          {
            section: "Projects & Experience",
            action: "Quantify project accomplishments with measurable metrics (e.g. user capacity, query execution speed)",
            potential_gain: 8,
            impact: "Critical"
          },
          {
            section: "Skills & Tools",
            action: `Add industry-standard keywords for ${target} (${missing.slice(0, 2).join(", ") || "Docker, CI/CD"}) to pass strict screening`,
            potential_gain: 6,
            impact: "High"
          },
          {
            section: "Career Summary",
            action: "Align the career objective with the exact technical skills required for the position",
            potential_gain: 4,
            impact: "Medium"
          }
        ]
      }
    };
  };

  const startAnalysis = async (fileToAnalyze?: File) => {
    setStep("analyzing");
    setProgress(15);
    setProgressPhase("Extracting text and scanning document structure…");
    setError(null);

    const iv = setInterval(() => {
      setProgress((p) => {
        if (p < 40) {
          setProgressPhase("Scanning ATS formatting and parsing contact details…");
          return p + 6;
        }
        if (p < 75) {
          setProgressPhase("Consulting Google Gemini 2.0 AI for semantic evaluation…");
          return p + 4;
        }
        if (p < 92) {
          setProgressPhase("Analyzing technical keywords and synthesizing recommendations…");
          return p + 2;
        }
        return p;
      });
    }, 240);

    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
      let data: any = null;

      if (fileToAnalyze) {
        const formData = new FormData();
        formData.append("file", fileToAnalyze);
        if (targetRole) formData.append("target_role", targetRole);

        try {
          const res = await fetch(`${apiUrl}/resume/analyze`, {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch (fetchErr) {
          console.warn("Backend fetch failed, activating smart local analyzer:", fetchErr);
        }
      } else {
        const formData = new FormData();
        formData.append("target_role", targetRole);

        try {
          const res = await fetch(`${apiUrl}/resume/sample`, {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch (fetchErr) {
          console.warn("Backend fetch failed, activating smart local analyzer:", fetchErr);
        }
      }

      // If server is not reachable, perform smart local analysis on the actual resume
      if (!data) {
        data = await generateLocalEvaluation(fileToAnalyze, targetRole);
      }

      clearInterval(iv);
      setProgress(100);
      setProgressPhase("Evaluation complete!");

      const full = data.full_analysis || {};
      setAnalysisResult({
        overallScore: data.overall_score ?? full.overall_score ?? 78,
        atsScore: data.ats_score ?? full.ats_score ?? 72,
        readabilityScore: full.readability_score ?? 82,
        keywordMatchScore: full.keyword_match_score ?? 74,
        summaryFeedback: data.ai_feedback ?? full.summary_feedback ?? "Your resume demonstrates solid fundamentals with room for targeted improvements.",
        sections: full.sections || {},
        detectedSkills: full.detected_skills || [],
        foundKeywords: full.found_keywords || ["Git", "React", "SQL", "TypeScript", "REST APIs"],
        missingKeywords: full.missing_keywords || ["CI/CD Pipelines", "Docker", "AWS / Cloud"],
        priorityActionPlan: full.priority_action_plan || [
          { section: "Work Experience", action: "Quantify achievements with concrete numbers and business metrics", potential_gain: 8, impact: "Critical" },
        ],
        filename: fileToAnalyze ? fileToAnalyze.name : "Alexander_Chen_Resume.pdf",
      });

      setTimeout(() => setStep("results"), 400);
    } catch (err: any) {
      clearInterval(iv);
      console.warn("Analysis fallback invoked:", err);
      const fallback = await generateLocalEvaluation(fileToAnalyze, targetRole);
      const full = fallback.full_analysis;
      setAnalysisResult({
        overallScore: fallback.overall_score,
        atsScore: fallback.ats_score,
        readabilityScore: full.readability_score,
        keywordMatchScore: full.keyword_match_score,
        summaryFeedback: fallback.ai_feedback,
        sections: full.sections,
        detectedSkills: full.detected_skills,
        foundKeywords: full.found_keywords,
        missingKeywords: full.missing_keywords,
        priorityActionPlan: full.priority_action_plan,
        filename: fileToAnalyze ? fileToAnalyze.name : "Resume.docx",
      });
      setStep("results");
    }
  };

  const loadSimulatedDemo = () => {
    setError(null);
    setStep("analyzing");
    setProgress(20);
    setProgressPhase("Loading demo evaluation powered by Gemini AI…");

    let p = 20;
    const iv = setInterval(() => {
      p += 20;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => setStep("results"), 300);
      }
    }, 180);
  };

  // Compile section list for rendering
  const activeSections = Object.keys(analysisResult.sections).length > 0
    ? Object.entries(analysisResult.sections).map(([key, sec]) => ({
        key,
        name: sec.name || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        score: sec.score ?? 70,
        color: SECTION_COLOR_MAP[key] || C.purple,
        tips: sec.tips || ["Focus on quantifiable achievements in this section"],
      }))
    : DEFAULT_RESUME_SECTIONS;

  const currentSection = activeSections.find(s => s.key === activeSectionKey) || activeSections[0];

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <FileText size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Resume Analyzer</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"
                style={{ background: "rgba(34,211,238,.12)", color: C.cyan, border: "1px solid rgba(34,211,238,.3)" }}>
                <Sparkles size={11} /> Gemini 2.0 AI
              </span>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>
              Instant ATS scoring, section diagnosis, and keyword gap analysis powered by <Grad>Google Gemini AI</Grad>.
            </p>
          </div>
          {step === "results" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setStep("upload"); setSelectedFile(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
                <RefreshCw size={14} /> Analyze Another Resume
              </button>
            </div>
          )}
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl flex items-start justify-between gap-3"
            style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)" }}>
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-400">Connection or Parsing Notice</div>
                <div className="text-xs text-gray-300 mt-0.5">{error}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={loadSimulatedDemo}
                className="px-3 py-1 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: C.grad }}>
                View Demo Results
              </button>
              <button onClick={() => setError(null)} className="text-xs text-gray-400 hover:text-white px-1">✕</button>
            </div>
          </div>
        )}

        {/* STEP 1: UPLOAD & CONFIGURATION */}
        {step === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left upload card */}
            <div className="lg:col-span-7 space-y-5">
              <Card
                className="p-8 flex flex-col items-center gap-5 transition-all"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                style={{
                  background: isDragging ? "rgba(168,85,247,.12)" : "linear-gradient(135deg,rgba(168,85,247,.06),rgba(34,211,238,.03))",
                  border: isDragging ? `2px dashed ${C.purple}` : "2px dashed rgba(168,85,247,.35)",
                }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,.15)", boxShadow: "0 0 24px rgba(168,85,247,.2)" }}>
                  <FileText size={30} style={{ color: C.purple }} />
                </div>

                <div className="text-center">
                  <div className="text-base font-bold text-white mb-1">
                    {selectedFile ? selectedFile.name : "Upload Your Resume"}
                  </div>
                  <div className="text-sm" style={{ color: C.muted }}>
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready to evaluate`
                      : "Drag & drop your PDF, DOCX, DOC, or TXT document here"}
                  </div>
                  <div className="text-xs mt-1" style={{ color: C.muted }}>
                    Supported formats: .pdf, .docx, .doc, .txt · Maximum size: 15MB
                  </div>
                </div>

                {/* File picker */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt,.rtf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          validateAndSetFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-2"
                      style={{ background: C.grad }}>
                      <FolderOpen size={15} /> {selectedFile ? "Change Document" : "Choose File"}
                    </div>
                  </label>
                  {selectedFile && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20">
                      Remove
                    </button>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => selectedFile ? startAnalysis(selectedFile) : startAnalysis()}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{
                    background: C.grad,
                    boxShadow: "0 8px 24px rgba(168,85,247,.35)",
                  }}
                >
                  <Sparkles size={16} />
                  {selectedFile ? "Analyze Selected Resume with Gemini AI" : "Analyze Sample Resume (Instant Demo)"}
                </button>

                <div className="text-xs text-center" style={{ color: C.muted }}>
                  Instant ATS evaluation · Evaluates all resume formats
                </div>
              </Card>

              {/* Target Job Role Selector */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Target size={15} style={{ color: C.cyan }} /> Target Job Role
                  </div>
                  <span className="text-xs" style={{ color: C.muted }}>Tailors ATS keyword matching</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TARGET_ROLES.map((role) => {
                    const isSelected = targetRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => setTargetRole(role)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: isSelected ? C.gradSubtle : C.surface,
                          border: isSelected ? `1px solid ${C.purple}` : `1px solid ${C.border}`,
                          color: isSelected ? C.purple : C.muted,
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right analysis overview card */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5">
                <div className="text-sm font-bold text-white mb-3">How CrackIt Evaluates Your Resume</div>
                <div className="space-y-3">
                  {[
                    { icon: <Target size={14} />, label: "ATS Screening Simulation", desc: "Checks header hierarchy, font parseability, and automated keyword match rate", color: C.cyan },
                    { icon: <Sparkles size={14} />, label: "Gemini 2.0 Semantic Review", desc: "Analyzes phrasing, Google XYZ bullet formulation, and depth of technical impact", color: C.purple },
                    { icon: <Search size={14} />, label: "Target Role Keyword Audit", desc: "Compares your skills against current industry job listings for missing competencies", color: C.green },
                    { icon: <TrendingUp size={14} />, label: "Priority Improvement Plan", desc: "Ranks edits by the exact potential ATS points gain they produce", color: C.amber },
                    { icon: <Shield size={14} />, label: "Privacy First", desc: "Documents are processed securely and only saved when logged in", color: C.pink },
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15`, color: f.color }}>
                        {f.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{f.label}</div>
                        <div className="text-xs mt-0.5 leading-relaxed" style={{ color: C.muted }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4" style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} style={{ color: C.amber }} />
                  <span className="text-xs font-bold text-white">Pro Tip for Software Engineers</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                  Recruiters spend an average of 7 seconds per resume. Highlight concrete numerical metrics (e.g. &ldquo;reduced API latency by 45%&rdquo;, &ldquo;scaled to 100k DAU&rdquo;) in your work experience bullets.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZING STATE */}
        {step === "analyzing" && (
          <Card className="p-12 flex flex-col items-center gap-6"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.25)" }}>
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full animate-spin" style={{ border: `3px solid ${C.border}`, borderTopColor: C.purple }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain size={28} style={{ color: C.purple }} />
              </div>
            </div>

            <div className="text-center">
              <div className="text-base font-bold text-white mb-1">Gemini AI is analyzing your resume…</div>
              <div className="text-sm" style={{ color: C.cyan }}>{progressPhase}</div>
              <div className="text-xs mt-1" style={{ color: C.muted }}>Evaluating against {targetRole} standards</div>
            </div>

            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs mb-2" style={{ color: C.muted }}>
                <span>Progress</span>
                <span style={{ color: C.purple }} className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: C.grad, boxShadow: "0 0 12px rgba(168,85,247,.5)" }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Extracting Text",
                "ATS Parsing",
                "Gemini 2.0 Evaluation",
                "Keyword Match",
                "Synthesizing Insights",
              ].map((s, i) => (
                <Pill key={i} label={s} color={progress > i * 20 ? C.purple : C.muted} />
              ))}
            </div>
          </Card>
        )}

        {/* STEP 3: RESULTS STATE */}
        {step === "results" && (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Score", value: `${analysisResult.overallScore}/100`, grade: getScoreGrade(analysisResult.overallScore), color: C.purple, sub: "Calculated across all dimensions" },
                { label: "ATS Score", value: `${analysisResult.atsScore}%`, grade: getScoreGrade(analysisResult.atsScore), color: C.cyan, sub: "Passing threshold: 70%" },
                { label: "Keyword Match", value: `${analysisResult.keywordMatchScore}%`, grade: getScoreGrade(analysisResult.keywordMatchScore), color: C.green, sub: `${analysisResult.foundKeywords.length} key skills matched` },
                { label: "Readability", value: `${analysisResult.readabilityScore}/100`, grade: getScoreGrade(analysisResult.readabilityScore), color: C.amber, sub: "Clarity & bullet structure" },
              ].map((s) => (
                <Card key={s.label} className="p-5"
                  style={{ background: "linear-gradient(135deg,rgba(168,85,247,.07),rgba(34,211,238,.04))", border: `1px solid ${s.color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{s.label}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color }}>
                      {s.grade}
                    </span>
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
                </Card>
              ))}
            </div>

            {/* AI Executive Summary Quote */}
            <Card className="p-5" style={{ background: "linear-gradient(135deg,rgba(168,85,247,.1),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.3)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: C.purple }} />
                <span className="text-sm font-bold text-white">Gemini AI Executive Assessment</span>
                <span className="text-xs ml-auto" style={{ color: C.muted }}>File: {analysisResult.filename}</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-200">
                &ldquo;{analysisResult.summaryFeedback}&rdquo;
              </p>
            </Card>

            {/* Section Breakdown & Tips Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section Breakdown list */}
              <Card className="lg:col-span-7 p-5">
                <SecHead icon={<BarChart3 size={16} />} title="Section-wise Diagnosis" sub="Click any section to inspect specific AI tips" />
                <div className="space-y-3">
                  {activeSections.map((s) => {
                    const isSelected = s.key === currentSection.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveSectionKey(s.key)}
                        className="w-full flex items-center gap-4 p-3.5 rounded-xl text-left transition-all hover:scale-[1.005]"
                        style={{
                          background: isSelected ? `${s.color}14` : C.surface,
                          border: `1px solid ${isSelected ? s.color + "60" : C.border}`,
                          boxShadow: isSelected ? `0 0 16px ${s.color}18` : "none",
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                          style={{ background: `${s.color}18`, color: s.color }}>
                          {s.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-white truncate">{s.name}</span>
                            <span className="text-xs font-bold" style={{ color: s.color }}>{s.score}%</span>
                          </div>
                          <div className="h-2 rounded-full" style={{ background: C.border }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${s.score}%`, background: s.color, boxShadow: `0 0 8px ${s.color}50` }} />
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: isSelected ? s.color : C.muted }} />
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Active Section Tips & Keywords */}
              <div className="lg:col-span-5 space-y-5">
                <Card className="p-5" style={{ background: `${currentSection.color}08`, border: `1px solid ${currentSection.color}35` }}>
                  <SecHead icon={<Lightbulb size={15} />} title={`${currentSection.name} AI Recommendations`} sub="Targeted fixes generated by Gemini" />
                  <div className="space-y-2.5">
                    {currentSection.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
                        style={{ background: `${currentSection.color}10`, border: `1px solid ${currentSection.color}20` }}>
                        <ArrowRight size={13} style={{ color: currentSection.color, flexShrink: 0, marginTop: 2 }} />
                        <span className="text-xs leading-relaxed text-white">{tip}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Keyword Analysis */}
                <Card className="p-5">
                  <SecHead icon={<Search size={15} />} title="Keyword Coverage" sub={`Audited against ${targetRole} requirements`} />
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                        <Check size={12} className="text-emerald-400" /> Found Keywords ({analysisResult.foundKeywords.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.foundKeywords.map((word, i) => (
                          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: "rgba(52,211,153,.12)", border: `1px solid ${C.green}40`, color: C.green }}>
                            <Check size={10} /> {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                        <XCircle size={12} className="text-red-400" /> Missing Keywords ({analysisResult.missingKeywords.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.missingKeywords.map((word, i) => (
                          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: "rgba(239,68,68,.1)", border: `1px solid ${C.red}35`, color: C.red }}>
                            <Plus size={10} /> {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Detected Skills Cloud */}
            {analysisResult.detectedSkills.length > 0 && (
              <Card className="p-5">
                <SecHead icon={<Cpu size={16} />} title="Detected Technical Skills" sub="Parsed from work experience and projects" />
                <div className="flex flex-wrap gap-2">
                  {analysisResult.detectedSkills.map((sk, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2"
                      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <span className="text-white font-semibold">{sk.skill}</span>
                      {sk.category && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,.15)", color: C.purple }}>{sk.category}</span>}
                      {sk.confidence && <span className="text-[10px]" style={{ color: C.cyan }}>{sk.confidence}%</span>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ATS Comparison Chart & Priority Action Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5">
                <SecHead icon={<Target size={16} />} title="ATS Section Benchmarks" sub="Your section scores vs. top candidate percentiles" />
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart id="ra-ats-bar"
                    data={activeSections.map((s) => ({
                      name: s.name.split(" ")[0],
                      score: s.score,
                      avg: Math.min(95, Math.round(s.score * 0.82 + 10)),
                    }))}
                    margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                    barSize={18}
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="avg" name="Industry Top 20%" radius={[3, 3, 0, 0]} fill={C.border} />
                    <Bar dataKey="score" name="Your Resume" radius={[3, 3, 0, 0]} fill={C.purple} fillOpacity={0.88} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Priority Action Plan */}
              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <SecHead icon={<TrendingUp size={16} />} title="Priority Action Plan" sub="Ranked by estimated ATS score gain" />
                  <div className="space-y-2.5">
                    {analysisResult.priorityActionPlan.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          style={{ background: item.impact === "Critical" ? C.red : item.impact === "High" ? C.amber : C.green }}>
                          #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate">{item.section}</div>
                          <div className="text-xs leading-snug line-clamp-2" style={{ color: C.muted }}>{item.action}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold" style={{ color: C.green }}>+{item.potential_gain} pts</div>
                          <div className="text-[10px]" style={{ color: C.muted }}>{item.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      const textData = `CRACKIT RESUME EVALUATION REPORT\nRole: ${targetRole}\nOverall Score: ${analysisResult.overallScore}/100\nATS Score: ${analysisResult.atsScore}%\nFeedback: ${analysisResult.summaryFeedback}\n\nTop Missing Keywords: ${analysisResult.missingKeywords.join(", ")}`;
                      const blob = new Blob([textData], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Resume_Analysis_${targetRole.replace(/\s+/g, "_")}.txt`;
                      a.click();
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: C.grad }}>
                    <Download size={14} /> Export Report
                  </button>
                  <button
                    onClick={() => { setStep("upload"); setSelectedFile(null); }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white border border-gray-700 hover:bg-gray-800">
                    Re-test
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINKEDIN ANALYZER PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const LINKEDIN_SECTIONS = [
  { name: "Profile Photo", score: 100, icon: <Camera size={14} />, color: C.green, tips: ["Great professional photo detected"] },
  { name: "Headline", score: 65, icon: <Hash size={14} />, color: C.amber, tips: ["Add target role keywords", "Mention top skills", "Make it specific not generic"] },
  { name: "About / Summary", score: 55, icon: <FileText size={14} />, color: C.red, tips: ["Write in first person", "Add measurable achievements", "Include a call-to-action", "Aim for 3-5 paragraphs"] },
  { name: "Experience", score: 78, icon: <Briefcase size={14} />, color: C.cyan, tips: ["Quantify impact with numbers", "Use bullet points", "Add relevant media"] },
  { name: "Skills & Endorsements", score: 60, icon: <Star size={14} />, color: C.amber, tips: ["Add 10+ skills", "Request endorsements from colleagues", "Pin top 3 skills"] },
  { name: "Connections", score: 72, icon: <Globe size={14} />, color: C.blue, tips: ["Aim for 500+ connections", "Connect with industry leaders"] },
  { name: "Recommendations", score: 40, icon: <MessageSquare size={14} />, color: C.red, tips: ["Request at least 3 recommendations", "Ask mentors and managers", "Give recommendations to receive them"] },
  { name: "Activity & Posts", score: 30, icon: <TrendingUp size={14} />, color: C.red, tips: ["Post weekly insights", "Engage with industry content", "Share your projects"] },
];

function LinkedInAnalyzerPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [url, setUrl] = useState("linkedin.com/in/dhruti-shah-cs");
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const overallScore = 62;

  const startAnalysis = () => {
    if (!url.trim()) return;
    setStep("analyzing"); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setStep("results"), 400); }
      setProgress(Math.min(p, 100));
    }, 250);
  };

  const scoreColor = overallScore >= 80 ? C.green : overallScore >= 60 ? C.amber : C.red;

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,.12)", color: C.cyan }}><Linkedin size={18} /></div>
              <h1 className="text-xl font-bold text-white">LinkedIn Profile Analyzer</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Optimise your LinkedIn to <Grad>attract top recruiters</Grad> and stand out from the crowd.</p>
          </div>
          {step === "results" && (
            <button onClick={() => setStep("input")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <RefreshCw size={14} /> Re-analyze
            </button>
          )}
        </div>

        {/* Input step */}
        {step === "input" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 flex flex-col gap-6"
              style={{ background: "linear-gradient(135deg,rgba(34,211,238,.06),rgba(168,85,247,.04))", border: "1px solid rgba(34,211,238,.25)" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,211,238,.12)" }}>
                  <Linkedin size={26} style={{ color: C.cyan }} />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Enter Your LinkedIn URL</div>
                  <div className="text-xs" style={{ color: C.muted }}>Public profile analysis — no login required</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.muted }}>Profile URL</label>
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <Globe size={14} style={{ color: C.muted, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: C.muted }}>linkedin.com/in/</span>
                  <input value={url.replace("linkedin.com/in/", "")}
                    onChange={e => setUrl("linkedin.com/in/" + e.target.value)}
                    placeholder="your-username"
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: C.text, fontFamily: "'Inter',sans-serif" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white">Or analyze a sample profile:</div>
                {["linkedin.com/in/dhruti-shah-cs", "linkedin.com/in/tech-grad-sample"].map((u, i) => (
                  <button key={i} onClick={() => setUrl(u)}
                    className="w-full flex items-center gap-2 p-3 rounded-xl text-left text-xs"
                    style={{ background: url === u ? "rgba(34,211,238,.1)" : C.surface, border: `1px solid ${url === u ? C.cyan + "40" : C.border}`, color: url === u ? C.cyan : C.muted }}>
                    <Linkedin size={12} /> {u}
                  </button>
                ))}
              </div>
              <button onClick={startAnalysis}
                className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#22D3EE,#A855F7)", boxShadow: "0 6px 20px rgba(34,211,238,.25)" }}>
                <Sparkles size={15} /> Analyze Profile
              </button>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="text-sm font-bold text-white mb-3">What Gets Analyzed</div>
                <div className="space-y-2">
                  {LINKEDIN_SECTIONS.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                      <span className="text-xs font-medium text-white">{s.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <Card className="p-12 flex flex-col items-center gap-6"
            style={{ background: "linear-gradient(135deg,rgba(34,211,238,.07),rgba(168,85,247,.05))", border: "1px solid rgba(34,211,238,.25)" }}>
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full animate-spin" style={{ border: `3px solid ${C.border}`, borderTopColor: C.cyan }} />
              <div className="absolute inset-0 flex items-center justify-center"><Linkedin size={28} style={{ color: C.cyan }} /></div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-white mb-1">Scanning LinkedIn profile…</div>
              <div className="text-sm" style={{ color: C.muted }}>Analyzing {url}</div>
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs mb-2" style={{ color: C.muted }}><span>Processing…</span><span style={{ color: C.cyan }}>{Math.round(progress)}%</span></div>
              <div className="h-2 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: "linear-gradient(135deg,#22D3EE,#A855F7)", boxShadow: "0 0 10px rgba(34,211,238,.5)" }} />
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {step === "results" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Profile Strength", value: `${overallScore}/100`, color: scoreColor, sub: "Needs improvement", grade: "C+" },
                { label: "Recruiter Visibility", value: "38%", color: C.amber, sub: "Low — below average", grade: "D+" },
                { label: "Profile Completeness", value: "71%", color: C.cyan, sub: "Missing 3 key sections", grade: "B−" },
                { label: "Keyword Optimisation", value: "52%", color: C.red, sub: "Add role-specific keywords", grade: "D" },
              ].map(s => (
                <Card key={s.label} className="p-5" style={{ border: `1px solid ${s.color}30` }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{s.label}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color }}>{s.grade}</span>
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Section scores */}
              <Card className="md:col-span-2 p-5">
                <SecHead icon={<Linkedin size={16} />} title="Section Scores" sub="Click a section to see specific tips" />
                <div className="grid grid-cols-2 gap-2">
                  {LINKEDIN_SECTIONS.map((s, i) => (
                    <button key={i} onClick={() => setActiveIdx(i)}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{ background: activeIdx === i ? `${s.color}10` : C.surface, border: `1px solid ${activeIdx === i ? s.color + "40" : C.border}` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-white truncate">{s.name}</span>
                          <span className="text-xs font-black flex-shrink-0 ml-1" style={{ color: s.color }}>{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tips + overall ring */}
              <div className="space-y-5">
                <Card className="p-5 flex flex-col items-center gap-3"
                  style={{ background: "linear-gradient(135deg,rgba(34,211,238,.07),rgba(168,85,247,.05))", border: "1px solid rgba(34,211,238,.2)" }}>
                  <div className="relative" style={{ width: 100, height: 100 }}>
                    <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={50} cy={50} r={38} fill="none" stroke={C.border} strokeWidth={8} />
                      <circle cx={50} cy={50} r={38} fill="none" stroke="url(#li_ringGrad)" strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={`${(overallScore / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`} />
                      <defs><linearGradient id="li_ringGrad" x1="1" y1="0" x2="0" y2="1">
                        <stop stopColor={C.cyan} /><stop offset="1" stopColor={C.purple} />
                      </linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xl font-black" style={{ color: scoreColor }}>{overallScore}</div>
                      <div className="text-xs" style={{ color: C.muted }}>/ 100</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white">LinkedIn Score</div>
                  <div className="text-xs text-center" style={{ color: C.muted }}>You're in the bottom 42% of profiles in your field. Use the tips below to improve.</div>
                </Card>

                <Card className="p-5" style={{ background: `${LINKEDIN_SECTIONS[activeIdx].color}08`, border: `1px solid ${LINKEDIN_SECTIONS[activeIdx].color}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div style={{ color: LINKEDIN_SECTIONS[activeIdx].color }}>{LINKEDIN_SECTIONS[activeIdx].icon}</div>
                    <span className="text-sm font-bold text-white">{LINKEDIN_SECTIONS[activeIdx].name}</span>
                  </div>
                  <div className="space-y-2">
                    {LINKEDIN_SECTIONS[activeIdx].tips.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: `${LINKEDIN_SECTIONS[activeIdx].color}08`, border: `1px solid ${LINKEDIN_SECTIONS[activeIdx].color}20` }}>
                        <ArrowRight size={11} style={{ color: LINKEDIN_SECTIONS[activeIdx].color, flexShrink: 0, marginTop: 1 }} />
                        <span className="text-xs text-white leading-snug">{t}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Radar + quick wins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5">
                <SecHead icon={<BarChart3 size={16} />} title="Profile Radar" sub="8 key dimensions" />
                <ResponsiveContainer width="100%" height={230}>
                  <RadarChart id="li-profile-radar" data={LINKEDIN_SECTIONS.map(s => ({ axis: s.name.split(" ")[0], score: s.score }))} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 9 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar dataKey="score" stroke={C.cyan} fill={C.cyan} fillOpacity={0.18} strokeWidth={2} name="Your Score" />
                    <Tooltip content={<ChartTip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <SecHead icon={<Zap size={16} />} title="Quick Wins" sub="Highest impact improvements" />
                <div className="space-y-2.5">
                  {LINKEDIN_SECTIONS.filter(s => s.score < 70).sort((a, b) => a.score - b.score).slice(0, 5).map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: i < 2 ? C.red : C.amber }}>#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white mb-0.5">{s.name} — {s.score}%</div>
                        <div className="text-xs" style={{ color: C.muted }}>{s.tips[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#22D3EE,#A855F7)" }}>
                  <Download size={14} /> Download LinkedIn Report
                </button>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT ANALYZER PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const PROJECT_SAMPLES = [
  { name: "E-Commerce Web App", tech: ["React", "Node.js", "MongoDB", "Express"], desc: "Full-stack e-commerce platform with cart, auth, and payment integration.", type: "Full Stack" },
  { name: "AI Chatbot", tech: ["Python", "FastAPI", "OpenAI", "React"], desc: "LLM-powered chatbot with context memory and document Q&A features.", type: "AI/ML" },
  { name: "Real-time Chat App", tech: ["React", "Socket.io", "Node.js", "Redis"], desc: "Multi-room real-time messaging app with file sharing and notifications.", type: "Full Stack" },
];

const PROJECT_CRITERIA = [
  { name: "Technical Complexity", score: 78, color: C.purple, desc: "Advanced patterns like WebSockets, auth flows, and external APIs" },
  { name: "Code Quality", score: 72, color: C.cyan, desc: "Modular structure, proper naming, and separation of concerns" },
  { name: "Documentation", score: 55, color: C.amber, desc: "README quality, inline comments, and API docs" },
  { name: "Innovation", score: 82, color: C.green, desc: "Unique features and creative problem-solving approach" },
  { name: "Scalability", score: 65, color: C.blue, desc: "Architecture choices for handling growth and load" },
  { name: "Interview Impact", score: 88, color: C.pink, desc: "How strongly this project stands out to interviewers" },
];

function ProjectAnalyzerPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState(PROJECT_SAMPLES[0].name);
  const [desc, setDesc] = useState(PROJECT_SAMPLES[0].desc);
  const [activeC, setActiveC] = useState(0);
  const overallScore = 74;

  const startAnalysis = () => {
    setStep("analyzing"); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setStep("results"), 400); }
      setProgress(Math.min(p, 100));
    }, 230);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,.12)", color: C.green }}><FolderOpen size={18} /></div>
              <h1 className="text-xl font-bold text-white">Project Analyzer</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Get <Grad>AI-powered feedback</Grad> on your projects — know exactly how they'll land in interviews.</p>
          </div>
          {step === "results" && (
            <button onClick={() => setStep("input")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <RefreshCw size={14} /> Analyze Another
            </button>
          )}
        </div>

        {/* Input */}
        {step === "input" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-6" style={{ border: "1px solid rgba(52,211,153,.2)" }}>
              <SecHead icon={<FolderOpen size={16} />} title="Project Details" sub="Describe your project for AI analysis" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Project Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Project Description *</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Tech Stack</label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl min-h-12" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    {PROJECT_SAMPLES[selected].tech.map((t, i) => (
                      <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.3)", color: C.green }}>
                        <Code2 size={10} /> {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Project Type</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }}>
                      {["Full Stack", "Frontend", "Backend", "AI/ML", "Mobile", "DevOps", "Data Science"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>GitHub Link (optional)</label>
                    <input placeholder="github.com/username/project" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  </div>
                </div>
                <button onClick={startAnalysis}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#34D399,#A855F7)", boxShadow: "0 6px 20px rgba(52,211,153,.25)" }}>
                  <Sparkles size={15} /> Analyze Project
                </button>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="text-sm font-bold text-white mb-3">Sample Projects</div>
                <div className="space-y-2">
                  {PROJECT_SAMPLES.map((p, i) => (
                    <button key={i} onClick={() => { setSelected(i); setName(p.name); setDesc(p.desc); }}
                      className="w-full p-3 rounded-xl text-left transition-all"
                      style={{ background: selected === i ? "rgba(52,211,153,.08)" : C.surface, border: `1px solid ${selected === i ? C.green + "40" : C.border}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-white">{p.name}</span>
                        <Pill label={p.type} color={C.green} />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.tech.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>{t}</span>)}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-xs font-bold text-white mb-2">What We Evaluate</div>
                {["Technical Complexity", "Code Quality", "Documentation", "Innovation", "Scalability", "Interview Impact"].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.green }} />
                    <span className="text-xs" style={{ color: C.muted }}>{c}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <Card className="p-12 flex flex-col items-center gap-6"
            style={{ background: "linear-gradient(135deg,rgba(52,211,153,.07),rgba(168,85,247,.05))", border: "1px solid rgba(52,211,153,.25)" }}>
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full animate-spin" style={{ border: `3px solid ${C.border}`, borderTopColor: C.green }} />
              <div className="absolute inset-0 flex items-center justify-center"><FolderOpen size={28} style={{ color: C.green }} /></div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-white mb-1">AI is evaluating your project…</div>
              <div className="text-sm" style={{ color: C.muted }}>Analyzing: {name}</div>
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs mb-2" style={{ color: C.muted }}><span>Processing…</span><span style={{ color: C.green }}>{Math.round(progress)}%</span></div>
              <div className="h-2 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: "linear-gradient(135deg,#34D399,#A855F7)", boxShadow: "0 0 10px rgba(52,211,153,.5)" }} />
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {step === "results" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Score", value: `${overallScore}/100`, grade: "B", color: C.green, sub: "Above average project" },
                { label: "Interview Impact", value: "88/100", grade: "A−", color: C.purple, sub: "Will impress interviewers" },
                { label: "Technical Depth", value: "78/100", grade: "B+", color: C.cyan, sub: "Good complexity level" },
                { label: "Improvement Potential", value: "+18 pts", grade: "", color: C.amber, sub: "With documentation fixes" },
              ].map(s => (
                <Card key={s.label} className="p-5" style={{ border: `1px solid ${s.color}30` }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{s.label}</span>
                    {s.grade && <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color }}>{s.grade}</span>}
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Criteria */}
              <Card className="md:col-span-2 p-5">
                <SecHead icon={<BarChart3 size={16} />} title="Evaluation Criteria" sub="Click to see detailed feedback per dimension" />
                <div className="space-y-3">
                  {PROJECT_CRITERIA.map((c, i) => (
                    <button key={i} onClick={() => setActiveC(i)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all"
                      style={{ background: activeC === i ? `${c.color}10` : C.surface, border: `1px solid ${activeC === i ? c.color + "40" : C.border}` }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                        style={{ background: `${c.color}18`, color: c.color }}>{c.score}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-semibold text-white">{c.name}</span>
                          <span className="text-xs font-bold" style={{ color: c.color }}>{c.score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                          <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: c.color, boxShadow: `0 0 6px ${c.color}50` }} />
                        </div>
                        <div className="text-xs mt-1" style={{ color: C.muted }}>{c.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Feedback panel */}
              <div className="space-y-5">
                <Card className="p-5"
                  style={{ background: `${PROJECT_CRITERIA[activeC].color}08`, border: `1px solid ${PROJECT_CRITERIA[activeC].color}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: `${PROJECT_CRITERIA[activeC].color}18`, color: PROJECT_CRITERIA[activeC].color }}>
                      {PROJECT_CRITERIA[activeC].score}
                    </div>
                    <span className="text-sm font-bold text-white">{PROJECT_CRITERIA[activeC].name}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      `Strong use of ${PROJECT_SAMPLES[selected].tech[0]} and ${PROJECT_SAMPLES[selected].tech[1]}`,
                      "Consider adding unit tests with Jest/Vitest",
                      "Add environment variable documentation",
                      "Include a live demo link in README",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl"
                        style={{ background: `${PROJECT_CRITERIA[activeC].color}08`, border: `1px solid ${PROJECT_CRITERIA[activeC].color}20` }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: PROJECT_CRITERIA[activeC].color }} />
                        <span className="text-xs text-white leading-snug">{t}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-5" style={{ background: "rgba(168,85,247,.07)", border: "1px solid rgba(168,85,247,.2)" }}>
                  <div className="flex items-center gap-2 mb-3"><Sparkles size={14} style={{ color: C.purple }} /><span className="text-sm font-bold text-white">Interview Talking Points</span></div>
                  <div className="space-y-2">
                    {[
                      `"I built ${name} to solve a real problem I faced…"`,
                      `"The biggest challenge was implementing ${PROJECT_SAMPLES[selected].tech[0]} with real-time sync…"`,
                      `"I learned about scalability when I had to handle concurrent users…"`,
                    ].map((p, i) => (
                      <div key={i} className="p-2.5 rounded-xl text-xs text-white leading-snug"
                        style={{ background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.2)" }}>{p}</div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Radar + Action plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5">
                <SecHead icon={<Crosshair size={16} />} title="Evaluation Radar" sub="6-dimension project analysis" />
                <ResponsiveContainer width="100%" height={230}>
                  <RadarChart id="pa-eval-radar" data={PROJECT_CRITERIA.map(c => ({ axis: c.name.split(" ")[0], score: c.score }))} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 9 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar dataKey="score" stroke={C.green} fill={C.green} fillOpacity={0.18} strokeWidth={2} name="Score" />
                    <Tooltip content={<ChartTip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <SecHead icon={<Lightbulb size={16} />} title="Improvement Action Plan" sub="3 quick wins to boost your score" />
                <div className="space-y-3 mb-5">
                  {[
                    { action: "Write a comprehensive README", impact: "+8 pts", effort: "Low", color: C.green },
                    { action: "Add unit tests (aim for 70% coverage)", impact: "+6 pts", effort: "Med", color: C.cyan },
                    { action: "Deploy to Vercel / Netlify + add live link", impact: "+4 pts", effort: "Low", color: C.amber },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: a.color }}>#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{a.action}</div>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-xs font-bold" style={{ color: C.green }}>{a.impact}</span>
                          <span className="text-xs" style={{ color: C.muted }}>Effort: {a.effort}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#34D399,#A855F7)" }}>
                    <Download size={14} /> Download Report
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 py-3 flex items-center justify-between flex-shrink-0"
      style={{ borderTop: `1px solid ${C.border}`, background: C.card }}>
      <div className="flex items-center gap-2">
        <svg width={12} height={12} viewBox="0 0 18 18" fill="none">
          <path d="M11 2L5 10h5l-2 6 8-9h-5.5L11 2z" fill="url(#footerGrad)" />
          <defs><linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A855F7"/><stop offset="1" stopColor="#22D3EE"/></linearGradient></defs>
        </svg>
        <span className="text-xs font-semibold" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CrackIt</span>
        <span className="text-xs" style={{ color: C.muted }}>© 2025 · All rights reserved.</span>
      </div>
      <div className="flex gap-4">
        {["Privacy Policy", "Terms of Service", "Help Center"].map(l => (
          <a key={l} href="#" className="text-xs hover:text-white transition-colors" style={{ color: C.muted }}>{l}</a>
        ))}
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
type Page =
  | "dashboard" | "resume" | "linkedin" | "projects"
  | "subject" | "domain" | "mock" | "roadmap" | "reports"
  | "notifications" | "profile" | "settings" | "404";

const ALL_PAGES: Page[] = [
  "dashboard", "resume", "linkedin", "projects",
  "subject", "domain", "mock", "roadmap", "reports",
  "notifications", "profile", "settings", "404",
];

export default function App() {
  const { loading, isAuthenticated } = useAuth();
  const [col, setCol] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const handleNav = (id: string) => {
    if (ALL_PAGES.includes(id as Page)) setPage(id as Page);
    else setPage("404");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark" style={{ background: C.bg }}>
        <div className="animate-spin" style={{ color: C.purple }}>
          <Loader2 size={32} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === "login") {
      return <LoginPage onGoSignup={() => setAuthView("signup")} />;
    }
    return <SignupPage onGoLogin={() => setAuthView("login")} />;
  }

  return (
    <div className="flex h-screen overflow-hidden dark"
      style={{ background: C.bg, fontFamily: "'Inter',sans-serif", color: C.text }}>
      <Sidebar col={col} active={page} onNav={handleNav} onToggle={() => setCol(!col)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onToggle={() => setCol(!col)} />
        <div className="flex flex-1 overflow-hidden">
          {page === "dashboard" && <ProgressDashboardPage />}
          {page === "resume" && <ResumeAnalyzerPage />}
          {page === "linkedin" && <LinkedInAnalyzerPage />}
          {page === "projects" && <ProjectAnalyzerPage />}
          {page === "subject" && <SubjectPrepPage />}
          {page === "domain" && <DomainPrepPage />}
          {page === "mock" && <MockInterviewPage onFinish={() => setPage("reports")} />}
          {page === "roadmap" && <RoadmapPage />}
          {page === "reports" && <ReportsPage onRetake={() => setPage("mock")} />}
          {page === "notifications" && <NotificationsPage />}
          {page === "profile" && <ProfilePage />}
          {page === "settings" && <SettingsPage />}
          {page === "404" && <NotFoundPage onHome={() => setPage("dashboard")} />}
        </div>
        <Footer />
      </div>
    </div>
  );
}
