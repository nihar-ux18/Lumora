from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.auth_repository import AuthRepository
from app.services.auth_service import AuthService


def get_auth_service(
    db: AsyncSession = Depends(get_db),
) -> AuthService:
    repository = AuthRepository(db)
    return AuthService(repository)