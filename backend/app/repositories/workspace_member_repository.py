from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workspace_member import WorkspaceMember


class WorkspaceMemberRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, member: WorkspaceMember) -> WorkspaceMember:
        self.db.add(member)
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def get_member(
        self,
        workspace_id: UUID,
        user_id: UUID,
    ) -> WorkspaceMember | None:
        result = await self.db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_members(
        self,
        workspace_id: UUID,
    ) -> list[WorkspaceMember]:
        result = await self.db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.workspace_id == workspace_id
            )
        )
        return list(result.scalars().all())

    async def update(self, member: WorkspaceMember) -> WorkspaceMember:
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def delete(self, member: WorkspaceMember) -> None:
        await self.db.delete(member)
        await self.db.commit()