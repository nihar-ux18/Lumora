from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (get_current_active_user,get_roadmap_service,)
from app.models.user import User
from app.schemas.roadmap import (RoadmapRequest,RoadmapResponse,)
from app.services.roadmap_service import RoadmapService

router = APIRouter(
    prefix="/roadmap",
    tags=["Roadmap"],
)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=RoadmapResponse,
)
async def generate_roadmap(
    workspace_id: UUID,
    request: RoadmapRequest,
    current_user: User = Depends(get_current_active_user),
    service: RoadmapService = Depends(get_roadmap_service),
):
    return await service.generate_roadmap(
        workspace_id=workspace_id,
        current_user=current_user,
        topic=request.topic,
    )