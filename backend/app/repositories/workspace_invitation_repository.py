from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workspace_invitation import WorkspaceInvitation


class WorkspaceInvitationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        invitation: WorkspaceInvitation,
    ) -> WorkspaceInvitation:
        self.db.add(invitation)
        await self.db.commit()
        await self.db.refresh(invitation)
        return invitation

    async def get_by_token(
        self,
        token: str,
    ) -> WorkspaceInvitation | None:
        result = await self.db.execute(
            select(WorkspaceInvitation).where(
                WorkspaceInvitation.token == token
            )
        )
        return result.scalar_one_or_none()

    async def list_workspace_invitations(
        self,
        workspace_id: UUID,
    ) -> list[WorkspaceInvitation]:
        result = await self.db.execute(
            select(WorkspaceInvitation).where(
                WorkspaceInvitation.workspace_id == workspace_id
            )
        )
        return list(result.scalars().all())

    async def update(
        self,
        invitation: WorkspaceInvitation,
    ) -> WorkspaceInvitation:
        await self.db.commit()
        await self.db.refresh(invitation)
        return invitation

    async def delete(
        self,
        invitation: WorkspaceInvitation,
    ) -> None:
        await self.db.delete(invitation)
        await self.db.commit()