from fastapi import Depends
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import oauth2_scheme
from app.db.session import get_db
from app.models.user import Role

from app.repositories.auth_repository import AuthRepository
from app.repositories.chat_repository import ChatRepository
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.email_verification_repository import (EmailVerificationRepository,)
from app.repositories.resource_repository import ResourceRepository
from app.repositories.workspace_invitation_repository import (WorkspaceInvitationRepository,)
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)
from app.repositories.workspace_repository import WorkspaceRepository

from app.services.ai_service import AIService
from app.services.auth_service import AuthService
from app.services.chat_service import ChatService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.flashcard_service import FlashcardService
from app.services.parser_service import ParserService
from app.services.quiz_service import QuizService
from app.services.resource_service import ResourceService
from app.services.summary_service import SummaryService
from app.services.workspace_member_service import WorkspaceMemberService
from app.services.workspace_service import WorkspaceService
from app.services.revision_service import RevisionService
from app.schemas.revision import RevisionResponse
from app.services.roadmap_service import RoadmapService
from app.schemas.roadmap import RoadmapResponse


# -------------------------------
# Singletons
# -------------------------------

ai_service = AIService()

_embedding_service = None
ai_service = AIService()


def get_embedding_service() -> EmbeddingService:
    global _embedding_service

    if _embedding_service is None:
        _embedding_service = EmbeddingService()

    return _embedding_service


def get_ai_service() -> AIService:
    return ai_service


# -------------------------------
# Auth
# -------------------------------

def get_auth_service(
    db: AsyncSession = Depends(get_db),
) -> AuthService:
    return AuthService(
        repository=AuthRepository(db),
        email_repository=EmailVerificationRepository(db),
    )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    return await AuthService(
        repository=AuthRepository(db),
        email_repository=EmailVerificationRepository(db),
    ).get_current_user(token)


async def get_current_active_user(
    user=Depends(get_current_user),
):
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


# -------------------------------
# Workspace
# -------------------------------

def get_workspace_service(
    db: AsyncSession = Depends(get_db),
) -> WorkspaceService:
    return WorkspaceService(
        repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
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


# -------------------------------
# Resource
# -------------------------------

def get_resource_service(
    db: AsyncSession = Depends(get_db),
) -> ResourceService:

    workspace_member_service = WorkspaceMemberService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        invitation_repository=WorkspaceInvitationRepository(db),
        auth_repository=AuthRepository(db),
    )

    return ResourceService(
        repository=ResourceRepository(db),
        chunk_repository=ChunkRepository(db),
        workspace_member_service=workspace_member_service,
        parser_service=ParserService(),
        chunking_service=ChunkingService(),
        embedding_service=get_embedding_service(),
    )


# -------------------------------
# Chat
# -------------------------------

def get_chat_service(
    db: AsyncSession = Depends(get_db),
) -> ChatService:
    return ChatService(
        chat_repository=ChatRepository(db),
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        resource_repository=ResourceRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=get_embedding_service(),
        ai_service=ai_service,
    )


# -------------------------------
# Quiz
# -------------------------------

def get_quiz_service(
    db: AsyncSession = Depends(get_db),
) -> QuizService:
    return QuizService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=get_embedding_service(),
        ai_service=ai_service,
    )


# -------------------------------
# Flashcards
# -------------------------------

def get_flashcard_service(
    db: AsyncSession = Depends(get_db),
) -> FlashcardService:
    return FlashcardService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=get_embedding_service(),
        ai_service=ai_service,
    )


# -------------------------------
# Summary
# -------------------------------

def get_summary_service(
    db: AsyncSession = Depends(get_db),
) -> SummaryService:
    return SummaryService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=get_embedding_service(),
        ai_service=ai_service,
    )
    
# -------------------------------
# Revision
# -------------------------------
    
def get_revision_service(
    db: AsyncSession = Depends(get_db),
) -> RevisionService:
    return RevisionService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=EmbeddingService(),
        ai_service=get_ai_service(),
    )
    
    
# -------------------------------
# Roadmap
# -------------------------------
def get_roadmap_service(
    db: AsyncSession = Depends(get_db),
) -> RoadmapService:
    return RoadmapService(
        workspace_repository=WorkspaceRepository(db),
        member_repository=WorkspaceMemberRepository(db),
        chunk_repository=ChunkRepository(db),
        embedding_service=EmbeddingService(),
        ai_service=AIService(),
    )