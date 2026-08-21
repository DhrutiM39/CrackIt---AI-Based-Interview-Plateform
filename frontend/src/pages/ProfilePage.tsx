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

export default ProfilePage;
