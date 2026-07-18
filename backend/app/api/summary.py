from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_current_user,
    get_summary_service,
)
from app.models.user import User
from app.schemas.summary import (
    SummaryGenerateRequest,
    SummaryResponse,
)
from app.services.summary_service import SummaryService

router = APIRouter(
    prefix="/summary",
    tags=["Summary"],
)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=SummaryResponse,
)
async def generate_summary(
    workspace_id: UUID,
    data: SummaryGenerateRequest,
    current_user: User = Depends(get_current_user),
    service: SummaryService = Depends(
        get_summary_service,
    ),
):
    return await service.generate_summary(
        workspace_id=workspace_id,
        current_user=current_user,
        topic=data.topic,
    )