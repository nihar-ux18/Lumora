from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_current_active_user,
    get_revision_service,
)
from app.models.user import User
from app.schemas.revision import (
    RevisionRequest,
    RevisionResponse,
)
from app.services.revision_service import RevisionService

router = APIRouter(prefix="/revision", tags=["Revision"])


@router.post(
    "/workspaces/{workspace_id}",
    response_model=RevisionResponse,
)
async def generate_revision(
    workspace_id: UUID,
    request: RevisionRequest,
    current_user: User = Depends(get_current_active_user),
    service: RevisionService = Depends(get_revision_service),
):
    return await service.generate_revision(
        workspace_id=workspace_id,
        current_user=current_user,
        topic=request.topic,
    )