from uuid import UUID

from app.core.exceptions import (
    ForbiddenError,
    ResourceNotFoundError,
)
from app.models.user import User
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.workspace_member_repository import (
    WorkspaceMemberRepository,
)
from app.repositories.workspace_repository import (
    WorkspaceRepository,
)
from app.schemas.summary import SummaryResponse
from app.services.ai_service import AIService
from app.services.embedding_service import EmbeddingService


class SummaryService:
    def __init__(
        self,
        workspace_repository: WorkspaceRepository,
        member_repository: WorkspaceMemberRepository,
        chunk_repository: ChunkRepository,
        embedding_service: EmbeddingService,
        ai_service: AIService,
    ):
        self.workspace_repository = workspace_repository
        self.member_repository = member_repository
        self.chunk_repository = chunk_repository
        self.embedding_service = embedding_service
        self.ai_service = ai_service

    async def require_workspace_member(
        self,
        workspace_id: UUID,
        user_id: UUID,
    ):
        workspace = await self.workspace_repository.get_by_id(
            workspace_id,
        )

        if workspace is None:
            raise ResourceNotFoundError(
                "Workspace not found.",
            )

        if workspace.owner_id == user_id:
            return workspace

        member = await self.member_repository.get_member(
            workspace_id,
            user_id,
        )

        if member is None:
            raise ForbiddenError(
                "You are not a member of this workspace.",
            )

        return workspace

    async def generate_summary(
        self,
        workspace_id: UUID,
        current_user: User,
        topic: str,
    ) -> SummaryResponse:

        await self.require_workspace_member(
            workspace_id,
            current_user.id,
        )

        query_embedding = self.embedding_service.generate_embeddings(
            [topic],
        )[0]

        chunks = await self.chunk_repository.semantic_search(
            workspace_id=workspace_id,
            query_embedding=query_embedding,
            limit=5,
        )

        if not chunks:
            return SummaryResponse(
                summary="I couldn't find enough information in this workspace.",
            )

        context = "\n\n".join(
            chunk.content
            for chunk in chunks
        )

        result = await self.ai_service.generate_summary(
            context=context,
            topic=topic,
        )

        return SummaryResponse(
            **result,
        )