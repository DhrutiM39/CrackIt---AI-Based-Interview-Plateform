import { useState } from "react";
import { Bell, ChevronDown, Flame, Menu, Search } from "lucide-react";
import { C } from "../../lib/tokens";
export function Topbar({ onToggle }: { onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex items-center gap-4 px-6 py-3.5 flex-shrink-0"
      style={{ background: "rgba(17,24,39,.9)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, zIndex: 20 }}>
      <button className="lg:hidden" onClick={onToggle} style={{ color: C.muted }}><Menu size={20} /></button>
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
        <input placeholder="Search subjects, topics, questions…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Inter',sans-serif" }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded" style={{ background: C.border, color: C.muted }}>⌘K</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.3)" }}>
          <Flame size={14} style={{ color: C.amber }} />
          <span className="text-xs font-bold" style={{ color: C.amber }}>14 day streak</span>
        </div>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <Bell size={16} style={{ color: C.muted }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.red }} />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl p-2 z-50"
              style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
              <div className="px-3 py-2 text-sm font-semibold text-white flex justify-between">
                Notifications <button className="text-xs" style={{ color: C.purple }}>Clear</button>
              </div>
              {[{ t: "DSA: Trees module unlocked", s: "5m ago" }, { t: "Weekly goal 80% complete", s: "2h ago" }].map((n, i) => (
                <div key={i} className="px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="text-sm text-white">{n.t}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{n.s}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.grad }}>DS</div>
          <span className="hidden sm:block text-sm font-medium text-white">Dhruti</span>
          <ChevronDown size={14} style={{ color: C.muted }} />
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1: SUBJECT-WISE PREPARATION
