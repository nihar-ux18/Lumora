# Lumora — Backend Architecture

**Document Owner:** Engineering Team
**Status:** Draft v1.0
**Last Updated:** July 8, 2026
**Stack:** FastAPI, PostgreSQL, SQLAlchemy, Alembic, Redis, Celery, pgvector, LangChain

---

## 1. Architectural Principles

Lumora's backend follows a **layered, dependency-inverted architecture** so that business logic stays independent of frameworks, databases, and AI providers. The guiding rules:

1. **Separation of concerns** — API layer never talks to the database directly; it goes through services and repositories.
2. **Dependency Inversion** — high-level modules (services) depend on abstractions (repository/interfaces), not concrete implementations (SQLAlchemy queries, OpenAI SDK calls).
3. **Single Responsibility per layer** — routers handle HTTP, services handle business rules, repositories handle persistence, workers handle async/long-running jobs.
4. **Testability first** — every layer can be tested in isolation by mocking the layer below it via dependency injection.
5. **AI-provider agnostic** — LangChain abstractions and an internal `ai/` module ensure OpenAI/Gemini can be swapped without touching business logic.

---

## 2. High-Level Layered Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Client (Next.js)                      │
└───────────────────────────┬───────────────────────────────┘
                             │ HTTPS / REST
┌───────────────────────────▼───────────────────────────────┐
│  API Layer (FastAPI Routers)                               │
│  - Request/response schemas (Pydantic)                     │
│  - Auth guards, dependency injection wiring                │
└───────────────────────────┬───────────────────────────────┘
                             │
┌───────────────────────────▼───────────────────────────────┐
│  Service Layer (Business Logic)                            │
│  - Orchestrates repositories, AI clients, cache, storage    │
│  - Enforces business rules & authorization decisions        │
└──────────────┬───────────────────────────┬─────────────────┘
               │                           │
┌──────────────▼───────────────┐ ┌─────────▼─────────────────┐
│  Repository Layer             │ │  AI / External Services    │
│  - DB access via SQLAlchemy   │ │  - LangChain, OpenAI/Gemini│
│  - pgvector queries            │ │  - S3, YouTube, GitHub API │
└──────────────┬───────────────┘ └─────────┬─────────────────┘
               │                           │
