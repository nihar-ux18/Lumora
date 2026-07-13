from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_current_user,
    get_workspace_member_service,
)
from app.models.user import User
from app.models.workspace_member import WorkspaceRole
from app.schemas.workspace import (
    AcceptInvitationRequest,
    WorkspaceInvitationCreateRequest,
    WorkspaceMemberRoleUpdate,
)
from app.services.workspace_member_service import WorkspaceMemberService

router = APIRouter(
    prefix="/workspaces",
    tags=["Workspace Members"],
)


@router.post("/{workspace_id}/invite")
async def invite_member(
    workspace_id: UUID,
    data: WorkspaceInvitationCreateRequest,
    current_user: User = Depends(get_current_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    return await service.invite_user(
        workspace_id=workspace_id,
        current_user_id=current_user.id,
        email=data.email,
    )


@router.post("/invitations/accept")
async def accept_invitation(
    data: AcceptInvitationRequest,
    current_user: User = Depends(get_current_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    return await service.accept_invitation(
        token=data.token,
        current_user_id=current_user.id,
    )


@router.get("/{workspace_id}/members")
async def list_members(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    return await service.list_members(
        workspace_id,
        current_user.id,
    )


@router.patch("/{workspace_id}/members/{user_id}")
async def change_member_role(
    workspace_id: UUID,
    user_id: UUID,
    data: WorkspaceMemberRoleUpdate,
    current_user: User = Depends(get_current_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    return await service.change_member_role(
        workspace_id=workspace_id,
        current_user_id=current_user.id,
        member_user_id=user_id,
        role=data.role,
    )


@router.delete("/{workspace_id}/members/{user_id}")
async def remove_member(
    workspace_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    service: WorkspaceMemberService = Depends(
        get_workspace_member_service,
    ),
):
    await service.remove_member(
        workspace_id=workspace_id,
        current_user_id=current_user.id,
        member_user_id=user_id,
    )

    return {
        "message": "Member removed successfully."
    }