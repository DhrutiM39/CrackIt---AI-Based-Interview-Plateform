import { Bell, ChevronLeft, ChevronRight, FileText, FolderOpen, GraduationCap, Home, Linkedin, Map, Mic, Settings, User, BookOpen, ClipboardList } from "lucide-react";
import { C } from "../../lib/tokens";
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "resume", label: "Resume Analyzer", icon: FileText },
  { id: "linkedin", label: "LinkedIn Analyzer", icon: Linkedin },
  { id: "projects", label: "Project Analyzer", icon: FolderOpen },
  { id: "subject", label: "Subject Prep", icon: BookOpen },
  { id: "domain", label: "Domain Prep", icon: GraduationCap },
  { id: "mock", label: "Mock Interview", icon: Mic },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "reports", label: "Reports", icon: ClipboardList },
];
const NAV2 = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ col, active, onNav, onToggle }: { col: boolean; active: string; onNav: (id: string) => void; onToggle: () => void }) {
  return (
    <aside className="flex flex-col h-full transition-all duration-300 flex-shrink-0"
      style={{ width: col ? 64 : 240, background: C.card, borderRight: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        {/* CrackIt Logo Mark */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.grad, boxShadow: "0 2px 12px rgba(168,85,247,.5)" }}>
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <path d="M11 2L5 10h5l-2 6 8-9h-5.5L11 2z" fill="white" strokeLinejoin="round" />
          </svg>
        </div>
        {!col && (
          <span className="font-black text-sm whitespace-nowrap"
            style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            CrackIt
          </span>
        )}
        <button onClick={onToggle} className="ml-auto flex-shrink-0" style={{ color: C.muted }}>
          {col ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {NAV.map((item) => {
          const Icon = item.icon; const isA = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{ background: isA ? C.gradSubtle : "transparent", border: isA ? "1px solid rgba(168,85,247,.3)" : "1px solid transparent" }}>
              <Icon size={16} style={{ color: isA ? C.purple : C.muted, flexShrink: 0 }} />
              {!col && <span className="text-sm font-medium truncate" style={{ color: isA ? C.text : C.muted }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="py-4 space-y-0.5 px-2" style={{ borderTop: `1px solid ${C.border}` }}>
        {NAV2.map((item) => {
          const Icon = item.icon; const isA = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{ background: isA ? C.gradSubtle : "transparent" }}>
              <Icon size={16} style={{ color: isA ? C.purple : C.muted, flexShrink: 0 }} />
              {!col && <span className="text-sm font-medium" style={{ color: isA ? C.text : C.muted }}>{item.label}</span>}
            </button>
          );
        })}
        {!col && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl" style={{ background: C.surface }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: C.grad }}>DS</div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">Dhruti Shah</div>
              <div className="text-xs truncate" style={{ color: C.muted }}>Pro Plan</div>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: C.green }} />
          </div>
        )}
      </div>
    </aside>
  );
}
