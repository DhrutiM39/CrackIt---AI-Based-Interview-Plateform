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
  const [selected, setSelected] = useState("web");
  const dom = DOMAINS.find(d => d.id === selected)!;

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
            { label: "Domains Enrolled", value: "3/8", icon: <Boxes size={16} />, color: C.purple },
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
          {DOMAINS.map(d => (
            <DomainCard key={d.id} d={d} selected={selected === d.id} onSelect={() => setSelected(d.id)} />
          ))}
        </div>

        {/* Selected domain header */}
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3: AI MOCK INTERVIEW
// ═══════════════════════════════════════════════════════════════════════════════


export default DomainPrepPage;
