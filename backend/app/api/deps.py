from fastapi import Depends

from app.core.security import oauth2_scheme
from app.db.session import get_db
from app.repositories.auth_repository import AuthRepository
from app.services.auth_service import AuthService
from app.repositories.email_verification_repository import (EmailVerificationRepository,)
from sqlalchemy.ext.asyncio import AsyncSession


def get_auth_service(db: AsyncSession = Depends(get_db),) -> AuthService:
    auth_repository = AuthRepository(db)
    email_repository = EmailVerificationRepository(db)

    return AuthService(
        repository=auth_repository,
        email_repository=email_repository,
    )
    
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    repository = AuthRepository(db)

    return await AuthService(
        repository=repository,
        email_repository=EmailVerificationRepository(db),
    ).get_current_user(token)
    
async def get_current_active_user(user=Depends(get_current_user)):
    return await AuthService.validate_active_user(user)