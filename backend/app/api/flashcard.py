from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_current_user,
    get_flashcard_service,
)
from app.models.user import User
from app.schemas.flashcard import (
    FlashcardGenerateRequest,
    FlashcardResponse,
)
from app.services.flashcard_service import FlashcardService

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"],
)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=FlashcardResponse,
)
async def generate_flashcards(
    workspace_id: UUID,
    data: FlashcardGenerateRequest,
    current_user: User = Depends(get_current_user),
    service: FlashcardService = Depends(
        get_flashcard_service,
    ),
):
    return await service.generate_flashcards(
        workspace_id=workspace_id,
        current_user=current_user,
        topic=data.topic,
        num_cards=data.num_cards,
    )