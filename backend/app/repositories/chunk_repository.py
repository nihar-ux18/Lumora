from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chunk import Chunk


class ChunkRepository:
    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db

    async def create(
        self,
        chunk: Chunk,
    ) -> Chunk:
        self.db.add(chunk)
        await self.db.commit()
        await self.db.refresh(chunk)
        return chunk

    async def list_by_resource(
        self,
        resource_id: UUID,
    ) -> list[Chunk]:
        result = await self.db.execute(
            select(Chunk).where(
                Chunk.resource_id == resource_id,
            )
        )

        return list(result.scalars().all())