from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.auth_repository import AuthRepository
from app.repositories.email_verification_repository import (
    EmailVerificationRepository,
)
from app.services.auth_service import AuthService


def get_auth_service(
    db: AsyncSession = Depends(get_db),
) -> AuthService:
    auth_repository = AuthRepository(db)
    email_repository = EmailVerificationRepository(db)

    return AuthService(
        repository=auth_repository,
        email_repository=email_repository,
    )