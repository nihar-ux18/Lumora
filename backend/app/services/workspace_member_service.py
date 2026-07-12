from datetime import UTC, datetime, timedelta
import secrets
from uuid import UUID

from app.core.exceptions import (ForbiddenError,ResourceNotFoundError,ConflictError,)

from app.models.workspace_member import WorkspaceRole
from app.models.workspace_invitation import WorkspaceInvitation
from app.models.workspace_member import (WorkspaceMember,WorkspaceRole,)
from app.repositories.workspace_repository import WorkspaceRepository
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)
from app.repositories.workspace_invitation_repository import (WorkspaceInvitationRepository,)
from app.repositories.auth_repository import AuthRepository


class WorkspaceMemberService:
    def __init__(
        self,
        workspace_repository: WorkspaceRepository,
        member_repository: WorkspaceMemberRepository,
        invitation_repository: WorkspaceInvitationRepository,
        auth_repository: AuthRepository,
    ):
        self.workspace_repository = workspace_repository
        self.member_repository = member_repository
        self.invitation_repository = invitation_repository
        self.auth_repository = auth_repository
        
        
    async def require_owner(
        self,
        workspace_id: UUID,
        user_id: UUID,
    ):        
        workspace = await self.workspace_repository.get_by_id(workspace_id)

        if not workspace:
            raise ResourceNotFoundError("Workspace not found.")

        if workspace.owner_id != user_id:
            raise ForbiddenError("Only workspace owner can perform this action.")

        return workspace
        
    async def invite_user(
        self,workspace_id: UUID,
        current_user_id: UUID,
        email: str,):
        workspace = await self.require_owner(workspace_id,current_user_id,)

        user = await self.auth_repository.get_user_by_email(email)

        if user:
            existing = await self.member_repository.get_member(
                workspace.id,
                user.id,
            )

            if existing:
                raise ConflictError("User is already a member.")

        invitation = WorkspaceInvitation(
            workspace_id=workspace.id,
            email=email,
            token=secrets.token_urlsafe(32),
            expires_at=datetime.now(UTC) + timedelta(days=7),
        )

        return await self.invitation_repository.create(invitation)
    
    async def accept_invitation(
    self,
    token: str,
    current_user_id: UUID,
    ):
        invitation = await self.invitation_repository.get_by_token(
            token
        )

        if not invitation:
            raise ResourceNotFoundError("Invitation not found.")
        
        if invitation.accepted:
            raise ConflictError("Invitation has already been accepted.")
        
        if invitation.expires_at < datetime.now(UTC):
            raise ConflictError("Invitation expired.")
        
        existing_member = await self.member_repository.get_member(
        invitation.workspace_id,
        current_user_id,
        )

        if existing_member:
            raise ConflictError(
                "You are already a member of this workspace."
            )
            
        member = WorkspaceMember(
            workspace_id=invitation.workspace_id,
            user_id=current_user_id,
            role=WorkspaceRole.MEMBER,
        )

        await self.member_repository.create(member)
        
        invitation.accepted = True

        await self.invitation_repository.update(invitation)

        return member