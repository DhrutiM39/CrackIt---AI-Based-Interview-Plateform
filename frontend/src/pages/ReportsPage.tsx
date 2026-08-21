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


export default ReportsPage;
