from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text
from app.core.logger import logger
from app.db.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Lumora API")

    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))

    logger.info("Database connection established")

    yield

    logger.info("Shutting down Lumora API")

    await engine.dispose()