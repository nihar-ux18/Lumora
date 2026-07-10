from datetime import UTC, datetime

from app.core.exceptions import (ConflictError, UnauthorizedError)
from app.core.security import (create_access_token, create_refresh_token, hash_password, verify_password)
from app.models.user import User
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import (LoginRequest, RegisterRequest, TokenResponse)

class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository=repository
        
    async def register(self, data: RegisterRequest) -> User:
        existing_user = await self.repository.get_user_by_email(data.email)
        
        if existing_user:
            raise ConflictError("Email already registered")
        
        user = User(
            fullname = data.full_name,
            email = data.email,
            password_hash = hash_password(data.password),
        )
        
        return await self.repository.create_user(user)
    
    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repository.get_user_by_email(data.email)
        
        if not user:
            raise UnauthorizedError("Invalid credentials")
        
        if not user.password_hash:
            raise UnauthorizedError("Invalid credentials")
        
        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedError("Invalid credentials")
        
        user.last_login = datetime.now(UTC)
        
        await self.repository.update_user(user)
        
        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )