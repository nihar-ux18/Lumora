# ruff: noqa: E402, F403
import os
import sys
from urllib.parse import urlparse, urlunparse
from unittest.mock import MagicMock, AsyncMock
from pathlib import Path
from uuid import uuid4
from tempfile import NamedTemporaryFile

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

class MockStorageService:
    def __init__(self):
        self.files = {}

    async def upload_resource(self, file):
        extension = Path(file.filename or "").suffix.lower()

        if extension not in {
        ".pdf",
        ".txt",
        ".md",
        ".docx",
        ".png",
        ".jpg",
        ".jpeg",
        }:
            from app.core.exceptions import ConflictError

            raise ConflictError("Unsupported file type.")

        storage_path = f"resources/{uuid4()}{extension}"

        self.files[storage_path] = await file.read()

        return storage_path

    def download_resource(self, storage_path, suffix):
        file_data = self.files[storage_path]

        with NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(file_data)
            return temp_file.name

    def delete_resource(self, storage_path):
        self.files.pop(storage_path, None)

# 7. Pytest Imports & Fixtures
import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.db.base import Base
from app.models import *  # Registers all models on Base.metadata
from app.main import app  # type: ignore[no-redef]

from app.api.deps import get_resource_service, get_embedding_service
from app.repositories.resource_repository import ResourceRepository
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.repositories.workspace_member_repository import WorkspaceMemberRepository
from app.repositories.workspace_invitation_repository import WorkspaceInvitationRepository
from app.repositories.auth_repository import AuthRepository
from app.services.resource_service import ResourceService
from app.services.workspace_member_service import WorkspaceMemberService
from app.services.parser_service import ParserService
from app.services.chunking_service import ChunkingService


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
    mock_storage = MockStorageService()

    def override_get_resource_service():
        workspace_member_service = WorkspaceMemberService(
            workspace_repository=WorkspaceRepository(db_session),
            member_repository=WorkspaceMemberRepository(db_session),
            invitation_repository=WorkspaceInvitationRepository(db_session),
            auth_repository=AuthRepository(db_session),
        )

        return ResourceService(
            repository=ResourceRepository(db_session),
            chunk_repository=ChunkRepository(db_session),
            workspace_member_service=workspace_member_service,
            parser_service=ParserService(),
            chunking_service=ChunkingService(),
            embedding_service=get_embedding_service(),
            storage_service=mock_storage,
        )

    app.dependency_overrides[get_resource_service] = override_get_resource_service

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
