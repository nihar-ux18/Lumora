from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resource import Resource


class ResourceRepository:
    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db

    async def create(
        self,
        resource: Resource,
    ) -> Resource:
        self.db.add(resource)
        await self.db.commit()
        await self.db.refresh(resource)

        return resource

    async def get_by_id(
        self,
        resource_id: UUID,
    ) -> Resource | None:
        result = await self.db.execute(
            select(Resource).where(
                Resource.id == resource_id,
            )
        )

        return result.scalar_one_or_none()

    async def list_by_workspace(
        self,
        workspace_id: UUID,
    ) -> list[Resource]:
        result = await self.db.execute(
            select(Resource).where(
                Resource.workspace_id == workspace_id,
            )
        )

        return list(result.scalars().all())

    async def update(
        self,
        resource: Resource,
    ) -> Resource:
        await self.db.commit()
        await self.db.refresh(resource)

        return resource

    async def delete(
        self,
        resource: Resource,
    ) -> None:
        await self.db.delete(resource)
        await self.db.commit()