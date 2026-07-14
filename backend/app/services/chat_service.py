from uuid import UUID

from app.core.exceptions import (ForbiddenError,ResourceNotFoundError,)
from app.models.chat_message import (ChatMessage,MessageRole,)
from app.models.chat_session import ChatSession
from app.models.user import User
from app.repositories.chat_repository import ChatRepository
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)
from app.repositories.workspace_repository import (WorkspaceRepository,)
from app.schemas.chat import (ChatCreate,MessageCreate,)
from app.services.ai_service import AIService

class ChatService:
    def __init__(
        self,
        chat_repository: ChatRepository,
        workspace_repository: WorkspaceRepository,
        member_repository: WorkspaceMemberRepository,
        ai_service: AIService,
    ):
        self.chat_repository = chat_repository
        self.workspace_repository = workspace_repository
        self.member_repository = member_repository
        self.ai_service = ai_service

    async def require_workspace_member(
        self,
        workspace_id: UUID,
        user_id: UUID,
    ):
        workspace = await self.workspace_repository.get_by_id(
            workspace_id
        )

        if workspace is None:
            raise ResourceNotFoundError(
                "Workspace not found."
            )

        if workspace.owner_id == user_id:
            return workspace

        member = await self.member_repository.get_member(
            workspace_id,
            user_id,
        )

        if member is None:
            raise ForbiddenError(
                "You are not a member of this workspace."
            )

        return workspace

    async def create_chat(
        self,
        workspace_id: UUID,
        current_user: User,
        data: ChatCreate,
    ) -> ChatSession:
        await self.require_workspace_member(
            workspace_id,
            current_user.id,
        )

        session = ChatSession(
            workspace_id=workspace_id,
            created_by=current_user.id,
            title=data.title,
        )

        return await self.chat_repository.create_session(
            session,
        )

    async def list_chats(
        self,
        workspace_id: UUID,
        current_user: User,
    ) -> list[ChatSession]:
        await self.require_workspace_member(
            workspace_id,
            current_user.id,
        )

        return await self.chat_repository.list_sessions(
            workspace_id,
        )

    async def get_chat(
        self,
        chat_id: UUID,
        current_user: User,
    ) -> ChatSession:
        session = await self.chat_repository.get_session(
            chat_id,
        )

        if session is None:
            raise ResourceNotFoundError(
                "Chat not found."
            )

        await self.require_workspace_member(
            session.workspace_id,
            current_user.id,
        )

        return session

    async def delete_chat(
        self,
        chat_id: UUID,
        current_user: User,
    ) -> None:
        session = await self.get_chat(
            chat_id,
            current_user,
        )

        await self.chat_repository.delete_session(
            session,
        )

    async def add_message(
        self,
        chat_id: UUID,
        current_user: User,
        data: MessageCreate,
    ):
        session = await self.get_chat(
            chat_id,
            current_user,
        )

        # Save user's message
        user_message = ChatMessage(
            chat_session_id=session.id,
            role=MessageRole.USER,
            content=data.content,
        )

        user_message = await self.chat_repository.create_message(
            user_message,
        )

        # Generate AI response
        ai_response = await self.ai_service.generate_response(
            data.content,
        )

        # Save assistant message
        assistant_message = ChatMessage(
            chat_session_id=session.id,
            role=MessageRole.ASSISTANT,
            content=ai_response,
        )

        assistant_message = await self.chat_repository.create_message(
            assistant_message,
        )

        return {
            "user_message": user_message,
            "assistant_message": assistant_message,
        }

    async def list_messages(
        self,
        chat_id: UUID,
        current_user: User,
    ) -> list[ChatMessage]:
        session = await self.get_chat(
            chat_id,
            current_user,
        )

        return await self.chat_repository.list_messages(
            session.id,
        )