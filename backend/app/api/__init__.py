from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.workspaces import router as workspace_router
from app.api.workspace_members import router as workspace_member_router
from app.api.resources import router as resource_router
from app.api.chat import router as chat_router
from app.api.flashcard import router as flashcard_router
from app.api.quiz import router as quiz_router
from app.api.revision import router as revision_router
from app.api.summary import router as summary_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(chat_router)
api_router.include_router(workspace_router)
api_router.include_router(workspace_member_router)
api_router.include_router(resource_router)
api_router.include_router(quiz_router)
api_router.include_router(flashcard_router)
api_router.include_router(summary_router)
api_router.include_router(revision_router)