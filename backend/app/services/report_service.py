"""
Report generation service.

Orchestrates:
1. Fetch interview session + Q&A from Supabase
2. Call Gemini to produce AI analysis
3. Persist report to interview_reports table (extended fields stored as JSON in recommendations)
4. Generate in-memory PDF for download
"""
import io
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse

from app.database.supabase import supabase
from app.services.gemini_service import gemini_service
from app.services.interview_service import get_session_with_qa

logger = logging.getLogger(__name__)


# ─── Grade helper ─────────────────────────────────────────────────────────────

def score_to_grade(score: Optional[float]) -> str:
    if score is None:
        return "N/A"
    if score >= 93:
        return "A+"
    if score >= 90:
        return "A"
    if score >= 87:
        return "A−"
    if score >= 83:
        return "B+"
    if score >= 80:
        return "B"
    if score >= 77:
        return "B−"
    if score >= 73:
        return "C+"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"


# ─── Report generation ────────────────────────────────────────────────────────

def generate_and_save_report(session_id: int, user_id: str) -> Dict[str, Any]:
    """
    Main report generation function.
    Fetches session data → calls Gemini → saves to DB → returns full report dict.
    """
    # 1. Fetch session + Q&A
    data = get_session_with_qa(session_id, user_id)
    session = data["session"]
    questions = data["questions"]  # list of {question_id, question_text, seq, answer: {...}}

    # 2. Fetch user name
    user_name = "Candidate"
    try:
        u_result = (
            supabase.table("users")
            .select("full_name")
            .eq("id", user_id)
            .single()
            .execute()
        )
        if u_result.data:
            user_name = u_result.data.get("full_name", "Candidate")
    except Exception:
        pass

    # 3. Build Q&A list for Gemini
    qa_list = []
    for q in questions:
        ans = q.get("answer") or {}
        qa_list.append({
            "question_text": q.get("question_text", ""),
            "answer_text": ans.get("answer_text"),
            "ai_score": ans.get("ai_score"),
            "ai_feedback": ans.get("ai_feedback"),
        })

    # 4. Compute per-question grades
    question_performance = []
    for i, q in enumerate(questions):
        ans = q.get("answer") or {}
        sc = ans.get("ai_score")
        question_performance.append({
            "sequence_no": q.get("sequence_no", i + 1),
            "question_text": q.get("question_text", ""),
            "answer_text": ans.get("answer_text"),
            "score": sc,
            "feedback": ans.get("ai_feedback"),
            "grade": score_to_grade(sc),
        })

    # 5. Call Gemini for AI evaluation
    interview_type = session.get("interview_type", "Technical")
    target_role = session.get("target_role", "Software Engineer")
    difficulty = session.get("difficulty", "Medium")

    ai_result = gemini_service.generate_interview_report(
        interview_type=interview_type,
        target_role=target_role,
        difficulty=difficulty,
        questions_and_answers=qa_list,
        user_name=user_name,
    )

    # 6. Build extended JSON to store in `recommendations`
    extended = {
        "technical_score": ai_result.technical_score,
        "communication_score": ai_result.communication_score,
        "missed_concepts": ai_result.missed_concepts,
        "recommended_topics": ai_result.recommended_topics,
        "summary": ai_result.summary,
        "next_steps": ai_result.next_steps,
        "question_performance": question_performance,
        "user_name": user_name,
    }

    # 7. Save (or upsert) to interview_reports
    try:
        # Check if report already exists for this session
        existing = (
            supabase.table("interview_reports")
            .select("id")
            .eq("session_id", session_id)
            .execute()
        )

        report_data = {
            "session_id": session_id,
            "overall_score": ai_result.overall_score,
            "strengths": json.dumps(ai_result.strengths),
            "weaknesses": json.dumps(ai_result.weaknesses),
            "recommendations": json.dumps(extended),
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

        if existing.data:
            # Update
            r_result = (
                supabase.table("interview_reports")
                .update(report_data)
                .eq("session_id", session_id)
                .execute()
            )
        else:
            # Insert
            r_result = (
                supabase.table("interview_reports")
                .insert(report_data)
                .execute()
            )

        if not r_result.data:
            raise HTTPException(500, "Failed to save report to database")

        report_row = r_result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to save report: {e}")
        raise HTTPException(500, f"Database error: {str(e)}")

    # 8. Build full response
    return _build_report_response(report_row, session, extended, ai_result)


def _build_report_response(
    report_row: Dict,
    session: Dict,
    extended: Dict,
    ai_result: Any,
) -> Dict[str, Any]:
    """Assemble the full report dict for API response."""
    started = session.get("started_at")
    ended = session.get("ended_at")
    duration = None
    if started and ended:
        try:
            s = datetime.fromisoformat(started.replace("Z", "+00:00"))
            e = datetime.fromisoformat(ended.replace("Z", "+00:00"))
            duration = int((e - s).total_seconds())
        except Exception:
            pass

    return {
        "id": report_row["id"],
        "session_id": report_row["session_id"],
        "user_name": extended.get("user_name", "Candidate"),
        "target_role": session.get("target_role"),
        "interview_type": session.get("interview_type"),
        "difficulty": session.get("difficulty"),
        "interview_date": session.get("started_at"),
        "duration_seconds": duration,
        "overall_score": report_row.get("overall_score"),
        "technical_score": extended.get("technical_score"),
        "communication_score": extended.get("communication_score"),
        "strengths": _parse_json_field(report_row.get("strengths")),
        "weaknesses": _parse_json_field(report_row.get("weaknesses")),
        "missed_concepts": extended.get("missed_concepts", []),
        "recommended_topics": extended.get("recommended_topics", []),
        "summary": extended.get("summary"),
        "next_steps": extended.get("next_steps", []),
        "question_performance": extended.get("question_performance", []),
        "generated_at": report_row.get("generated_at"),
    }


def _parse_json_field(value) -> list:
    """Parse a field that may be a JSON string or already a list."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return parsed
        return [str(parsed)]
    except Exception:
        return [str(value)]


# ─── Fetch reports ────────────────────────────────────────────────────────────

def list_reports(user_id: str) -> List[Dict[str, Any]]:
    """Return summarized list of all reports for a user."""
    try:
        # Get all sessions for the user
        sessions_result = (
            supabase.table("interview_sessions")
            .select("id, target_role, interview_type, difficulty, started_at")
            .eq("user_id", user_id)
            .order("started_at", desc=True)
            .execute()
        )
        sessions = sessions_result.data or []
        session_ids = [s["id"] for s in sessions]

        if not session_ids:
            return []

        # Get reports for those sessions
        reports_result = (
            supabase.table("interview_reports")
            .select("id, session_id, overall_score, generated_at, recommendations")
            .in_("session_id", session_ids)
            .order("generated_at", desc=True)
            .execute()
        )
        reports = reports_result.data or []

        # Build session lookup
        session_map = {s["id"]: s for s in sessions}

        # Combine
        result = []
        for r in reports:
            sess = session_map.get(r["session_id"], {})
            ext = {}
            try:
                ext = json.loads(r.get("recommendations") or "{}")
            except Exception:
                pass
            result.append({
                "id": r["id"],
                "session_id": r["session_id"],
                "target_role": sess.get("target_role"),
                "interview_type": sess.get("interview_type"),
                "difficulty": sess.get("difficulty"),
                "interview_date": sess.get("started_at"),
                "overall_score": r.get("overall_score"),
                "technical_score": ext.get("technical_score"),
                "communication_score": ext.get("communication_score"),
                "generated_at": r.get("generated_at"),
            })
        return result
    except Exception as e:
        logger.error(f"list_reports error: {e}")
        raise HTTPException(500, str(e))


def get_report_by_id(report_id: int, user_id: str) -> Dict[str, Any]:
    """Fetch a single full report, verifying ownership via session.user_id."""
    try:
        r_result = (
            supabase.table("interview_reports")
            .select("*")
            .eq("id", report_id)
            .execute()
        )
        if not r_result.data:
            raise HTTPException(404, "Report not found")
        report_row = r_result.data[0]

        # Fetch session (for ownership check + metadata)
        s_result = (
            supabase.table("interview_sessions")
            .select("*")
            .eq("id", report_row["session_id"])
            .eq("user_id", user_id)
            .execute()
        )
        if not s_result.data:
            raise HTTPException(404, "Report not found or access denied")
        session = s_result.data[0]

        ext = {}
        try:
            ext = json.loads(report_row.get("recommendations") or "{}")
        except Exception:
            pass

        # Build a fake ai_result object for reuse
        class _AI:
            overall_score = report_row.get("overall_score", 0)
            technical_score = ext.get("technical_score", 0)
            communication_score = ext.get("communication_score", 0)
            strengths = _parse_json_field(report_row.get("strengths"))
            weaknesses = _parse_json_field(report_row.get("weaknesses"))
            missed_concepts = ext.get("missed_concepts", [])
            recommended_topics = ext.get("recommended_topics", [])
            summary = ext.get("summary", "")
            next_steps = ext.get("next_steps", [])

        return _build_report_response(report_row, session, ext, _AI())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"get_report_by_id error: {e}")
        raise HTTPException(500, str(e))


# ─── PDF generation ───────────────────────────────────────────────────────────

def generate_report_pdf(report: Dict[str, Any]) -> bytes:
    """
    Generate a clean PDF from a report dict using ReportLab-style fpdf2 or
    fall back to a simple plaintext PDF via pypdf writer if not available.
    We use only stdlib + available packages (pypdf is in requirements).
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
            HRFlowable, KeepTogether,
        )
        from reportlab.lib.enums import TA_CENTER, TA_LEFT

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2 * cm,
            leftMargin=2 * cm,
            topMargin=2.5 * cm,
            bottomMargin=2 * cm,
            title="CrackIt Interview Report",
        )

        styles = getSampleStyleSheet()
        W, H = A4

        # Custom styles
        PURPLE = colors.HexColor("#A855F7")
        DARK = colors.HexColor("#111827")
        MUTED = colors.HexColor("#6B7280")
        GREEN = colors.HexColor("#34D399")
        RED = colors.HexColor("#EF4444")
        CYAN = colors.HexColor("#22D3EE")
        AMBER = colors.HexColor("#F59E0B")

        title_style = ParagraphStyle(
            "CustomTitle", parent=styles["Title"],
            textColor=PURPLE, fontSize=22, spaceAfter=4, leading=28,
        )
        h2_style = ParagraphStyle(
            "H2", parent=styles["Heading2"],
            textColor=DARK, fontSize=13, spaceBefore=14, spaceAfter=4,
        )
        body_style = ParagraphStyle(
            "Body", parent=styles["Normal"],
            textColor=DARK, fontSize=10, leading=15,
        )
        muted_style = ParagraphStyle(
            "Muted", parent=styles["Normal"],
            textColor=MUTED, fontSize=9, leading=13,
        )
        bullet_style = ParagraphStyle(
            "Bullet", parent=styles["Normal"],
            textColor=DARK, fontSize=10, leading=14,
            leftIndent=14, bulletIndent=0,
        )

        def section(title):
            return [
                Spacer(1, 0.3 * cm),
                HRFlowable(width="100%", thickness=1, color=PURPLE, spaceAfter=6),
                Paragraph(f"<b>{title}</b>", h2_style),
            ]

        def bullets(items, color=DARK):
            elems = []
            for item in (items or []):
                elems.append(Paragraph(f"• {item}", bullet_style))
            return elems

        story = []

        # ── Header ──
        story.append(Paragraph("CrackIt — Interview Evaluation Report", title_style))
        story.append(Spacer(1, 0.2 * cm))

        # Meta info table
        role = report.get("target_role", "N/A")
        itype = report.get("interview_type", "N/A")
        diff = report.get("difficulty", "N/A")
        date_str = "N/A"
        if report.get("interview_date"):
            try:
                dt = datetime.fromisoformat(str(report["interview_date"]).replace("Z", "+00:00"))
                date_str = dt.strftime("%d %b %Y")
            except Exception:
                date_str = str(report.get("interview_date", ""))[:10]

        gen_str = "N/A"
        if report.get("generated_at"):
            try:
                dt = datetime.fromisoformat(str(report["generated_at"]).replace("Z", "+00:00"))
                gen_str = dt.strftime("%d %b %Y %H:%M")
            except Exception:
                gen_str = str(report.get("generated_at", ""))[:16]

        dur = report.get("duration_seconds")
        dur_str = f"{dur // 60}m {dur % 60}s" if dur else "N/A"

        meta_data = [
            ["Candidate", report.get("user_name", "N/A"), "Target Role", role],
            ["Interview Type", itype, "Difficulty", diff],
            ["Date", date_str, "Duration", dur_str],
            ["Generated", gen_str, "", ""],
        ]
        meta_table = Table(meta_data, colWidths=[3.5 * cm, 5.5 * cm, 3.5 * cm, 5.5 * cm])
        meta_table.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (-1, -1), DARK),
            ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
            ("TEXTCOLOR", (2, 0), (2, -1), MUTED),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(meta_table)

        # ── Scores ──
        story += section("Scores")
        overall = report.get("overall_score") or 0
        tech = report.get("technical_score") or 0
        comm = report.get("communication_score") or 0

        score_data = [
            ["Overall Score", f"{overall:.1f} / 100", score_to_grade(overall)],
            ["Technical Score", f"{tech:.1f} / 100", score_to_grade(tech)],
            ["Communication Score", f"{comm:.1f} / 100", score_to_grade(comm)],
        ]
        score_table = Table(score_data, colWidths=[6 * cm, 5 * cm, 4 * cm])
        score_table.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("FONTNAME", (1, 0), (-1, -1), "Helvetica-Bold"),
            ("TEXTCOLOR", (0, 0), (-1, -1), DARK),
            ("TEXTCOLOR", (1, 0), (1, -1), PURPLE),
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F3E8FF")),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ]))
        story.append(score_table)

        # ── Summary ──
        if report.get("summary"):
            story += section("Interview Summary")
            story.append(Paragraph(report["summary"], body_style))

        # ── Strengths ──
        if report.get("strengths"):
            story += section("Strengths")
            story += bullets(report["strengths"])

        # ── Weaknesses ──
        if report.get("weaknesses"):
            story += section("Areas to Improve")
            story += bullets(report["weaknesses"])

        # ── Missed Concepts ──
        if report.get("missed_concepts"):
            story += section("Missed / Unclear Concepts")
            story += bullets(report["missed_concepts"])

        # ── Question Performance ──
        qp = report.get("question_performance") or []
        if qp:
            story += section("Question-wise Performance")
            for qi in qp:
                score_val = qi.get("score")
                grade_val = qi.get("grade", "N/A")
                score_disp = f"{score_val:.1f}/100 ({grade_val})" if score_val is not None else "N/A"
                story.append(Paragraph(
                    f"<b>Q{qi.get('sequence_no', '')}:</b> {qi.get('question_text', '')}",
                    body_style,
                ))
                ans = qi.get("answer_text") or "[No answer]"
                story.append(Paragraph(f"<i>Answer:</i> {ans[:300]}{'...' if len(ans) > 300 else ''}", muted_style))
                story.append(Paragraph(f"Score: {score_disp}", muted_style))
                if qi.get("feedback"):
                    story.append(Paragraph(f"<i>Feedback:</i> {qi['feedback']}", muted_style))
                story.append(Spacer(1, 0.2 * cm))

        # ── Recommended Topics ──
        if report.get("recommended_topics"):
            story += section("Recommended Topics to Study")
            story += bullets(report["recommended_topics"])

        # ── Next Steps ──
        if report.get("next_steps"):
            story += section("Next Steps")
            story += bullets(report["next_steps"])

        # ── Footer ──
        story.append(Spacer(1, 0.5 * cm))
        story.append(Paragraph(
            f"Generated by CrackIt AI Platform on {gen_str}",
            muted_style,
        ))

        doc.build(story)
        return buffer.getvalue()

    except ImportError:
        # Fallback: simple text-based PDF-like content
        logger.warning("reportlab not available, falling back to text PDF")
        return _generate_fallback_pdf(report)


