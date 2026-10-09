import re

with open("d:\\AI Based interview preparation plateform\\frontend\\src\\app\\App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Define the new ProgressDashboardPage
new_component = """function ProgressDashboardPage() {
  const [range, setRange] = useState<"week" | "month" | "all">("week");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    dashboardApi.getMetrics()
      .then(res => {
        if (mounted) {
          setMetrics(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || "Failed to load metrics");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-2">
        <AlertTriangle size={32} className="text-red-500" />
        <p className="text-sm" style={{ color: C.muted }}>{error || "No data available"}</p>
      </div>
    );
  }

  const { overall_progress: overallPct, study_streak: streak } = metrics;

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,.14)", color: C.purple }}>
                <BarChart3 size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Progress Dashboard</h1>
            </div>
            <p className="text-sm ml-12" style={{ color: C.muted }}>Your complete learning journey with <Grad>AI-powered insights</Grad>.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {(["week", "month", "all"] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: range === r ? C.grad : "transparent", color: range === r ? "#fff" : C.muted }}>
                  {r === "week" ? "This Week" : r === "month" ? "This Month" : "All Time"}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Overall Progress", value: `${overallPct}%`, icon: <TrendingUp size={16} />, color: C.purple, sub: "Across all modules", badge: "+8% this week", trend: `${overallPct}%` },
            { label: "Mock Interviews", value: `${metrics.mock_interviews_done} done`, icon: <Mic size={16} />, color: C.cyan, sub: `Avg score: ${metrics.average_interview_score}/100`, badge: `Last: ${metrics.latest_interview_score ?? 'N/A'}`, trend: "Active" },
            { label: "Study Streak", value: `${streak} days`, icon: <Flame size={16} />, color: C.amber, sub: `Personal best: ${streak} days`, badge: streak > 0 ? "🔥 On fire!" : "Start a streak!", trend: "Active" },
            { label: "Goals Completed", value: `${metrics.goals_completed} / ${metrics.total_goals}`, icon: <Target size={16} />, color: C.green, sub: `${metrics.total_goals > 0 ? Math.round((metrics.goals_completed / metrics.total_goals) * 100) : 0}% completion rate`, badge: `${metrics.total_goals - metrics.goals_completed} left`, trend: `${metrics.total_goals > 0 ? Math.round((metrics.goals_completed / metrics.total_goals) * 100) : 0}%` },
          ].map(s => (
            <Card key={s.label} className="p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5"
                style={{ background: s.color, transform: "translate(30%, -30%)" }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${s.color}15`, color: s.color }}>{s.badge}</span>
              </div>
              <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-bold text-white mb-1">{s.label}</div>
              <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
              <div className="mt-3 h-1 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: s.trend.includes("%") ? s.trend : "60%", background: s.color, maxWidth: "100%" }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Ring progress + weekly activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 flex flex-col items-center gap-4"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(34,211,238,.05))", border: "1px solid rgba(168,85,247,.25)" }}>
            <div className="relative" style={{ width: 136, height: 136 }}>
              <svg width={136} height={136} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={68} cy={68} r={52} fill="none" stroke={C.border} strokeWidth={12} />
                <circle cx={68} cy={68} r={52} fill="none" stroke="url(#pd_ringGrad)" strokeWidth={12}
                  strokeLinecap="round" strokeDasharray={`${(overallPct / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`} />
                <defs>
                  <linearGradient id="pd_ringGrad" x1="1" y1="0" x2="0" y2="1">
                    <stop stopColor={C.purple} /><stop offset="1" stopColor={C.cyan} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-black" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{overallPct}%</div>
                <div className="text-xs" style={{ color: C.muted }}>Overall</div>
              </div>
            </div>
            <div className="text-sm font-bold text-white text-center">Overall Learning Progress</div>
            <div className="w-full space-y-2">
              {metrics.subject_completion.slice(0, 3).map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{s.name}</span><span className="font-bold" style={{ color: s.color }}>{s.progress}%</span></div>
                  <div className="h-1.5 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.color }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 p-5">
            <SecHead icon={<BarChart3 size={16} />} title="Weekly Activity" sub="Topics studied vs mock interviews per day" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart id="pd-activity-bar" data={metrics.weekly_activity} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="topics" name="Topics" radius={[4, 4, 0, 0]} fill={C.purple} fillOpacity={0.85} />
                <Bar dataKey="mock" name="Mocks" radius={[4, 4, 0, 0]} fill={C.cyan} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              {[["Topics", C.purple], ["Mock Interviews", C.cyan]].map(([l, c]) => (
                <div key={l as string} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c as string }} />{l}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skills growth + monthly progress */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <Card className="md:col-span-3 p-5">
            <SecHead icon={<TrendingUp size={16} />} title="Skills Growth Timeline" sub="6-month proficiency improvement per subject" />
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart id="pd-skills-area" data={metrics.skills_growth} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="DSA" stroke={C.purple} fill={C.purple} fillOpacity={0.14} strokeWidth={2} name="DSA" />
                <Area type="monotone" dataKey="System" stroke={C.cyan} fill={C.cyan} fillOpacity={0.14} strokeWidth={2} name="System Design" />
                <Area type="monotone" dataKey="OOP" stroke={C.green} fill={C.green} fillOpacity={0.14} strokeWidth={2} name="OOP" />
                <Area type="monotone" dataKey="SQL" stroke={C.amber} fill={C.amber} fillOpacity={0.14} strokeWidth={2} name="SQL" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 flex-wrap mt-1">
              {([["DSA", C.purple], ["System Design", C.cyan], ["OOP", C.green], ["SQL", C.amber]] as [string, string][]).map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 p-5">
            <SecHead icon={<Calendar size={16} />} title="Monthly Progress" sub="Weekly targets vs achieved" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart id="pd-monthly-bar" data={metrics.monthly_progress} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} fill={C.border} />
                <Bar dataKey="progress" name="Achieved" radius={[4, 4, 0, 0]}>
                  {metrics.monthly_progress.map((_, i) => <Cell key={`mp-cell-${i}`} fill={i === 3 ? C.green : C.purple} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* History columns + recent activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Interview history */}
          <Card className="p-5">
            <SecHead icon={<Mic size={15} />} title="Interview History" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="space-y-2">
              {metrics.interview_history.length === 0 && <div className="text-xs text-center p-4" style={{ color: C.muted }}>No interviews taken yet.</div>}
              {metrics.interview_history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${h.color}18`, color: h.color }}><Mic size={12} /></div>
                  <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white">{h.type}</div><div className="text-xs" style={{ color: C.muted }}>{h.date}</div></div>
                  <div className="text-right"><div className="text-sm font-black text-white">{h.score}</div><span className="text-xs font-bold" style={{ color: h.color }}>{h.grade}</span></div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis history */}
          <Card className="p-5">
            <SecHead icon={<FileText size={15} />} title="Analysis History" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="space-y-1.5">
              {metrics.analysis_history.length === 0 && <div className="text-xs text-center p-4" style={{ color: C.muted }}>No resumes or projects analyzed yet.</div>}
              {metrics.analysis_history.map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  {a.type === 'resume' ? <FileText size={12} style={{ color: a.color, flexShrink: 0 }} /> : <FolderOpen size={12} style={{ color: a.color, flexShrink: 0 }} />}
                  <span className="flex-1 text-xs text-white truncate">{a.name}</span>
                  <span className="text-xs font-black" style={{ color: a.color }}>{a.score}</span>
                  {a.date && <span className="text-xs" style={{ color: C.muted }}>{a.date}</span>}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="p-5">
            <SecHead icon={<Zap size={15} />} title="Recent Activity" action={<button className="text-xs" style={{ color: C.purple }}>View all</button>} />
            <div className="relative pl-6">
              {metrics.recent_activity.length > 0 && <div className="absolute left-[9px] top-1 bottom-1 w-0.5" style={{ background: C.border }} />}
              <div className="space-y-3">
                {metrics.recent_activity.length === 0 && <div className="text-xs text-center p-4" style={{ color: C.muted }}>No recent activity.</div>}
                {metrics.recent_activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                      style={{ background: `${a.color}20`, border: `1.5px solid ${a.color}` }}>
                      <div style={{ color: a.color }}>{a.type === 'interview' ? <Mic size={10} /> : a.type === 'resume' ? <FileText size={10} /> : <Zap size={10} />}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white leading-snug">{a.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Subject / Domain completion + Streak calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5">
            <SecHead icon={<BookOpen size={15} />} title="Subject Completion" sub="Core subjects" />
            <div className="space-y-2.5">
              {metrics.subject_completion.length === 0 && <div className="text-xs text-center p-4" style={{ color: C.muted }}>No progress yet.</div>}
              {metrics.subject_completion.slice(0, 5).map(s => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{s.name.split(" ").slice(0, 2).join(" ")}</span><span className="font-bold" style={{ color: s.color }}>{s.progress}%</span></div>
                  <div className="h-2 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.color, boxShadow: `0 0 6px ${s.color}50` }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<GraduationCap size={15} />} title="Domain Completion" sub="Career domains" />
            <div className="space-y-2.5">
              {metrics.domain_completion.length === 0 && <div className="text-xs text-center p-4" style={{ color: C.muted }}>No progress yet.</div>}
              {metrics.domain_completion.slice(0, 5).map(d => (
                <div key={d.id}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{d.name.split(" ")[0]}</span><span className="font-bold" style={{ color: d.color }}>{d.progress}%</span></div>
                  <div className="h-2 rounded-full" style={{ background: C.border }}><div className="h-full rounded-full" style={{ width: `${d.progress}%`, background: d.color, boxShadow: `0 0 6px ${d.color}50` }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SecHead icon={<Flame size={15} />} title="Study Streak" sub="Daily activity — last 28 days" />
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-black" style={{ color: C.amber }}>{streak}</div>
              <div><div className="text-xs font-bold text-white">day streak</div><div className="text-xs" style={{ color: C.muted }}>Keep it going!</div></div>
            </div>
            <div className="grid gap-1.5 mb-2" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {Array.from({ length: 28 }, (_, i) => {
                const active = i >= 14 && streak > 0; const today = i === 27;
                return (
                  <div key={i} className="rounded aspect-square"
                    style={{ background: today ? C.amber : active ? `rgba(245,158,11,${0.25 + (i - 14) * 0.05})` : C.surface, border: today ? `1px solid ${C.amber}` : "1px solid transparent" }} />
                );
              })}
            </div>
            <div className="flex justify-between text-xs" style={{ color: C.muted }}><span>4 weeks ago</span><span>Today</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}"""

pattern = re.compile(r"function ProgressDashboardPage\(\) \{.*?(?=\n// ═══.*?PAGE 6)", re.DOTALL)
new_content = pattern.sub(new_component, content)

with open("d:\\AI Based interview preparation plateform\\frontend\\src\\app\\App.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replaced ProgressDashboardPage")
