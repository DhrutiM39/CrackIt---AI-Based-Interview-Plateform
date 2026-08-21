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

export default LinkedInAnalyzerPage;
