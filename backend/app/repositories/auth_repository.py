from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.password_reset import PasswordResetToken
from app.models.user import User

class AuthRepository:
    """Database operations related to authentication"""
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user: User) -> User:
        """Persist a new user"""
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_user_by_email(self, email: str) -> User | None:
        """Retrieve a user by email."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        """Retrieve a user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def update_user(self, user: User) -> User:
        """Persist changes to an existing user."""
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user(self, user: User) -> None:
        """Delete a user"""
        await self.db.delete(user)
        await self.db.commit()
    
    async def create_password_reset_token(self,token: PasswordResetToken,) -> PasswordResetToken:
        self.db.add(token)
        await self.db.commit()
        await self.db.refresh(token)
        return token


    async def get_password_reset_token(self,token: str,) -> PasswordResetToken | None:
        result = await self.db.execute(
            select(PasswordResetToken).where(PasswordResetToken.token == token)
        )
        return result.scalar_one_or_none()


    async def update_password_reset_token(self,token: PasswordResetToken,) -> PasswordResetToken:
        await self.db.commit()
        await self.db.refresh(token)
        return token
    
    async def update_user_profile(self,user: User,) -> User:
        await self.db.commit()
        await self.db.refresh(user)
        return user