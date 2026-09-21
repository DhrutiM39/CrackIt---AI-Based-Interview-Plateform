"""
Report API endpoints.

POST /reports/generate      — generate + save report for a completed session
GET  /reports               — list all reports for current user
GET  /reports/{id}          — get full report detail
GET  /reports/{id}/pdf      — download PDF of the report
"""
import io
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse

from app.core.security import get_current_user
from app.schemas.interview import ReportGenerateRequest, ReportResponse, ReportSummary
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post(
    "/generate",
    summary="Generate and save an interview report",
)
def generate_report(
    body: ReportGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generates a complete AI-powered interview report for the given session_id.
    The session must belong to the current user.
    Calls Gemini AI for analysis, stores results in Supabase, and returns the report.
    """
    user_id: str = current_user["sub"]
    return report_service.generate_and_save_report(
        session_id=body.session_id,
        user_id=user_id,
    )


@router.get(
    "",
    summary="List all reports for current user",
)
def list_reports(current_user: dict = Depends(get_current_user)):
    """Return a summary list of all reports with scores and metadata."""
    user_id: str = current_user["sub"]
    return report_service.list_reports(user_id=user_id)


@router.get(
    "/{report_id}",
    summary="Get full report details",
)
def get_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
):
    """Return the complete report including question-wise performance and AI recommendations."""
    user_id: str = current_user["sub"]
    return report_service.get_report_by_id(
        report_id=report_id,
        user_id=user_id,
    )


@router.get(
    "/{report_id}/pdf",
    summary="Download report as PDF",
    response_class=StreamingResponse,
)
def download_report_pdf(
    report_id: int,
    current_user: dict = Depends(get_current_user),
):
    """
    Generate and stream a PDF download of the interview report.
    The PDF contains all report data including scores, Q&A performance, and recommendations.
    """
    user_id: str = current_user["sub"]

    # Fetch report data
    report = report_service.get_report_by_id(report_id=report_id, user_id=user_id)

    # Generate PDF bytes
    pdf_bytes = report_service.generate_report_pdf(report)

    # Build a safe filename
    role = (report.get("target_role") or "interview").replace(" ", "_").lower()
    filename = f"crackit_report_{report_id}_{role}.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )
