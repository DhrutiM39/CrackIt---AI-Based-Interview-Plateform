import React from "react";
import { C } from "../../lib/tokens";
export const Grad = ({ children }: { children: React.ReactNode }) => (
  <span style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>
);
export const Card = ({ children, className = "", style = {}, onClick }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) => (
  <div className={className} onClick={onClick}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, ...style }}>{children}</div>
);
export const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      {label && <div className="font-semibold text-white mb-1">{label}</div>}
      {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color || C.cyan }}>{p.name}: {p.value}</div>)}
    </div>
  );
};
export const Pill = ({ label, color }: { label: string; color: string }) => (
  <span className="px-2.5 py-1 rounded-lg text-xs font-medium"
    style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>{label}</span>
);
export const SecHead = ({ icon, title, sub, action }: { icon: React.ReactNode; title: string; sub?: string; action?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-5">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.12)", color: C.purple }}>{icon}</div>
      <div><div className="text-sm font-bold text-white">{title}</div>{sub && <div className="text-xs mt-0.5" style={{ color: C.muted }}>{sub}</div>}</div>
    </div>
    {action}
  </div>
);
export function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative inline-flex items-center rounded-full flex-shrink-0 transition-all duration-200"
      style={{ width: 44, height: 24, background: on ? C.purple : C.border, border: "none", padding: 0 }}>
      <div className="absolute rounded-full transition-all duration-200"
        style={{ width: 18, height: 18, background: "#fff", left: on ? 22 : 4, boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
    </button>
  );
}
