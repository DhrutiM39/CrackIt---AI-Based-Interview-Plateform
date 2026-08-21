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

function SettingsPage() {
  const [section, setSection] = useState("account");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    emailMock: true, emailProgress: true, emailResume: false,
    pushAll: true, pushInterview: true, pushStreak: true, pushAI: false,
    profilePublic: false, showActivity: true, shareProgress: false,
    darkMode: true, animations: true, compactView: false,
    twoFA: false, loginAlerts: true,
  });

  const tog = (k: string) => setToggles(t => ({ ...t, [k]: !t[k] }));

  const sections = [
    { id: "account", label: "Account", icon: <User size={15} /> },
    { id: "security", label: "Security", icon: <Shield size={15} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
    { id: "privacy", label: "Privacy", icon: <Lock size={15} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
    { id: "language", label: "Language", icon: <Globe size={15} /> },
    { id: "connected", label: "Connected Accounts", icon: <Link size={15} /> },
    { id: "danger", label: "Danger Zone", icon: <AlertTriangle size={15} /> },
  ];

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Settings sidebar */}
      <div className="w-56 flex-shrink-0 border-r overflow-y-auto py-4 px-2" style={{ borderColor: C.border, scrollbarWidth: "none" }}>
        <div className="px-3 pb-3 mb-2 border-b" style={{ borderColor: C.border }}>
          <div className="text-xs font-black text-white">Settings</div>
          <div className="text-xs" style={{ color: C.muted }}>Manage your account</div>
        </div>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left mb-0.5 transition-all"
            style={{
              background: section === s.id ? (s.id === "danger" ? "rgba(239,68,68,.1)" : C.gradSubtle) : "transparent",
              border: section === s.id ? `1px solid ${s.id === "danger" ? "rgba(239,68,68,.3)" : "rgba(168,85,247,.3)"}` : "1px solid transparent",
              color: section === s.id ? (s.id === "danger" ? C.red : C.text) : s.id === "danger" ? "rgba(239,68,68,.7)" : C.muted,
            }}>
            {s.icon}<span className="text-sm">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "none" }}>
        {section === "account" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Account Settings</div><div className="text-sm" style={{ color: C.muted }}>Update your personal details and preferences.</div></div>
            <Card className="p-6">
              <SecHead icon={<User size={16} />} title="Profile Details" sub="Shown on your public profile" />
              <div className="grid grid-cols-2 gap-4">
                {[["Full Name", "Dhruti Shah"], ["Display Name", "DhrutiS"], ["Email", "dhruti.shah@email.com"], ["Phone", "+91 98765 43210"]].map(([l, v]) => (
                  <div key={l}><label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{l}</label>
                    <input defaultValue={v} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Profile Bio</label>
                <textarea defaultValue="Final year B.Tech CSE student preparing for product-based company placements." rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
              </div>
              <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: C.grad }}>Save Changes</button>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Mail size={16} />} title="Email Preferences" sub="Manage what emails you receive" />
              {[
                { key: "emailMock", label: "Mock Interview Reminders", sub: "Get notified before scheduled sessions" },
                { key: "emailProgress", label: "Weekly Progress Reports", sub: "Summary of your weekly activity" },
                { key: "emailResume", label: "Resume Update Suggestions", sub: "AI tips to improve your resume score" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "security" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Security Settings</div><div className="text-sm" style={{ color: C.muted }}>Keep your account safe and secure.</div></div>
            <Card className="p-6">
              <SecHead icon={<Lock size={16} />} title="Change Password" />
              <div className="space-y-3">
                {["Current Password", "New Password", "Confirm New Password"].map(l => (
                  <div key={l}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{l}</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
                  </div>
                ))}
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white mt-1" style={{ background: C.grad }}>Update Password</button>
              </div>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Shield size={16} />} title="Two-Factor Authentication" sub="Add an extra layer of security" />
              <div className="flex items-center justify-between py-3.5 border-b" style={{ borderColor: C.border }}>
                <div>
                  <div className="text-sm font-medium text-white">Enable 2FA via Authenticator App</div>
                  <div className="text-xs" style={{ color: C.muted }}>Use Google Authenticator or Authy</div>
                </div>
                <ToggleSwitch on={toggles.twoFA} onToggle={() => tog("twoFA")} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div><div className="text-sm font-medium text-white">Login Alerts via Email</div><div className="text-xs" style={{ color: C.muted }}>Get notified of new logins</div></div>
                <ToggleSwitch on={toggles.loginAlerts} onToggle={() => tog("loginAlerts")} />
              </div>
            </Card>
            <Card className="p-5">
              <SecHead icon={<Eye size={16} />} title="Active Sessions" sub="Devices currently logged in" />
              {[
                { device: "MacBook Pro — Chrome", location: "Ahmedabad, IN", time: "Now", current: true },
                { device: "iPhone 15 Pro — Safari", location: "Ahmedabad, IN", time: "2h ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{s.device}</div><div className="text-xs" style={{ color: C.muted }}>{s.location} · {s.time}</div></div>
                  {s.current ? <Pill label="Current" color={C.green} /> : <button className="text-xs font-semibold" style={{ color: C.red }}>Revoke</button>}
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "notifications" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Notification Preferences</div><div className="text-sm" style={{ color: C.muted }}>Control how and when you get notified.</div></div>
            <Card className="p-5">
              <SecHead icon={<Bell size={16} />} title="Push Notifications" sub="In-app and browser notifications" />
              {[
                { key: "pushAll", label: "All Notifications", sub: "Master toggle for push notifications" },
                { key: "pushInterview", label: "Interview Reminders", sub: "30 minutes before scheduled sessions" },
                { key: "pushStreak", label: "Streak Alerts", sub: "Daily reminders to maintain your streak" },
                { key: "pushAI", label: "AI Suggestions", sub: "New personalised learning tips" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "privacy" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Privacy Settings</div><div className="text-sm" style={{ color: C.muted }}>Control your data and visibility.</div></div>
            <Card className="p-5">
              <SecHead icon={<Lock size={16} />} title="Profile Visibility" />
              {[
                { key: "profilePublic", label: "Public Profile", sub: "Allow others to see your profile" },
                { key: "showActivity", label: "Show Activity Status", sub: "Display when you were last active" },
                { key: "shareProgress", label: "Share Progress Reports", sub: "Allow AI to use your data for insights" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
            <Card className="p-5">
              <SecHead icon={<Download size={16} />} title="Data Management" />
              <div className="space-y-3">
                {[{ label: "Export My Data", sub: "Download a copy of all your data", action: "Export", color: C.cyan },
                  { label: "Clear Interview History", sub: "Remove all past mock interview records", action: "Clear", color: C.amber }].map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div><div className="text-sm font-medium text-white">{d.label}</div><div className="text-xs" style={{ color: C.muted }}>{d.sub}</div></div>
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}30` }}>{d.action}</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "appearance" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Appearance</div><div className="text-sm" style={{ color: C.muted }}>Customise how the app looks and feels.</div></div>
            <Card className="p-5">
              <SecHead icon={<Moon size={16} />} title="Theme" sub="Choose your preferred colour scheme" />
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Dark Mode", icon: <Moon size={20} />, active: true },
                  { label: "Light Mode", icon: <Star size={20} />, active: false },
                  { label: "System Default", icon: <SlidersHorizontal size={20} />, active: false },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer"
                    style={{ background: t.active ? C.gradSubtle : C.surface, border: `1px solid ${t.active ? "rgba(168,85,247,.35)" : C.border}` }}>
                    <div style={{ color: t.active ? C.purple : C.muted }}>{t.icon}</div>
                    <span className="text-xs font-semibold" style={{ color: t.active ? C.text : C.muted }}>{t.label}</span>
                    {t.active && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: C.purple }}><Check size={9} className="text-white" /></div>}
                  </div>
                ))}
              </div>
              <SecHead icon={<Palette size={16} />} title="UI Preferences" />
              {[
                { key: "animations", label: "Enable Animations", sub: "Smooth transitions and micro-interactions" },
                { key: "compactView", label: "Compact View", sub: "Reduce spacing for more content density" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 border-b last:border-b-0" style={{ borderColor: C.border }}>
                  <div><div className="text-sm font-medium text-white">{n.label}</div><div className="text-xs" style={{ color: C.muted }}>{n.sub}</div></div>
                  <ToggleSwitch on={toggles[n.key]} onToggle={() => tog(n.key)} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {section === "language" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Language & Region</div><div className="text-sm" style={{ color: C.muted }}>Set your preferred language and timezone.</div></div>
            <Card className="p-5">
              <SecHead icon={<Globe size={16} />} title="Language Settings" />
              <div className="grid grid-cols-2 gap-4">
                {[["App Language", ["English", "Hindi", "Tamil", "Telugu", "Gujarati"], "English"],
                  ["Interview Language", ["English", "Hindi", "Tamil", "Telugu"], "English"],
                  ["Time Zone", ["Asia/Kolkata (IST)", "UTC", "US/Eastern"], "Asia/Kolkata (IST)"],
                  ["Date Format", ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], "DD/MM/YYYY"],
                ].map(([label, opts, val]) => (
                  <div key={label as string}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>{label}</label>
                    <select defaultValue={val as string} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }}>
                      {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "connected" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold text-white mb-0.5">Connected Accounts</div><div className="text-sm" style={{ color: C.muted }}>Manage third-party integrations.</div></div>
            <Card className="p-5">
              <div className="space-y-3">
                {[
                  { label: "LinkedIn", icon: <Linkedin size={18} />, color: C.blue, connected: true, username: "linkedin.com/in/dhrutishah" },
                  { label: "GitHub", icon: <GitBranch size={18} />, color: "#fff", connected: true, username: "github.com/dhrutishah" },
                  { label: "Google", icon: <Globe size={18} />, color: C.red, connected: true, username: "dhruti.shah@gmail.com" },
                  { label: "Portfolio Website", icon: <ExternalLink size={18} />, color: C.purple, connected: false, username: "" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{a.label}</div>
                      <div className="text-xs" style={{ color: C.muted }}>{a.connected ? a.username : "Not connected"}</div>
                    </div>
                    {a.connected
                      ? <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(239,68,68,.1)", color: C.red, border: "1px solid rgba(239,68,68,.25)" }}>Disconnect</button>
                      : <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: C.grad }}>Connect</button>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {section === "danger" && (
          <div className="space-y-5 max-w-2xl">
            <div><div className="text-lg font-bold" style={{ color: C.red }}>Danger Zone</div><div className="text-sm" style={{ color: C.muted }}>Irreversible actions — proceed with caution.</div></div>
            {[
              { title: "Clear All Progress Data", desc: "Permanently delete your learning progress, streaks and history. This cannot be undone.", btn: "Clear Data", color: C.amber },
              { title: "Deactivate Account", desc: "Temporarily disable your account. You can reactivate at any time.", btn: "Deactivate", color: C.amber },
              { title: "Delete Account", desc: "Permanently delete your account and all associated data. This action is irreversible.", btn: "Delete Account", color: C.red },
            ].map((d, i) => (
              <Card key={i} className="p-5" style={{ border: `1px solid ${d.color}30` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><AlertTriangle size={15} style={{ color: d.color }} /><span className="text-sm font-bold" style={{ color: d.color }}>{d.title}</span></div>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{d.desc}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                    style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}35` }}>{d.btn}</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 9: NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export default SettingsPage;