┌──────────────▼───────────────────────────▼─────────────────┐
│  Infrastructure                                             │
│  PostgreSQL | Redis | Celery Workers | S3-compatible Storage│
└───────────────────────────────────────────────────────────┘
```

**Flow example (upload → notes generation):**
Router receives file → Service validates & persists metadata via Repository → Service enqueues Celery task → Worker downloads file, chunks, embeds (pgvector), calls AI service → Worker writes results back through Repository → Client polls/subscribes for status.

---

## 3. Folder Tree

```
lumora-backend/
├── alembic/
│   ├── versions/
│   └── env.py
├── app/
│   ├── main.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   └── logging_config.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── resources.py
│   │       ├── notes.py
│   │       ├── flashcards.py
│   │       ├── quizzes.py
│   │       ├── chat.py
│   │       ├── roadmap.py
│   │       └── progress.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── permissions.py
│   │   ├── exceptions.py
│   │   ├── middleware.py
│   │   └── constants.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── resource.py
│   │   ├── note.py
│   │   ├── flashcard.py
│   │   ├── quiz.py
│   │   ├── chat.py
│   │   ├── embedding.py
│   │   └── progress.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── resource.py
│   │   ├── note.py
│   │   ├── flashcard.py
│   │   ├── quiz.py
│   │   ├── chat.py
│   │   └── common.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user_repository.py
│   │   ├── resource_repository.py
│   │   ├── note_repository.py
│   │   ├── flashcard_repository.py
│   │   ├── quiz_repository.py
│   │   ├── chat_repository.py
│   │   └── embedding_repository.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── resource_service.py
│   │   ├── note_service.py
│   │   ├── flashcard_service.py
│   │   ├── quiz_service.py
│   │   ├── chat_service.py
│   │   ├── roadmap_service.py
│   │   └── progress_service.py
│   ├── ai/
│   │   ├── __init__.py
│   │   ├── provider.py
│   │   ├── clients/
│   │   │   ├── openai_client.py
│   │   │   └── gemini_client.py
│   │   ├── chains/
│   │   │   ├── notes_chain.py
│   │   │   ├── flashcard_chain.py
│   │   │   ├── quiz_chain.py
│   │   │   ├── rag_chat_chain.py
│   │   │   └── repo_analysis_chain.py
│   │   ├── embeddings.py
│   │   └── prompts/
│   │       ├── notes_prompt.py
│   │       ├── flashcard_prompt.py
│   │       └── quiz_prompt.py
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── pdf_parser.py
│   │   ├── youtube_parser.py
│   │   ├── github_parser.py
│   │   ├── website_parser.py
│   │   ├── ppt_parser.py
│   │   └── chunker.py
│   ├── workers/
│   │   ├── __init__.py
│   │   ├── celery_app.py
│   │   ├── tasks/
│   │   │   ├── ingestion_tasks.py
│   │   │   ├── generation_tasks.py
│   │   │   ├── embedding_tasks.py
│   │   │   └── notification_tasks.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py
│   │   └── base_class.py
│   ├── cache/
│   │   ├── __init__.py
│   │   └── redis_client.py
│   ├── storage/
│   │   ├── __init__.py
│   │   └── s3_client.py
│   └── utils/
│       ├── __init__.py
│       ├── pagination.py
│       └── datetime_utils.py
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── repositories/
│   ├── integration/
│   │   ├── api/
│   │   └── workers/
│   ├── conftest.py
│   └── factories/
├── scripts/
│   ├── seed_db.py
│   └── create_superuser.py
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── celery.Dockerfile
├── .env.example
├── alembic.ini
├── pyproject.toml
└── requirements.txt
```

---

## 4. Folder Responsibilities

### `alembic/`
Database migration scripts managed by Alembic. Every schema change (new table, column, index, pgvector extension setup) is captured as a versioned migration here so environments stay in sync.

### `app/main.py`
Application entrypoint. Creates the FastAPI app instance, registers middleware, mounts the versioned API router, wires startup/shutdown events (DB connection pool init, Redis connection, Celery health check).

### `app/config/`
- `settings.py` — Pydantic `BaseSettings` class loading environment variables (DB URL, Redis URL, JWT secret, AI API keys, S3 credentials, CORS origins).
- `logging_config.py` — Centralized logging configuration (formatters, handlers, log levels per environment).

### `app/api/`
The **HTTP layer**. Routers only: parse requests, validate via Pydantic schemas, call the appropriate service, return responses. No business logic and no direct DB queries here.
- `deps.py` — Shared FastAPI dependencies (`get_db`, `get_current_user`, `get_current_active_user`, service factory functions).
- `v1/router.py` — Aggregates all v1 routers under `/api/v1`.
- Each resource file (`auth.py`, `resources.py`, `notes.py`, etc.) — one router per domain, keeping endpoints thin.

### `app/core/`
Cross-cutting concerns not specific to any single domain.
- `security.py` — Password hashing, JWT encode/decode, OAuth token verification.
- `permissions.py` — Authorization rules/policies (e.g., `can_access_resource(user, resource)`).
- `exceptions.py` — Custom exception classes (`NotFoundException`, `UnauthorizedException`, `ValidationException`, `AIGenerationError`) and the global exception handler registration.
- `middleware.py` — Custom middleware (request logging, correlation ID injection, rate limiting).
- `constants.py` — App-wide constants/enums (resource types, job statuses).

### `app/models/`
SQLAlchemy ORM models — the database schema as Python classes. One file per entity (`user.py`, `resource.py`, `note.py`, `flashcard.py`, `quiz.py`, `chat.py`, `embedding.py`, `progress.py`). `base.py` defines the declarative base and shared mixins (timestamps, UUID primary keys, soft-delete).

### `app/schemas/`
Pydantic models for **request/response validation and serialization**. Kept separate from ORM models so the API contract can evolve independently of the DB schema. Includes `Create`, `Update`, `Read`, and `List` variants per domain.

### `app/repositories/`
The **data access layer**, implementing the Repository Pattern. Each repository wraps SQLAlchemy queries for one entity, exposing methods like `get_by_id`, `list_by_user`, `create`, `update`, `delete`, and domain-specific queries (`get_resources_by_folder`, `search_embeddings_by_similarity`). Services never write raw SQLAlchemy queries themselves — they call repository methods. `base.py` defines a generic `BaseRepository[T]` with common CRUD to avoid duplication.

### `app/services/`
The **business logic layer**. Services orchestrate repositories, AI clients, cache, and storage to fulfill a use case (e.g., `resource_service.upload_resource()` validates file type, stores it in S3 via `storage/`, creates a DB record via `resource_repository`, and enqueues a Celery ingestion task). This is where business rules, authorization checks, and multi-step workflows live — **routers call services, never repositories directly**.

### `app/ai/`
Encapsulates all AI/LLM logic, kept isolated so providers can be swapped.
- `provider.py` — Factory that returns the configured AI client (OpenAI or Gemini) based on settings, implementing a common interface.
- `clients/` — Thin wrappers around each provider's SDK.
- `chains/` — LangChain chains for each generation task (notes, flashcards, quizzes, RAG chat, repo analysis), composing prompts + retrieval + the LLM call.
- `embeddings.py` — Embedding generation logic used both during ingestion and query-time retrieval.
- `prompts/` — Versioned prompt templates, kept separate from chain logic for easy iteration/testing.

### `app/ingestion/`
Format-specific parsers that convert raw uploaded/linked content into clean text ready for chunking and embedding.
- `pdf_parser.py`, `youtube_parser.py`, `github_parser.py`, `website_parser.py`, `ppt_parser.py` — one parser per source type.
- `chunker.py` — Splits parsed text into embedding-ready chunks (token-aware splitting, overlap strategy).

### `app/workers/`
Background/async processing via Celery.
- `celery_app.py` — Celery app instance, broker/backend configuration (Redis).
- `tasks/ingestion_tasks.py` — Orchestrates parsing → chunking → embedding for a newly uploaded resource.
- `tasks/generation_tasks.py` — Runs AI chains to generate notes/flashcards/quizzes asynchronously.
- `tasks/embedding_tasks.py` — Handles (re)embedding jobs, e.g., after content edits.
- `tasks/notification_tasks.py` — Sends revision reminders and processing-complete notifications.

### `app/db/`
- `session.py` — SQLAlchemy engine and session factory, async session dependency for FastAPI.
- `base_class.py` — Declarative base import point used by Alembic autogeneration.

### `app/cache/`
- `redis_client.py` — Redis connection singleton and helper functions for caching (e.g., cached AI responses, session data, rate-limit counters).

### `app/storage/`
- `s3_client.py` — Wrapper around S3-compatible storage (upload, presigned URL generation, delete) used by the resource service.

### `app/utils/`
Small, stateless helper functions shared across layers (pagination helpers, datetime formatting) — never business logic.

### `tests/`
- `unit/` — Tests services and repositories in isolation using mocks/fakes (no real DB/network).
- `integration/` — Tests API endpoints end-to-end against a test database, and Celery tasks with a test broker.
- `conftest.py` — Shared pytest fixtures (test client, test DB session, auth token factory).
- `factories/` — Test data factories (e.g., using `factory_boy`) for generating users, resources, notes.

### `scripts/`
One-off operational scripts: DB seeding for local development, superuser creation.

### `docker/`
Dockerfiles for the API service and the Celery worker service, plus `docker-compose.yml` for local orchestration (API, worker, Postgres, Redis).

---

## 5. Dependency Injection

FastAPI's native `Depends()` system is used throughout, backed by a consistent pattern:

```python
# app/api/deps.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.resource_repository import ResourceRepository
from app.services.resource_service import ResourceService
from app.core.security import get_current_user

