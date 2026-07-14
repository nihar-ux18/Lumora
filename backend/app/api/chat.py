from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_chat_service,
    get_current_user,
)
from app.models.user import User
from app.schemas.chat import (
    ChatCreate,
    ChatResponse,
    MessageCreate,
    MessageResponse,
)
from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=ChatResponse,
)
async def create_chat(
    workspace_id: UUID,
    data: ChatCreate,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.create_chat(
        workspace_id,
        current_user,
        data,
    )


@router.get(
    "/workspaces/{workspace_id}",
    response_model=list[ChatResponse],
)
async def list_chats(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.list_chats(
        workspace_id,
        current_user,
    )


@router.get(
    "/{chat_id}",
    response_model=ChatResponse,
)
async def get_chat(
    chat_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.get_chat(
        chat_id,
        current_user,
    )


@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    await service.delete_chat(
        chat_id,
        current_user,
    )

    return {
        "message": "Chat deleted successfully."
    }


@router.post(
    "/{chat_id}/messages",
    response_model=MessageResponse,
)
async def add_message(
    chat_id: UUID,
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.add_message(
        chat_id,
        current_user,
        data,
    )


@router.get(
    "/{chat_id}/messages",
    response_model=list[MessageResponse],
)
async def list_messages(
    chat_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.list_messages(
        chat_id,
        current_user,
    )