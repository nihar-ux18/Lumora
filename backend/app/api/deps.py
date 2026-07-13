from fastapi import Depends

from fastapi import HTTPException, status
from app.models.user import Role
from app.core.security import oauth2_scheme
from app.db.session import get_db
from app.repositories.auth_repository import AuthRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.repositories.workspace_member_repository import WorkspaceMemberRepository
from app.repositories.workspace_invitation_repository import WorkspaceInvitationRepository
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)
from app.services.workspace_member_service import WorkspaceMemberService
from app.services.workspace_service import WorkspaceService
from app.services.auth_service import AuthService
from app.repositories.email_verification_repository import (EmailVerificationRepository,)
from sqlalchemy.ext.asyncio import AsyncSession


def get_auth_service(db: AsyncSession = Depends(get_db),) -> AuthService:
    auth_repository = AuthRepository(db)
    email_repository = EmailVerificationRepository(db)

    return AuthService(
        repository=auth_repository,
        email_repository=email_repository,
    )
    
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    repository = AuthRepository(db)

    return await AuthService(
        repository=repository,
        email_repository=EmailVerificationRepository(db),
    ).get_current_user(token)
    
async def get_current_active_user(user=Depends(get_current_user)):
    return await AuthService.validate_active_user(user)

def require_roles(*roles: Role):
    async def dependency(
        current_user=Depends(get_current_active_user),
    ):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions.",
            )

        return current_user

    return dependency

def require_admin():
    return require_roles(Role.ADMIN)

def get_workspace_service(db: AsyncSession = Depends(get_db),) -> WorkspaceService:
    workspace_repository = WorkspaceRepository(db)
    workspace_member_repository = WorkspaceMemberRepository(db)

    return WorkspaceService(
        repository=workspace_repository,
        member_repository=workspace_member_repository,
    )

def get_workspace_member_service(
    db: AsyncSession = Depends(get_db),
) -> WorkspaceMemberService:

    return WorkspaceMemberService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        invitation_repository=WorkspaceInvitationRepository(db),
        auth_repository=AuthRepository(db),
    )