def get_resource_repository(db: AsyncSession = Depends(get_db)) -> ResourceRepository:
    return ResourceRepository(db)

def get_resource_service(
    repo: ResourceRepository = Depends(get_resource_repository),
) -> ResourceService:
    return ResourceService(repo)
```

```python
# app/api/v1/resources.py
@router.post("/resources")
async def upload_resource(
    payload: ResourceCreate,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.upload_resource(current_user.id, payload)
```

**Why this matters:**
- Each layer only knows about the interface of the layer beneath it, injected at request time.
- Tests can override dependencies (`app.dependency_overrides[get_resource_service] = lambda: FakeResourceService()`) to isolate the router layer completely.
- Swapping an implementation (e.g., a mock repository during tests, or a different AI provider) requires no changes to service or router code.

---

## 6. Repository Pattern

Every entity has a repository implementing a consistent interface via a generic base:

```python
# app/repositories/base.py
from typing import Generic, TypeVar, Type
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, db: AsyncSession, model: Type[ModelType]):
        self.db = db
        self.model = model

    async def get_by_id(self, id: str) -> ModelType | None: ...
    async def list(self, **filters) -> list[ModelType]: ...
    async def create(self, obj_in: dict) -> ModelType: ...
    async def update(self, id: str, obj_in: dict) -> ModelType: ...
    async def delete(self, id: str) -> None: ...
