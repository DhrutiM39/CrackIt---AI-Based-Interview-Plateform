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

export default ProjectAnalyzerPage;
