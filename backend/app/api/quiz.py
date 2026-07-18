from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (get_current_user,get_quiz_service,)
from app.models.user import User
from app.schemas.quiz import (QuizGenerateRequest,QuizResponse,QuizSubmissionRequest,QuizSubmissionResponse,)
from app.services.quiz_service import QuizService

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"],
)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=QuizResponse,
)
async def generate_quiz(
    workspace_id: UUID,
    data: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    service: QuizService = Depends(get_quiz_service),
):
    return await service.generate_quiz(
        workspace_id=workspace_id,
        current_user=current_user,
        topic=data.topic,
        num_questions=data.num_questions,
    )
    
@router.post(
    "/submit",
    response_model=QuizSubmissionResponse,
)
async def submit_quiz(
    data: QuizSubmissionRequest,
    service: QuizService = Depends(get_quiz_service),
):
    return await service.submit_quiz(data)