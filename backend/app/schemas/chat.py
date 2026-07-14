from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.chat_message import MessageRole


# ---------- Chat Session ----------

class ChatCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )


class ChatResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    workspace_id: UUID
    created_by: UUID
    title: str
    created_at: datetime
    updated_at: datetime


# ---------- Chat Messages ----------

class MessageCreate(BaseModel):
    content: str = Field(
        min_length=1,
    )


class MessageResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    chat_session_id: UUID
    role: MessageRole
    content: str
    created_at: datetime
    updated_at: datetime