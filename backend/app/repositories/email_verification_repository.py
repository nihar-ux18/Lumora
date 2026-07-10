from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.email_verification import EmailVerificationToken


class EmailVerificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        verification: EmailVerificationToken,
    ) -> EmailVerificationToken:
        self.db.add(verification)
        await self.db.commit()
        await self.db.refresh(verification)
        return verification

    async def get_by_token(
        self,
        token: str,
    ) -> EmailVerificationToken | None:
        result = await self.db.execute(
            select(EmailVerificationToken).where(
                EmailVerificationToken.token == token
            )
        )
        return result.scalar_one_or_none()

    async def mark_used(
        self,
        verification: EmailVerificationToken,
    ) -> None:
        verification.used = True
        await self.db.commit()

    async def get_active_token_by_user(self, user_id: UUID,) -> EmailVerificationToken | None:
        result = await self.db.execute(
            select(EmailVerificationToken).where(
                EmailVerificationToken.user_id == user_id,
                EmailVerificationToken.used.is_(False),
            )
        )
        return result.scalar_one_or_none()
    
    async def update(self,verification: EmailVerificationToken,) -> EmailVerificationToken:
        await self.db.commit()
        await self.db.refresh(verification)
        return verification
    
    async def delete_expired(self) -> None:
        await self.db.execute(
            delete(EmailVerificationToken).where(
                EmailVerificationToken.expires_at < datetime.now(UTC)
            )
        )
        await self.db.commit()