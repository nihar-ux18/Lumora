from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession


class ChatRepository:
    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db

    # ---------- Chat Sessions ----------

    async def create_session(
        self,
        session: ChatSession,
    ) -> ChatSession:
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session(
        self,
        session_id: UUID,
    ) -> ChatSession | None:
        result = await self.db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id
            )
        )
        return result.scalar_one_or_none()

    async def list_sessions(
        self,
        workspace_id: UUID,
    ) -> list[ChatSession]:
        result = await self.db.execute(
            select(ChatSession)
            .where(
                ChatSession.workspace_id == workspace_id
            )
            .order_by(ChatSession.updated_at.desc())
        )
        return list(result.scalars().all())

    async def update_session(
        self,
        session: ChatSession,
    ) -> ChatSession:
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def delete_session(
        self,
        session: ChatSession,
    ) -> None:
        await self.db.delete(session)
        await self.db.commit()

    # ---------- Chat Messages ----------

    async def create_message(
        self,
        message: ChatMessage,
    ) -> ChatMessage:
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def list_messages(
        self,
        session_id: UUID,
    ) -> list[ChatMessage]:
        result = await self.db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.chat_session_id == session_id
            )
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars().all())
    
    async def get_recent_messages(
        self,
        chat_session_id: UUID,
        limit: int = 20,
    ) -> list[ChatMessage]:
        result = await self.db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.chat_session_id == chat_session_id,
            )
            .order_by(ChatMessage.created_at.asc())
            .limit(limit)
        )

        return list(result.scalars().all())
    
    async def build_conversation_history(
        self,
        chat_session_id: UUID,
    ) -> list[dict[str, str]]:
        messages = await self.chat_repository.get_recent_messages(
            chat_session_id,
        )
    
        history = []
    
        for message in messages:
            history.append(
                {
                    "role": message.role.value.lower(),
                    "content": message.content,
                }
            )
    
        return history