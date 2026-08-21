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

const NOTIFICATIONS_DATA = [
  { id: 1, type: "interview", title: "Mock Interview Reminder", body: "Your scheduled Technical mock interview starts in 30 minutes.", time: "10 min ago", read: false, icon: <Mic size={14} />, color: C.purple },
  { id: 2, type: "achievement", title: "Achievement Unlocked!", body: "You earned the '7-Day Streak' badge. Keep it going!", time: "2h ago", read: false, icon: <Award size={14} />, color: C.amber },
  { id: 3, type: "ai", title: "AI Suggestion Available", body: "New personalised study plan generated based on your mock interview results.", time: "3h ago", read: false, icon: <Sparkles size={14} />, color: C.cyan },
  { id: 4, type: "progress", title: "Weekly Progress Report", body: "You completed 78% of your weekly goal. Great work this week!", time: "5h ago", read: true, icon: <BarChart3 size={14} />, color: C.green },
  { id: 5, type: "resume", title: "Resume Score Updated", body: "Your resume score improved from 72 to 87 after the latest AI analysis.", time: "Yesterday", read: true, icon: <FileText size={14} />, color: C.blue },
  { id: 6, type: "interview", title: "Interview Results Ready", body: "Your Behavioral round evaluation is now available in Reports.", time: "Yesterday", read: true, icon: <ClipboardList size={14} />, color: C.purple },
  { id: 7, type: "study", title: "Study Reminder", body: "You haven't studied today yet. Your streak is at risk — 14 days!", time: "2 days ago", read: true, icon: <BookOpen size={14} />, color: C.red },
  { id: 8, type: "ai", title: "AI Roadmap Updated", body: "Your personalized roadmap has been updated based on your latest performance.", time: "3 days ago", read: true, icon: <Map size={14} />, color: C.indigo },
  { id: 9, type: "progress", title: "Monthly Milestone Reached", body: "You hit 75% overall progress! You're in the top 22% of all users.", time: "4 days ago", read: true, icon: <Trophy size={14} />, color: C.amber },
  { id: 10, type: "resume", title: "LinkedIn Profile Tips", body: "AI found 5 improvements to boost your LinkedIn score from 74 to 86.", time: "5 days ago", read: true, icon: <Linkedin size={14} />, color: C.cyan },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5: PROGRESS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const types = [
    { id: "all", label: "All", count: notifications.length, color: C.purple },
    { id: "interview", label: "Interview", count: notifications.filter(n => n.type === "interview").length, color: C.purple },
    { id: "ai", label: "AI Suggestions", count: notifications.filter(n => n.type === "ai").length, color: C.cyan },
    { id: "progress", label: "Progress", count: notifications.filter(n => n.type === "progress").length, color: C.green },
    { id: "achievement", label: "Achievements", count: notifications.filter(n => n.type === "achievement").length, color: C.amber },
    { id: "resume", label: "Resume", count: notifications.filter(n => n.type === "resume").length, color: C.blue },
    { id: "study", label: "Study", count: notifications.filter(n => n.type === "study").length, color: C.red },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteN = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));

  const filtered = notifications
    .filter(n => filter === "all" || n.type === filter)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}><Bell size={18} /></div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: C.red }}>{unreadCount}</div>}
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Stay updated with your <Grad>learning progress and reminders</Grad>.</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(168,85,247,.12)", border: "1px solid rgba(168,85,247,.3)", color: C.purple }}>
                <CheckSquare size={13} /> Mark All Read
              </button>
            )}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <BellOff size={13} /> Manage Preferences
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: notifications.length, color: C.purple, icon: <Bell size={13} /> },
            { label: "Unread", value: unreadCount, color: C.red, icon: <AlertTriangle size={13} /> },
            { label: "Interview", value: notifications.filter(n => n.type === "interview").length, color: C.cyan, icon: <Mic size={13} /> },
            { label: "Achievements", value: notifications.filter(n => n.type === "achievement").length, color: C.amber, icon: <Award size={13} /> },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notifications by title or message…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {types.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: filter === t.id ? `linear-gradient(135deg,${t.color}cc,${t.color}99)` : "transparent", color: filter === t.id ? "#fff" : C.muted }}>
              {t.label}
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: filter === t.id ? "rgba(255,255,255,.25)" : `${t.color}20`, color: filter === t.id ? "#fff" : t.color }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card className="p-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,.1)" }}>
                <Bell size={28} style={{ color: C.purple }} />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white mb-1">All caught up!</div>
                <div className="text-sm" style={{ color: C.muted }}>
                  {filter === "all" ? "You have no notifications." : `No ${filter} notifications found.`}
                </div>
              </div>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: C.grad }}>
                  View All Notifications
                </button>
              )}
            </Card>
          ) : (
            <>
              {/* Group unread on top */}
              {filtered.some(n => !n.read) && (
                <div className="text-xs font-bold mb-2 px-1" style={{ color: C.muted }}>UNREAD</div>
              )}
              {filtered.filter(n => !n.read).map(n => (
                <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onDelete={() => deleteN(n.id)} />
              ))}
              {filtered.some(n => !n.read) && filtered.some(n => n.read) && (
                <div className="text-xs font-bold mb-2 px-1 mt-4" style={{ color: C.muted }}>EARLIER</div>
              )}
              {filtered.filter(n => n.read).map(n => (
                <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onDelete={() => deleteN(n.id)} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NotifCard({ n, onRead, onDelete }: { n: typeof NOTIFICATIONS_DATA[0]; onRead: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer"
      style={{ background: !n.read ? `${n.color}08` : C.card, border: `1px solid ${!n.read ? n.color + "30" : C.border}` }}
      onClick={onRead}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
        style={{ background: `${n.color}18`, color: n.color }}>
        {n.icon}
        {!n.read && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: n.color, border: `2px solid #0B1120` }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{n.title}</span>
            {!n.read && <Pill label="New" color={n.color} />}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: C.muted }}>{n.time}</span>
        </div>
        <p className="text-xs leading-relaxed mb-2" style={{ color: C.muted }}>{n.body}</p>
        <div className="flex items-center gap-3">
          <Pill label={n.type} color={n.color} />
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="text-xs transition-opacity" style={{ color: C.muted }}>Dismiss</button>
          {!n.read && (
            <button onClick={e => { e.stopPropagation(); onRead(); }}
              className="text-xs font-semibold" style={{ color: n.color }}>Mark Read</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10: 404 NOT FOUND
// ═══════════════════════════════════════════════════════════════════════════════

export default NotificationsPage;
