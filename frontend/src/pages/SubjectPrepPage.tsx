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
  const topics = [
    { name: "Arrays & Strings", done: true, q: 24 },
    { name: "Linked Lists", done: true, q: 18 },
    { name: "Binary Trees", done: true, q: 21 },
    { name: "Binary Search Trees", done: false, q: 15, current: true },
    { name: "Heaps & Priority Queues", done: false, q: 12 },
    { name: "Graphs (BFS/DFS)", done: false, q: 20 },
    { name: "Dynamic Programming", done: false, q: 28 },
  ];
  const mockScores = [
    { test: "Mock 1", score: 62 }, { test: "Mock 2", score: 71 },
    { test: "Mock 3", score: 68 }, { test: "Mock 4", score: 79 }, { test: "Mock 5", score: 84 },
  ];
  const weakAreas = [
    { area: "Graph Algorithms", score: 42, color: C.red },
    { area: "Dynamic Programming", score: 55, color: C.amber },
    { area: "Segment Trees", score: 38, color: C.red },
  ];
  const importantQs = [
    { q: "What is the time complexity of Quicksort in best, average and worst case?", freq: "Very High", tag: "Complexity" },
    { q: "Explain the difference between DFS and BFS with use cases.", freq: "High", tag: "Graphs" },
    { q: "How does a HashMap work internally in Java?", freq: "Very High", tag: "Hashing" },
    { q: "Describe the process of cycle detection in a directed graph.", freq: "Medium", tag: "Graphs" },
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
              <button className="text-xs flex-shrink-0 px-2.5 py-1 rounded-lg"
                style={{ background: `${s.color}15`, color: s.color }}>Answer</button>
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
  const [selected, setSelected] = useState("dsa");
  const selectedSubject = SUBJECTS.find(s => s.id === selected)!;

  const overallProgress = Math.round(SUBJECTS.reduce((a, s) => a + s.progress, 0) / SUBJECTS.length);
  const totalDone = SUBJECTS.reduce((a, s) => a + s.done, 0);
  const totalTopics = SUBJECTS.reduce((a, s) => a + s.total, 0);

  const radarData = SUBJECTS.slice(0, 6).map(s => ({ subject: s.name.split(" ")[0], A: s.progress }));

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
            { label: "Subjects Active", value: `${SUBJECTS.filter(s => s.progress > 0).length}/8`, icon: <BookOpen size={16} />, color: C.green },
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
          {SUBJECTS.map(s => (
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


export default SubjectPrepPage;
