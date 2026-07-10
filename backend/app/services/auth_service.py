from datetime import UTC, datetime, timedelta

from app.config.settings import settings
from app.core.exceptions import (ConflictError, ResourceNotFoundError, UnauthorizedError)
from app.core.logger import logger
from app.core.security import (create_access_token, create_refresh_token, validate_refresh_token, generate_email_verification_token, hash_password, verify_password)
from app.models.email_verification import EmailVerificationToken
from app.models.user import User
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import (LoginRequest, RegisterRequest, TokenResponse)
from app.repositories.email_verification_repository import (EmailVerificationRepository,)

class AuthService:
    def __init__(self, repository: AuthRepository, email_repository: EmailVerificationRepository,):
        self.repository = repository
        self.email_repository = email_repository
        
    async def register(self, data: RegisterRequest) -> User:
        existing_user = await self.repository.get_user_by_email(
            data.email
        )

        if existing_user:
            raise ConflictError("Email already registered")

        user = User(
            fullname=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
        )

        user = await self.repository.create_user(user)

        verification = EmailVerificationToken(
            user_id=user.id,
            token=generate_email_verification_token(),
            expires_at=datetime.now(UTC)
            + timedelta(
                hours=settings.email_verification_expire_hours
            ),
        )

        await self.email_repository.create(verification)

        verification_link = (
            f"{settings.backend_url}/auth/verify-email"
            f"?token={verification.token}"
        )

        logger.info(
            "Email verification link generated",
            email=user.email,
            verification_link=verification_link,
        )

        # TODO:
        # await send_verification_email(user.email, verification_link)

        return user
    
    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repository.get_user_by_email(data.email)
        
        if not user:
            raise UnauthorizedError("Invalid credentials")
        
        if not user.password_hash:
            raise UnauthorizedError("Invalid credentials")
        
        if not user.is_verified:
            raise UnauthorizedError("Please verify your email before logging in.")
        
        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedError("Invalid credentials")
        
        user.last_login = datetime.now(UTC)
        
        await self.repository.update_user(user)
        
        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )
        
    async def verify_email(self,token: str,) -> None:
        verification = await self.email_repository.get_by_token(token)

        if verification is None:
            raise UnauthorizedError("Invalid verification token.")

        if verification.used:
            raise UnauthorizedError("Verification token already used.")

        if verification.expires_at < datetime.now(UTC):
            raise UnauthorizedError("Verification token has expired.")

        user = await self.repository.get_user_by_id(
            verification.user_id
        )

        if user is None:
            raise ResourceNotFoundError("User not found.")

        user.is_verified = True

        verification.used = True

        await self.repository.update_user(user)
        await self.email_repository.update(verification)
        
    async def resend_verification(self,email: str,) -> None:

        user = await self.repository.get_user_by_email(email)
    
        if user is None:
            raise ResourceNotFoundError("User not found.")
    
        if user.is_verified:
            raise ConflictError("Email already verified.")
    
        old_token = await self.email_repository.get_active_token_by_user(
            user.id
        )
    
        if old_token:
            old_token.used = True
            await self.email_repository.update(old_token)
    
        verification = EmailVerificationToken(
            user_id=user.id,
            token=generate_email_verification_token(),
            expires_at=datetime.now(UTC)
            + timedelta(
                hours=settings.email_verification_expire_hours
            ),
        )
    
        await self.email_repository.create(verification)
    
        verification_link = (
            f"{settings.backend_url}/auth/verify-email"
            f"?token={verification.token}"
        )
    
        logger.info(
            "Verification email regenerated",
            email=user.email,
            verification_link=verification_link,
        )
    
    async def refresh_token(self, refresh_token: str,) -> TokenResponse:
        try:
            user_id = validate_refresh_token(refresh_token)
        except ValueError:
            raise UnauthorizedError("Invalid refresh token.")
    
        user = await self.repository.get_user_by_id(user_id)
    
        if user is None:
            raise UnauthorizedError("User not found.")
    
        if not user.is_active:
            raise UnauthorizedError("User account is inactive.")
    
        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )