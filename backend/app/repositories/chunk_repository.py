from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.chunk import Chunk
from app.models.resource import Resource


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
    
    async def semantic_search(
        self,
        workspace_id: UUID,
        query_embedding: list[float],
        limit: int = 5,
    ) -> list[Chunk]:

        statement = (
            select(Chunk)
            .options(
                selectinload(Chunk.resource),
            )
            .join(
                Resource,
                Chunk.resource_id == Resource.id,
            )
            .where(
                Resource.workspace_id == workspace_id,
            )
            .order_by(
                Chunk.embedding.cosine_distance(
                    query_embedding,
                )
            )
            .limit(limit)
        )

        result = await self.db.execute(
            statement,
        )

        return list(
            result.scalars().all()
        )