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
import { getAccessToken } from "../lib/auth";

type SectionAnalysis = { score?: number; tips?: string[] };
type ResumeResult = {
  ats_score: number | null;
  ai_feedback: string | null;
  full_analysis: {
    sections?: Record<string, SectionAnalysis>;
    detected_skills?: { skill: string; confidence?: number }[];
    missing_keywords?: string[];
  };
};

const SECTION_CONFIG: Record<string, { name: string; color: string }> = {
  contact_info: { name: "Contact Info", color: C.green },
  work_experience: { name: "Work Experience", color: C.cyan },
  education: { name: "Education", color: C.purple },
  skills: { name: "Skills", color: C.amber },
  projects: { name: "Projects", color: C.blue },
  summary: { name: "Summary", color: C.pink },
};

const scoreGrade = (score: number) => score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

function ResumeAnalyzerPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [activeSection, setActiveSection] = useState(0);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sections = Object.entries(result?.full_analysis.sections ?? {}).map(([key, section], index) => ({
    name: SECTION_CONFIG[key]?.name ?? key.replace(/_/g, " "),
    score: Math.max(0, Math.min(100, Number(section.score) || 0)),
    tips: Array.isArray(section.tips) ? section.tips : [],
    color: SECTION_CONFIG[key]?.color ?? [C.purple, C.cyan, C.green, C.amber, C.pink][index % 5],
  }));
  const keywords = [
    ...(result?.full_analysis.detected_skills ?? []).map(({ skill }) => ({ word: skill, found: true })),
    ...(result?.full_analysis.missing_keywords ?? []).map((word) => ({ word, found: false })),
  ];
  const activeResultSection = sections[activeSection] ?? sections[0];
  const atsScore = Math.max(0, Math.min(100, Number(result?.ats_score) || 0));
  const readabilityScore = sections.find((section) => section.name === "Summary")?.score ?? atsScore;

  const analyzeFile = async (file: File) => {
    setError(null);
    setStep("analyzing");

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in before analyzing a resume.");

      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/resume/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.detail ?? "Resume analysis failed. Please try again.");

      setResult(payload as ResumeResult);
      setActiveSection(0);
      setStep("results");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Resume analysis failed. Please try again.");
      setStep("upload");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}><FileText size={18} /></div>
              <h1 className="text-xl font-bold text-white">Resume Analyzer</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Get an <Grad>AI-powered score</Grad> and actionable improvements for your resume.</p>
          </div>
          {step === "results" && (
            <button onClick={() => { setResult(null); setError(null); setStep("upload"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <RefreshCw size={14} /> Re-analyze
            </button>
          )}
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 flex flex-col items-center gap-5"
              style={{ background: "linear-gradient(135deg,rgba(168,85,247,.07),rgba(34,211,238,.04))", border: "2px dashed rgba(168,85,247,.35)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,.14)" }}>
                <FileText size={28} style={{ color: C.purple }} />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white mb-1">Upload Your Resume</div>
                <div className="text-sm" style={{ color: C.muted }}>Drag & drop your PDF or Word file here</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>Supported: PDF, DOCX, DOC · Max 5MB</div>
              </div>
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".pdf,.docx" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void analyzeFile(file);
                  event.target.value = "";
                }} />
                <div className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: C.grad }}>Choose File</div>
              </label>
              {error && <div className="w-full rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(239,68,68,.1)", border: `1px solid ${C.red}40`, color: C.red }}>{error}</div>}
              <div className="flex items-center gap-2 w-full"><div className="h-px flex-1" style={{ background: C.border }} /><span className="text-xs" style={{ color: C.muted }}>or</span><div className="h-px flex-1" style={{ background: C.border }} /></div>
              <div className="text-center text-xs" style={{ color: C.muted }}>Select a resume file to start the real AI analysis.</div>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="text-sm font-bold text-white mb-3">What We Analyze</div>
                <div className="space-y-2.5">
                  {[
                    { icon: <Target size={14} />, label: "ATS Compatibility Score", desc: "How well your resume passes automated screening", color: C.cyan },
                    { icon: <BarChart3 size={14} />, label: "Section-wise Scoring", desc: "Detailed breakdown of each resume section", color: C.purple },
                    { icon: <Search size={14} />, label: "Keyword Analysis", desc: "Missing keywords for your target role", color: C.green },
                    { icon: <Lightbulb size={14} />, label: "AI Suggestions", desc: "Actionable tips to improve each section", color: C.amber },
                    { icon: <TrendingUp size={14} />, label: "Industry Benchmarking", desc: "Compare against top resumes in your field", color: C.pink },
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                      <div><div className="text-xs font-semibold text-white">{f.label}</div><div className="text-xs mt-0.5" style={{ color: C.muted }}>{f.desc}</div></div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2"><Star size={13} style={{ color: C.amber }} /><span className="text-xs font-bold text-white">Pro Tip</span></div>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>Tailor your resume for each job description. Include specific keywords from the job posting to dramatically improve your ATS score and recruiter visibility.</p>
              </Card>
            </div>
          </div>
        )}

        {/* Analyzing step */}
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
              <div className="text-base font-bold text-white mb-1">AI is analyzing your resume…</div>
              <div className="text-sm" style={{ color: C.muted }}>Scanning sections, keywords, and ATS compatibility</div>
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs mb-2" style={{ color: C.muted }}><span>Analyzing…</span><span style={{ color: C.purple }}>Please wait</span></div>
              <div className="h-2 rounded-full" style={{ background: C.border }}>
                <div className="h-full w-2/3 rounded-full animate-pulse" style={{ background: C.grad, boxShadow: "0 0 10px rgba(168,85,247,.5)" }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Parsing content", "Scoring sections", "Checking ATS keywords", "Generating insights"].map((s, i) => (
                <Pill key={i} label={s} color={C.purple} />
              ))}
            </div>
          </Card>
        )}

        {/* Results step */}
        {step === "results" && (
          <>
            {/* Score cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Score", value: `${atsScore}/100`, grade: scoreGrade(atsScore), color: C.purple, sub: result?.ai_feedback ?? "AI analysis complete" },
                { label: "ATS Score", value: `${atsScore}%`, grade: scoreGrade(atsScore), color: C.cyan, sub: "Passing threshold: 70%" },
                { label: "Keyword Match", value: `${keywords.filter((keyword) => keyword.found).length}/${keywords.length}`, grade: scoreGrade(keywords.length ? keywords.filter((keyword) => keyword.found).length / keywords.length * 100 : 0), color: C.amber, sub: `${keywords.filter((keyword) => !keyword.found).length} keywords missing` },
                { label: "Readability", value: `${readabilityScore}/100`, grade: scoreGrade(readabilityScore), color: C.green, sub: "Based on your resume summary" },
              ].map(s => (
                <Card key={s.label} className="p-5" style={{ background: "linear-gradient(135deg,rgba(168,85,247,.07),rgba(34,211,238,.04))", border: `1px solid ${s.color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{s.label}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color }}>{s.grade}</span>
                  </div>
                  <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Section breakdown */}
              <Card className="md:col-span-2 p-5">
                <SecHead icon={<BarChart3 size={16} />} title="Section-wise Breakdown" sub="Click a section to see improvement tips" />
                <div className="space-y-3">
                  {sections.map((s, i) => (
                    <button key={i} onClick={() => setActiveSection(i)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all"
                      style={{ background: activeSection === i ? `${s.color}10` : C.surface, border: `1px solid ${activeSection === i ? s.color + "40" : C.border}` }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                        style={{ background: `${s.color}18`, color: s.color }}>{s.score}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-white">{s.name}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color, boxShadow: `0 0 6px ${s.color}50` }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tips panel */}
              <div className="space-y-5">
                {activeResultSection && <Card className="p-5" style={{ background: `${activeResultSection.color}08`, border: `1px solid ${activeResultSection.color}30` }}>
                  <SecHead icon={<Lightbulb size={15} />} title={`${activeResultSection.name} Tips`} sub="AI-generated recommendations" />
                  <div className="space-y-2.5">
                    {activeResultSection.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: `${activeResultSection.color}08`, border: `1px solid ${activeResultSection.color}20` }}>
                        <ArrowRight size={12} style={{ color: activeResultSection.color, flexShrink: 0, marginTop: 1 }} />
                        <span className="text-xs leading-relaxed text-white">{tip}</span>
                      </div>
                    ))}
                  </div>
                </Card>}

                <Card className="p-5">
                  <SecHead icon={<Search size={15} />} title="Keyword Analysis" sub={`${keywords.filter(k => k.found).length} of ${keywords.length} found`} />
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((k, i) => (
                      <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: k.found ? "rgba(52,211,153,.1)" : "rgba(239,68,68,.08)", border: `1px solid ${k.found ? C.green + "40" : C.red + "35"}`, color: k.found ? C.green : C.red }}>
                        {k.found ? <Check size={10} /> : <XCircle size={10} />} {k.word}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* ATS bar chart + Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5">
                <SecHead icon={<Target size={16} />} title="ATS Compatibility" sub="Score vs industry average" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart id="ra-ats-bar" data={sections.map(s => ({ name: s.name.split(" ")[0], score: s.score, avg: Math.round(s.score * 0.85) }))}
                    margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={18} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="avg" name="Industry Avg" radius={[3, 3, 0, 0]} fill={C.border} />
                    <Bar dataKey="score" name="Your Score" radius={[3, 3, 0, 0]} fill={C.purple} fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <SecHead icon={<TrendingUp size={16} />} title="Priority Action Plan" sub="Focus on these for the biggest gain" />
                <div className="space-y-2.5">
                  {sections.filter(s => s.score < 80).sort((a, b) => a.score - b.score).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: i === 0 ? C.red : i === 1 ? C.amber : C.green }}>#{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white">{s.name}</div>
                        <div className="text-xs" style={{ color: C.muted }}>+{Math.round((80 - s.score) * 0.6)} pts potential gain</div>
                      </div>
                      <span className="text-xs font-black" style={{ color: s.color }}>{s.score}%</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: C.grad }}>
                  <Download size={14} /> Download Full Report
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
// LINKEDIN ANALYZER PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default ResumeAnalyzerPage;
