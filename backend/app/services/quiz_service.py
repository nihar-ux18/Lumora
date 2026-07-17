from uuid import UUID

from app.repositories.chunk_repository import ChunkRepository
from app.schemas.quiz import QuizResponse
from app.services.ai_service import AIService
from app.services.embedding_service import EmbeddingService
from app.core.exceptions import (ForbiddenError,ResourceNotFoundError,)
from app.models.user import User
from app.repositories.workspace_repository import WorkspaceRepository
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)


class QuizService:
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

    async def build_rag_context(
        self,
        workspace_id: UUID,
        topic: str,
    ) -> str:
        query_embedding = self.embedding_service.generate_embeddings(
            [topic],
        )[0]

        chunks = await self.chunk_repository.semantic_search(
            workspace_id=workspace_id,
            query_embedding=query_embedding,
            limit=5,
        )

        if not chunks:
            return "No relevant context found."

        context = []

        for chunk in chunks:
            context.extend(
                [
                    f"Resource: {chunk.resource.title}",
                    chunk.content,
                    "",
                ]
            )

        return "\n".join(context)

    async def generate_quiz(
        self,
        workspace_id: UUID,
        current_user: User,
        topic: str,
        num_questions: int,
    ) -> QuizResponse:
        
        await self.require_workspace_member(
            workspace_id,
            current_user.id,
        )
        
        context = await self.build_rag_context(
            workspace_id,
            topic,
        )

        result = await self.ai_service.generate_quiz(
            context=context,
            topic=topic,
            num_questions=num_questions,
        )

        return QuizResponse(**result)