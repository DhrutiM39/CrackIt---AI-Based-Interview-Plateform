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

export default RoadmapPage;
