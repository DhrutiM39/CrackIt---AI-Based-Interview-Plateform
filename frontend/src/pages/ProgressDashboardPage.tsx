import React, { useEffect, useRef, useState } from "react";
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
  UserCheck, Bookmark, CheckSquare,
} from "lucide-react";
const Rocket = Zap;
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area,
  PieChart as RePieChart, Pie,
} from "recharts";
import { C } from "../lib/tokens";
import { Card, ChartTip, Grad, Pill, SecHead, ToggleSwitch } from "../components/shared";

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

export default ProgressDashboardPage;