```

```python
# app/repositories/resource_repository.py
class ResourceRepository(BaseRepository[Resource]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Resource)

    async def get_by_user_and_folder(self, user_id: str, folder_id: str | None) -> list[Resource]:
        ...

    async def search_similar_chunks(self, embedding: list[float], user_id: str, top_k: int = 5):
        # pgvector cosine similarity query, scoped to the user
        ...
```

**Benefits:** Services depend on repository interfaces, not SQLAlchemy directly — enabling unit tests with in-memory fakes, easier query optimization in one place, and consistent access-pattern enforcement (e.g., every query is user-scoped for tenant isolation).

---

## 7. Service Layer

Services contain orchestration and business rules. Example:

```python
# app/services/resource_service.py
class ResourceService:
    def __init__(self, repo: ResourceRepository, storage: S3Client, task_queue):
        self.repo = repo
        self.storage = storage
        self.task_queue = task_queue

    async def upload_resource(self, user_id: str, payload: ResourceCreate) -> Resource:
        self._validate_file_type(payload.file_type)
        file_url = await self.storage.upload(payload.file, user_id)
        resource = await self.repo.create({
            "user_id": user_id,
            "type": payload.file_type,
            "source_url": file_url,
            "status": "queued",
        })
        self.task_queue.send_task("ingestion_tasks.process_resource", args=[str(resource.id)])
        return resource
```

Rules enforced here: services never return raw ORM objects to the API layer unmodified without going through schema serialization; services are the only layer allowed to call AI chains, storage, and repositories together; authorization checks that require business context (e.g., "is this resource owned by the user AND not archived") live here, delegating simple role checks to `core/permissions.py`.

---

## 8. Background Tasks (Celery)

- **Broker & backend:** Redis for both the Celery broker and result backend.
- **Task categories:**
  - `ingestion_tasks` — parse → chunk → embed pipeline, triggered on upload.
  - `generation_tasks` — AI content generation (notes, flashcards, quizzes, repo analysis), triggered on-demand or after ingestion completes.
  - `embedding_tasks` — re-embedding on content edits.
  - `notification_tasks` — scheduled revision reminders (via Celery Beat).
- **Status tracking:** Each task updates a `status` field (`queued`, `processing`, `completed`, `failed`) on the relevant DB row via the repository layer, so the API can expose polling/status endpoints (or push via WebSocket in a future iteration).
- **Reliability:** Tasks use `autoretry_for` with exponential backoff for transient failures (network/API rate limits); a dead-letter queue captures tasks that exhaust retries for manual/automated triage.
- **Idempotency:** Tasks are written to be safely re-runnable (checking current status before reprocessing) to tolerate retries and worker crashes.

```python
# app/workers/tasks/ingestion_tasks.py
@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def process_resource(self, resource_id: str):
    ...
