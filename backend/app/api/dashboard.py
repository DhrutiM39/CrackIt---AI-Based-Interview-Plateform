from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.schemas.dashboard import DashboardMetrics
from app.services.dashboard_service import get_dashboard_metrics

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics", response_model=DashboardMetrics)
def get_metrics(current_user: dict = Depends(get_current_user)):
    """
    Fetch all aggregated metrics for the authenticated user's dashboard.
    """
    try:
        user_id = current_user["sub"]
        return get_dashboard_metrics(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard metrics: {str(e)}"
        )
