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

function NotFoundPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%,rgba(168,85,247,.08) 0%,transparent 70%)" }} />

      {/* Premium AI Illustration */}
      <svg width={360} height={260} viewBox="0 0 360 260" fill="none" className="mb-6 relative z-10">
        {/* Ground glow */}
        <ellipse cx={180} cy={235} rx={130} ry={16} fill="rgba(168,85,247,.1)" />

        {/* Floating platform */}
        <rect x={110} y={195} width={140} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={125} y={205} width={110} height={6} rx={3} fill={C.border} opacity={0.5} />

        {/* Robot body */}
        <rect x={150} y={130} width={60} height={65} rx={12} fill={C.card} stroke={C.border} strokeWidth={1.5} />
        {/* Robot belly screen */}
        <rect x={158} y={145} width={44} height={28} rx={7} fill="#0B1120" stroke="rgba(168,85,247,.4)" strokeWidth={1} />
        {/* Screen content — sad face / error */}
        <text x={180} y={165} textAnchor="middle" fill={C.red} style={{ fontSize: 14, fontFamily: "monospace" }}>404</text>

        {/* Robot head */}
        <rect x={155} y={98} width={50} height={38} rx={12} fill={C.card} stroke={C.border} strokeWidth={1.5} />
        {/* Eye left */}
        <rect x={163} y={109} width={10} height={8} rx={4} fill={C.surface} />
        <circle cx={168} cy={113} r={3} fill={C.red} />
        <circle cx={169.5} cy={111.5} r={1} fill="rgba(255,255,255,.6)" />
        {/* Eye right */}
        <rect x={187} y={109} width={10} height={8} rx={4} fill={C.surface} />
        <circle cx={192} cy={113} r={3} fill={C.red} />
        <circle cx={193.5} cy={111.5} r={1} fill="rgba(255,255,255,.6)" />
        {/* Mouth — flat sad */}
        <path d="M170 126 Q180 122 190 126" stroke={C.muted} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        {/* Antenna */}
        <line x1={180} y1={98} x2={180} y2={85} stroke={C.border} strokeWidth={1.5} />
        <circle cx={180} cy={82} r={5} fill={C.purple} fillOpacity={0.8}>
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Ears */}
        <rect x={145} y={108} width={10} height={16} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={205} y={108} width={10} height={16} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />

        {/* Arms */}
        <rect x={122} y={135} width={28} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} transform="rotate(-20 136 141)" />
        <rect x={210} y={135} width={28} height={12} rx={6} fill={C.surface} stroke={C.border} strokeWidth={1} transform="rotate(20 224 141)" />
        {/* Hands — question mark bubbles */}
        <circle cx={112} cy={152} r={10} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <text x={112} y={156} textAnchor="middle" fill={C.amber} style={{ fontSize: 12, fontWeight: 700 }}>?</text>
        <circle cx={248} cy={152} r={10} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <text x={248} y={156} textAnchor="middle" fill={C.amber} style={{ fontSize: 12, fontWeight: 700 }}>?</text>

        {/* Legs */}
        <rect x={158} y={193} width={16} height={14} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />
        <rect x={186} y={193} width={16} height={14} rx={5} fill={C.surface} stroke={C.border} strokeWidth={1} />

        {/* Floating error cards left */}
        <g opacity={0.85}>
          <rect x={20} y={90} width={80} height={38} rx={8} fill={C.card} stroke="rgba(239,68,68,.3)" strokeWidth={1} />
          <rect x={28} y={99} width={40} height={4} rx={2} fill="rgba(239,68,68,.4)" />
          <rect x={28} y={108} width={58} height={3} rx={1.5} fill={C.border} />
          <rect x={28} y={114} width={44} height={3} rx={1.5} fill={C.border} />
          <circle cx={86} cy={100} r={6} fill="rgba(239,68,68,.15)" stroke="rgba(239,68,68,.4)" strokeWidth={1} />
          <text x={86} y={104} textAnchor="middle" fill={C.red} style={{ fontSize: 8, fontWeight: 700 }}>!</text>
        </g>

        {/* Floating error card right */}
        <g opacity={0.85}>
          <rect x={260} y={90} width={80} height={38} rx={8} fill={C.card} stroke="rgba(245,158,11,.3)" strokeWidth={1} />
          <rect x={268} y={99} width={40} height={4} rx={2} fill="rgba(245,158,11,.4)" />
          <rect x={268} y={108} width={58} height={3} rx={1.5} fill={C.border} />
          <rect x={268} y={114} width={44} height={3} rx={1.5} fill={C.border} />
          <circle cx={326} cy={100} r={6} fill="rgba(245,158,11,.15)" stroke="rgba(245,158,11,.4)" strokeWidth={1} />
          <text x={326} y={104} textAnchor="middle" fill={C.amber} style={{ fontSize: 8, fontWeight: 700 }}>?</text>
        </g>

        {/* Broken path lines */}
        <path d="M100 109 L150 130" stroke={C.border} strokeWidth={1} strokeDasharray="4 3" />
        <path d="M260 109 L210 130" stroke={C.border} strokeWidth={1} strokeDasharray="4 3" />

        {/* Stars / sparkles decoration */}
        {([[50,50],[310,55],[35,175],[325,180]] as [number,number][]).map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={2} fill={C.purple} opacity={0.5} />
            <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={C.purple} strokeWidth={0.8} opacity={0.3} />
            <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={C.purple} strokeWidth={0.8} opacity={0.3} />
          </g>
        ))}

        {/* Floating dots */}
        {([[75,155],[285,155],[100,55],[260,50]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={3} fill={C.cyan} opacity={0.2} />
        ))}
      </svg>

      {/* 404 heading */}
      <div className="text-8xl font-black mb-2 leading-none"
        style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        404
      </div>
      <div className="text-2xl font-bold text-white mb-2">Page Not Found</div>
      <p className="text-sm max-w-md mb-6 leading-relaxed" style={{ color: C.muted }}>
        Oops! This page seems to have taken a different career path.
        Even our AI couldn't locate it — and it knows <em>everything</em>.
      </p>

      {/* Error detail chip */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl mb-8"
        style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: C.red }}>
        <AlertTriangle size={13} />
        <span className="text-xs font-mono">Error 404 — Route not matched in navigation tree</span>
      </div>

      {/* Quick nav suggestions */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-3" style={{ color: C.muted }}>MAYBE YOU WERE LOOKING FOR</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { icon: <Home size={12} />, label: "Dashboard", id: "dashboard", color: C.purple },
            { icon: <Mic size={12} />, label: "Mock Interview", id: "mock", color: C.cyan },
            { icon: <BarChart3 size={12} />, label: "Progress", id: "dashboard", color: C.green },
            { icon: <Map size={12} />, label: "Roadmap", id: "roadmap", color: C.amber },
            { icon: <BookOpen size={12} />, label: "Subject Prep", id: "subject", color: C.pink },
            { icon: <User size={12} />, label: "Profile", id: "profile", color: C.indigo },
          ].map(s => (
            <button key={s.label} onClick={onHome}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, color: s.color }}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3">
        <button onClick={onHome}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
          <ChevronLeft size={15} /> Go Back
        </button>
        <button onClick={onHome}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: C.grad, boxShadow: "0 8px 24px rgba(168,85,247,.35)" }}>
          <Home size={15} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME ANALYZER PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default NotFoundPage;
