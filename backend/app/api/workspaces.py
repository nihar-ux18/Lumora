from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import (
    get_current_active_user,
    get_workspace_service,
)
from app.models.user import User
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceResponse,
    WorkspaceUpdate,
)
from app.api.deps import get_workspace_member_service
from app.schemas.workspace_invitation import (
    InviteMemberRequest,
    WorkspaceInvitationResponse,
)
from app.services.workspace_member_service import WorkspaceMemberService
from app.services.workspace_service import WorkspaceService

router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"],
)


@router.post(
    "",
    response_model=WorkspaceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_workspace(
    data: WorkspaceCreate,
    current_user: User = Depends(get_current_active_user),
    service: WorkspaceService = Depends(get_workspace_service),
):
    return await service.create_workspace(current_user, data)


@router.get(
    "",
    response_model=list[WorkspaceResponse],
)
async def list_workspaces(
    current_user: User = Depends(get_current_active_user),
    service: WorkspaceService = Depends(get_workspace_service),
):
    return await service.list_workspaces(current_user)


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
)
async def get_workspace(
    workspace_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: WorkspaceService = Depends(get_workspace_service),
):
    return await service.get_workspace(
        current_user,
        workspace_id,
    )


@router.patch(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
)
async def update_workspace(
    workspace_id: UUID,
    data: WorkspaceUpdate,
    current_user: User = Depends(get_current_active_user),
    service: WorkspaceService = Depends(get_workspace_service),
):
    return await service.update_workspace(
        current_user,
        workspace_id,
        data,
    )


@router.delete(
    "/{workspace_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_workspace(
    workspace_id: UUID,
    current_user: User = Depends(get_current_active_user),
    service: WorkspaceService = Depends(get_workspace_service),
):
    await service.delete_workspace(
        current_user,
        workspace_id,
    )
    
@router.post(
    "/{workspace_id}/invite",
    response_model=WorkspaceInvitationResponse,
    status_code=201,
)
async def invite_member(
    workspace_id: UUID,
    data: InviteMemberRequest,
    current_user=Depends(get_current_active_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    return await service.invite_user(
        workspace_id=workspace_id,
        current_user_id=current_user.id,
        email=data.email,
    )