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


export default MockInterviewPage;
