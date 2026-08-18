# ruff: noqa: E402, F403
import os
import sys
from urllib.parse import urlparse, urlunparse
from unittest.mock import MagicMock, AsyncMock

# 1. Dynamically derive the test database URL from settings
from app.config.settings import Settings

settings = Settings()
original_db_url = settings.database_url
parsed = urlparse(original_db_url)
test_db_url = urlunparse(parsed._replace(path="/lumora_test"))
admin_db_url = urlunparse(parsed._replace(path="/postgres"))

# 2. Set DATABASE_URL env var before importing anything else
os.environ["DATABASE_URL"] = test_db_url
os.environ["APP_ENV"] = "testing"


# 3. Create test database if not exists
def create_test_db_if_not_exists():
    import psycopg

    psycopg_admin_url = admin_db_url.replace("postgresql+psycopg://", "postgresql://")
    try:
        with psycopg.connect(psycopg_admin_url, autocommit=True) as conn:
            exists = conn.execute(
                "SELECT 1 FROM pg_database WHERE datname='lumora_test'"
            ).fetchone()
            if not exists:
                conn.execute("CREATE DATABASE lumora_test")
    except Exception as e:
        print(f"Warning: Could not check/create test database dynamically: {e}")


create_test_db_if_not_exists()

# 4. Mock sentence-transformers to avoid downloading models
import numpy as np


class DummySentenceTransformer:
    def __init__(self, *args, **kwargs):
        pass

    def encode(self, text, *args, **kwargs):
        if isinstance(text, list):
            return np.array([[0.1] * 384 for _ in text])
        return np.array([0.1] * 384)


sys.modules["sentence_transformers"] = MagicMock()
import sentence_transformers

sentence_transformers.SentenceTransformer = DummySentenceTransformer  # type: ignore

# 5. Mock AIService to avoid real OpenAI/Groq calls
from app.services.ai_service import AIService


def mock_ai_init(self):
    self.client = MagicMock()


AIService.__init__ = mock_ai_init  # type: ignore
AIService.generate_response = AsyncMock(
    return_value="Hello! This is a mock assistant response."
)  # type: ignore
AIService.generate_quiz = AsyncMock(
    return_value={
        "questions": [  # type: ignore
            {
                "question": "What is a connectivity test?",
                "options": ["A", "B", "C", "D"],
                "correct_answer": 0,
                "explanation": "A is correct.",
            }
        ]
    }
)
AIService.generate_flashcards = AsyncMock(return_value=[])  # type: ignore
AIService.generate_summary = AsyncMock(return_value="Mocked summary.")  # type: ignore
AIService.generate_revision_material = AsyncMock(return_value={})  # type: ignore
AIService.generate_roadmap = AsyncMock(return_value={})  # type: ignore

# 6. Mock email sending service
import app.services.email_service

app.services.email_service.send_email = AsyncMock()
app.services.email_service.send_verification_email = AsyncMock()
app.services.email_service.send_password_reset_email = AsyncMock()

# 7. Pytest Imports & Fixtures
import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.db.base import Base
from app.models import *  # Registers all models on Base.metadata
from app.main import app  # type: ignore[no-redef]


@pytest.fixture(scope="session")
def event_loop():
    import asyncio

    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def prepare_database():
    engine = create_async_engine(test_db_url)
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine(test_db_url)
    connection = await engine.connect()
    transaction = await connection.begin()

    Session = async_sessionmaker(
        bind=connection,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    session = Session()

    # Override get_db dependency in FastAPI
    from app.db.session import get_db

    async def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db

    yield session

    await session.close()
    await transaction.rollback()
    await connection.close()
    await engine.dispose()
    app.dependency_overrides.clear()


from httpx import ASGITransport


@pytest_asyncio.fixture
async def client(db_session):
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
