from datetime import datetime, timedelta
import math

from app.database.supabase import supabase
from app.schemas.dashboard import (
    DashboardMetrics, DailyActivity, WeeklyProgress, SkillGrowth,
    RecentActivity, SubjectCompletion, DomainCompletion,
    InterviewHistoryItem, AnalysisHistoryItem
)

# Colors for UI elements
C_PURPLE = "#a855f7"
C_CYAN = "#22d3ee"
C_GREEN = "#34d399"
C_AMBER = "#fbbf24"
C_RED = "#ef4444"
C_BLUE = "#3b82f6"
C_PINK = "#ec4899"
C_MUTED = "rgba(255,255,255,0.4)"

def get_dashboard_metrics(user_id: str) -> DashboardMetrics:
    # 1. Fetch User Data (Streak)
    user_res = supabase.table("users").select("streak_count").eq("id", user_id).execute()
    streak = user_res.data[0]["streak_count"] if user_res.data else 0

    # 2. Fetch Interview Stats
    reports_res = supabase.table("interview_reports") \
        .select("overall_score, generated_at, interview_sessions(interview_type)") \
        .eq("interview_sessions.user_id", user_id) \
        .order("generated_at", desc=True) \
        .execute()
    
    # Filter reports that actually joined with a session belonging to this user
    # Supabase might return all reports with null session if not matched, so we filter:
    valid_reports = [r for r in reports_res.data if r.get("interview_sessions")]
    
    interviews_count = len(valid_reports)
    avg_interview_score = sum(r["overall_score"] for r in valid_reports if r.get("overall_score")) / interviews_count if interviews_count > 0 else 0
    latest_score = valid_reports[0]["overall_score"] if valid_reports and valid_reports[0].get("overall_score") else None

    # 3. Fetch Goals/Roadmap
    roadmaps_res = supabase.table("roadmaps").select("id").eq("user_id", user_id).execute()
    total_goals = 0
    completed_goals = 0
    if roadmaps_res.data:
        roadmap_ids = [r["id"] for r in roadmaps_res.data]
        milestones_res = supabase.table("roadmap_milestones").select("status").in_("roadmap_id", roadmap_ids).execute()
        total_goals = len(milestones_res.data)
        completed_goals = sum(1 for m in milestones_res.data if m["status"] == "completed")
    
    # If no roadmap, we can fallback to career_goals or just return 0/0 (we will set to 0/1 to avoid div by zero in UI)

    # 4. Fetch Subject & Domain Progress
    subj_res = supabase.table("user_subject_progress").select("completion_percentage, subjects(id, subject_name)").eq("user_id", user_id).execute()
    dom_res = supabase.table("user_domain_progress").select("completion_percentage, domains(id, domain_name)").eq("user_id", user_id).execute()
    
    valid_subjs = [s for s in subj_res.data if s.get("subjects")]
    valid_doms = [d for d in dom_res.data if d.get("domains")]

    all_pcts = [s["completion_percentage"] for s in valid_subjs] + [d["completion_percentage"] for d in valid_doms]
    overall_progress = sum(all_pcts) / len(all_pcts) if all_pcts else 0

    subject_completion = []
    colors = [C_PURPLE, C_CYAN, C_GREEN, C_AMBER, C_PINK]
    for i, s in enumerate(valid_subjs[:5]):
        subject_completion.append(SubjectCompletion(
            id=s["subjects"]["id"],
            name=s["subjects"]["subject_name"],
            progress=int(s["completion_percentage"]),
            color=colors[i % len(colors)]
        ))
    
    domain_completion = []
    for i, d in enumerate(valid_doms[:5]):
        domain_completion.append(DomainCompletion(
            id=d["domains"]["id"],
            name=d["domains"]["domain_name"],
            progress=int(d["completion_percentage"]),
            color=colors[i % len(colors)]
        ))

    # 5. Interview History
    interview_history = []
    for r in valid_reports[:5]:
        score = r.get("overall_score") or 0
        grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D"
        color = C_GREEN if score >= 80 else C_AMBER if score >= 70 else C_RED
        
        try:
            dt = datetime.fromisoformat(r["generated_at"].replace("Z", "+00:00"))
            date_str = dt.strftime("%b %-d")
        except:
            date_str = r["generated_at"][:10]

        interview_history.append(InterviewHistoryItem(
            type=r["interview_sessions"]["interview_type"] or "Interview",
            score=int(score),
            date=date_str,
            grade=grade,
            color=color
        ))

    # 6. Analysis History (Resumes & Projects)
    analysis_history = []
    resume_res = supabase.table("resume_analysis").select("id, ats_score, uploaded_at").eq("user_id", user_id).order("uploaded_at", desc=True).limit(5).execute()
    for r in resume_res.data:
        score = r.get("ats_score") or 0
        color = C_GREEN if score >= 80 else C_AMBER if score >= 60 else C_RED
        try:
            dt = datetime.fromisoformat(r["uploaded_at"].replace("Z", "+00:00"))
            date_str = dt.strftime("%b %-d")
        except:
            date_str = "N/A"
        analysis_history.append(AnalysisHistoryItem(
            name=f"Resume Update #{r['id']}",
            score=int(score),
            color=color,
            date=date_str,
            type="resume"
        ))
    
    project_res = supabase.table("projects").select("id, project_title, project_analysis(ai_score, analyzed_at)").eq("user_id", user_id).execute()
    for p in project_res.data:
        if p.get("project_analysis"):
            score = p["project_analysis"]["ai_score"] or 0
            color = C_PURPLE if score >= 80 else C_CYAN
            analysis_history.append(AnalysisHistoryItem(
                name=p["project_title"],
                score=int(score),
                color=color,
                type="project"
            ))
    analysis_history = sorted(analysis_history, key=lambda x: x.date or "", reverse=True)[:5]

    # 7. Recent Activity (Merge recent events)
    recent_activity = []
    
    # Interviews as recent activity
    for r in valid_reports[:3]:
        recent_activity.append({
            "ts": r["generated_at"],
            "item": RecentActivity(
                id=f"int_{len(recent_activity)}",
                type="interview",
                label=f"{r['interview_sessions']['interview_type']} Mock Interview — Score: {int(r.get('overall_score') or 0)}",
                time="Recent",
                color=C_PURPLE
            )
        })
    # Resumes as recent activity
    for r in resume_res.data[:2]:
        recent_activity.append({
            "ts": r["uploaded_at"],
            "item": RecentActivity(
                id=f"res_{len(recent_activity)}",
                type="resume",
                label=f"Resume ATS Score updated — {int(r.get('ats_score') or 0)}/100",
                time="Recent",
                color=C_GREEN
            )
        })
    # Sort and map
    recent_activity.sort(key=lambda x: x["ts"], reverse=True)
    final_recent = [a["item"] for a in recent_activity][:6]

    # 8. Activity and performance series are derived from stored records.
    weekly_activity = []
    week_start = datetime.now().date() - timedelta(days=6)
    question_activity = supabase.table("user_question_progress").select("solved_at").eq("user_id", user_id).gte("solved_at", week_start.isoformat()).execute().data or []
    domain_activity = supabase.table("user_domain_question_progress").select("solved_at").eq("user_id", user_id).gte("solved_at", week_start.isoformat()).execute().data or []
    for offset in range(7):
        day = week_start + timedelta(days=offset)
        day_key = day.isoformat()
        topics = sum(1 for item in question_activity + domain_activity if (item.get("solved_at") or "")[:10] == day_key)
        mocks = sum(1 for item in valid_reports if (item.get("generated_at") or "")[:10] == day_key)
        weekly_activity.append(DailyActivity(day=day.strftime("%a"), topics=topics, mock=mocks))

    monthly_progress = []
    metrics_res = supabase.table("performance_metrics").select("recorded_at, communication_score, technical_score, interview_score").eq("user_id", user_id).order("recorded_at").limit(12).execute()
    skills_growth = [
        SkillGrowth(
            month=(row.get("recorded_at") or "")[:7],
            DSA=int(row.get("technical_score") or 0),
            System=int(row.get("communication_score") or 0),
            OOP=int(row.get("interview_score") or 0),
            SQL=int(row.get("technical_score") or 0),
        )
        for row in (metrics_res.data or [])
    ]

    return DashboardMetrics(
        overall_progress=int(overall_progress),
        study_streak=streak,
        mock_interviews_done=interviews_count,
        average_interview_score=int(avg_interview_score),
        latest_interview_score=int(latest_score) if latest_score is not None else None,
        goals_completed=completed_goals,
        total_goals=total_goals,
        weekly_activity=weekly_activity,
        monthly_progress=monthly_progress,
        skills_growth=skills_growth,
        recent_activity=final_recent,
        subject_completion=subject_completion,
        domain_completion=domain_completion,
        interview_history=interview_history,
        analysis_history=analysis_history
    )
