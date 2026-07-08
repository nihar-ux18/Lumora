from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db

router = APIRouter(tags=["Health"])


@router.get("/health/db")
async def database_health(
    db: AsyncSession = Depends(get_db),
):
    await db.execute(text("SELECT 1"))
    return {"database": "healthy"}