def _generate_fallback_pdf(report: Dict[str, Any]) -> bytes:
    """
    Very basic plaintext PDF using fpdf2 if available, or raw bytes otherwise.
    """
    try:
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=10)
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "CrackIt - Interview Report", ln=True)
        pdf.set_font("Helvetica", size=10)
        pdf.ln(4)

        def line(label, val):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(50, 7, label + ":", ln=False)
            pdf.set_font("Helvetica", size=9)
            pdf.cell(0, 7, str(val or "N/A"), ln=True)

        line("Candidate", report.get("user_name"))
        line("Target Role", report.get("target_role"))
        line("Interview Type", report.get("interview_type"))
        line("Overall Score", f"{report.get('overall_score', 0):.1f}/100")
        line("Technical Score", f"{report.get('technical_score', 0):.1f}/100")
        line("Communication Score", f"{report.get('communication_score', 0):.1f}/100")
        pdf.ln(4)

        if report.get("summary"):
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(0, 7, "Summary:", ln=True)
            pdf.set_font("Helvetica", size=9)
            pdf.multi_cell(0, 6, report["summary"])
            pdf.ln(2)

        for section, items in [
            ("Strengths", report.get("strengths")),
            ("Areas to Improve", report.get("weaknesses")),
            ("Recommended Topics", report.get("recommended_topics")),
            ("Next Steps", report.get("next_steps")),
        ]:
            if items:
                pdf.set_font("Helvetica", "B", 10)
                pdf.cell(0, 7, section + ":", ln=True)
                pdf.set_font("Helvetica", size=9)
                for item in items:
                    pdf.multi_cell(0, 6, f"  - {item}")
                pdf.ln(2)

        return bytes(pdf.output())

    except ImportError:
        # Last resort: text file formatted as bytes
        content = f"CrackIt Interview Report\n{'='*40}\n"
        content += f"Candidate: {report.get('user_name', 'N/A')}\n"
        content += f"Role: {report.get('target_role', 'N/A')}\n"
        content += f"Overall Score: {report.get('overall_score', 0)}\n"
        return content.encode()