```

---

## 9. Authentication

- **JWT-based sessions:** Access tokens (short-lived, ~15 min) + refresh tokens (long-lived, rotated on use, stored hashed).
- **Password auth:** Passwords hashed with `bcrypt`/`argon2` via `core/security.py`; never stored or logged in plaintext.
- **OAuth (Google, GitHub):** Standard OAuth2 authorization-code flow; on callback, the backend exchanges the code, fetches the provider profile, and creates/links a local user record. OAuth access tokens are stored encrypted if needed for later API calls (e.g., GitHub repo access).
- **Token delivery:** Access token returned in response body for the SPA to hold in memory; refresh token set as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie to mitigate XSS token theft.
- **`get_current_user` dependency:** Decodes and validates the JWT on every protected route, loads the user via `UserRepository`, and raises `UnauthorizedException` on failure — all enforced centrally in `app/core/security.py` and wired via `app/api/deps.py`.

---

## 10. Authorization

- **Role-based access control (RBAC):** `Student`, `Teacher`, `Admin` roles stored on the user model; simple role checks (e.g., admin-only endpoints) enforced via a `require_role()` dependency.
- **Resource-level (ownership) authorization:** Most authorization in Lumora is ownership-based rather than role-based — a user can only access their own resources, notes, flashcards, etc. This is enforced in the **service layer**, not just the repository layer, by always scoping repository queries with `user_id` and explicitly checking ownership before mutating/returning data.
- **Policy functions:** `app/core/permissions.py` centralizes reusable checks like `can_access_resource(user, resource)` and `can_modify_resource(user, resource)`, keeping authorization logic consistent and testable independent of any specific endpoint.
- **Future extensibility:** Design leaves room for shared/collaborative workspaces (Future Scope) by allowing a `SharedAccess` join table without restructuring the authorization layer.

---

## 11. Middleware

Registered centrally in `app/core/middleware.py` and wired in `main.py`:

- **CORS Middleware** — restricts allowed origins to the Next.js frontend domain(s).
- **Request Logging Middleware** — logs method, path, status code, latency, and a correlation/request ID for tracing.
- **Correlation ID Middleware** — generates/propagates a unique request ID (header `X-Request-ID`) attached to all logs for that request, useful for tracing across API → Celery task boundaries.
- **Rate Limiting Middleware** — Redis-backed sliding-window rate limiting per user/IP, especially important for AI-generation endpoints to control cost and abuse.
- **GZip Middleware** — compresses large JSON responses (e.g., long note/chat content).
- **Exception Handling Middleware** — catches unhandled exceptions and converts them into the standard error response shape (see Section 12) before they reach the client.

---

## 12. Validation

- **Pydantic v2 schemas** (`app/schemas/`) validate all request bodies, query params, and path params automatically via FastAPI's type-hinted signatures — invalid requests are rejected with a `422` before ever reaching a service.
- **Domain-specific validators:** Custom `@field_validator`s for things like file size limits, allowed MIME types, and URL format checks (YouTube/GitHub/website URL patterns).
- **Business-rule validation:** Validation that depends on DB state (e.g., "folder must belong to the same user", "cannot generate flashcards from a resource that hasn't finished processing") is performed in the **service layer**, since it requires repository access — this is intentionally not pushed into Pydantic schemas.
- **Output validation:** Response models (`response_model=...` on routers) ensure the API never leaks unintended fields (e.g., internal status flags, raw AI provider metadata).

---

## 13. Exception Handling

- **Custom exception hierarchy** in `app/core/exceptions.py`:
  ```python
  class LumoraException(Exception): ...
  class NotFoundException(LumoraException): ...
  class UnauthorizedException(LumoraException): ...
  class ForbiddenException(LumoraException): ...
  class ValidationException(LumoraException): ...
  class AIGenerationError(LumoraException): ...
  class IngestionError(LumoraException): ...
  ```
- **Global exception handlers** registered in `main.py` via `@app.exception_handler(...)` map each exception type to a consistent JSON error shape:
  ```json
  {
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "The requested resource could not be found.",
      "request_id": "a1b2c3d4"
    }
  }
  ```
- **Layer discipline:** Repositories raise low-level DB errors; services catch and translate them into domain exceptions (`NotFoundException`, etc.); routers never catch exceptions themselves — they let the global handler manage the response, keeping endpoint code clean.
- **Worker-side errors:** Celery tasks catch and log exceptions, update the resource/job status to `failed` with an error message, and re-raise (or let `autoretry_for` handle it) so failures are visible in monitoring rather than silently swallowed.

---

## 14. Logging

- **Structured logging (JSON)** via Python's `logging` module configured in `app/config/logging_config.py`, so logs are easily ingested by tools like CloudWatch, Datadog, or Grafana Loki.
- **Correlation IDs** attached to every log line for a given request (propagated into Celery task logs when a task is triggered from that request) to trace a single user action end-to-end across API and worker logs.
- **Log levels by environment:** `DEBUG` locally, `INFO` in staging, `WARNING`/`ERROR` focus in production, configurable via environment variable.
- **Sensitive data scrubbing:** Passwords, tokens, and API keys are never logged; a logging filter redacts known sensitive field names.
- **AI call logging:** Token usage, latency, and model used are logged (not full prompt/response content by default, to control log volume/cost and avoid storing sensitive study material in logs) for cost monitoring.

---

## 15. Configuration

- **`app/config/settings.py`** uses Pydantic `BaseSettings` to load and validate all configuration from environment variables at startup — the app fails fast if required config is missing.
- **Per-environment `.env` files** (`.env.development`, `.env.staging`, `.env.production`) loaded based on an `ENVIRONMENT` variable; `.env.example` checked into the repo as documentation of required variables (never real secrets).
- **Key configuration groups:**
  - Database: `DATABASE_URL`, pool size settings
  - Redis: `REDIS_URL`
  - JWT: `JWT_SECRET_KEY`, `JWT_ALGORITHM`, token expiry durations
  - OAuth: Google/GitHub client IDs and secrets
  - AI providers: `OPENAI_API_KEY`, `GEMINI_API_KEY`, default model names
  - Storage: S3 endpoint, bucket, access/secret keys
  - App: `ENVIRONMENT`, `CORS_ORIGINS`, `LOG_LEVEL`, rate-limit thresholds
- **Secrets management:** In production, secrets are injected via the deployment platform's secret manager (Railway/Render environment variables), never committed to source control.

---

## 16. Caching

Redis is used for multiple caching concerns, isolated via key namespacing:

- **AI response caching:** Deterministic generation requests (e.g., regenerating the same summary with identical input/prompt version) can be cached by a hash of `(resource_id, content_hash, prompt_version)` to avoid redundant API spend.
- **Session/rate-limit data:** Sliding-window counters per user for rate limiting AI-heavy endpoints.
- **Hot-read caching:** Frequently accessed, rarely changing data (e.g., a user's folder tree, resource list) cached with short TTLs and invalidated on write.
- **Celery result backend:** Redis also stores task results/status for short-lived polling needs, separate from the persistent status stored in PostgreSQL.
- **Cache access pattern:** All caching goes through `app/cache/redis_client.py`, wrapped by services (never called directly from routers), so cache invalidation stays co-located with the write operations that need to trigger it.

---

## 17. Database

- **PostgreSQL** as the system of record, with the **pgvector** extension enabled for embedding storage and similarity search.
- **SQLAlchemy (async)** ORM for models and queries; **Alembic** for versioned schema migrations, run automatically as part of the deployment pipeline.
- **Core tables (high-level):** `users`, `resources`, `folders`, `notes`, `flashcards`, `quizzes`, `quiz_attempts`, `chat_sessions`, `chat_messages`, `embeddings` (with a `vector` column), `progress`, `revision_schedules`.
- **Multi-tenant isolation:** Every user-owned table includes a `user_id` foreign key, and repository methods enforce filtering by `user_id` by default to prevent cross-tenant data leakage.
- **Indexing strategy:** B-tree indexes on foreign keys and frequently filtered columns (`user_id`, `resource_id`, `status`); an IVFFlat or HNSW index on the `embeddings.vector` column for efficient approximate nearest-neighbor search at scale.
- **Connection pooling:** Managed via SQLAlchemy's async engine pool, sized appropriately for the number of Uvicorn/Gunicorn workers to avoid exhausting Postgres connections.

---

## 18. Testing

- **Unit tests (`tests/unit/`):** Test services and repositories in isolation. Services are tested with repository/AI-client dependencies mocked (via `unittest.mock` or fixture-based fakes) so tests run fast with no real DB/network calls. Repositories are tested against a real (test) database to validate query correctness.
- **Integration tests (`tests/integration/`):** Spin up the FastAPI app with a test client (`httpx.AsyncClient`) against a dedicated test PostgreSQL database (migrated fresh per test run or per test via transactions/rollback). Cover full request→response flows including auth, validation, and error handling. Celery tasks are tested with `task_always_eager=True` or a test broker to validate task logic without requiring a running worker.
- **Test data factories (`tests/factories/`):** Use `factory_boy` (or similar) to generate realistic test entities (users, resources, notes) instead of hardcoded fixtures scattered across test files.
- **AI layer testing:** AI chains/clients are mocked in unit/integration tests to avoid real API calls, cost, and flakiness; a smaller set of **contract tests** (run less frequently, e.g., nightly) validate that prompts still produce structurally valid output (correct schema) against the real provider.
- **Coverage targets:** Prioritize coverage on services (business logic) and repositories (query correctness) over routers (thin by design) and schemas (validated by Pydantic itself).
- **CI enforcement:** Test suite (unit + integration) runs on every PR; migrations are validated by running them against a clean test DB as part of CI.

