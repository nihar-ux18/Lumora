# Lumora — Database Design

**Primary store:** PostgreSQL 16+ with `pgvector` extension
**ORM/migrations:** SQLAlchemy 2.0 (async) + Alembic

---

## 1. Design Goals

- Strict **multi-tenancy** at the row level (`user_id` / `workspace_id` on every user-owned table).
- Support **polymorphic resource types** (PDF, YouTube, GitHub repo, website, PPT, markdown, note)
  without a sprawl of near-duplicate tables.
- Make **derived AI content** (notes, flashcards, quizzes, roadmaps) versionable and
  cache-addressable, so regeneration is explicit and cheap to skip when unnecessary.
- Keep **vector search co-located** with relational data (pgvector) rather than standing up a
  separate vector database — justified at this scale, revisited in §6.
- Design indexes and partitioning **before** they're needed, not after a production incident.

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ RESOURCES : owns
    USERS ||--o{ CHAT_SESSIONS : starts
    USERS ||--o{ ROADMAPS : has
    USERS ||--|| SUBSCRIPTIONS : has
    USERS ||--o{ OAUTH_ACCOUNTS : links

    RESOURCES ||--o{ RESOURCE_CHUNKS : "split into"
    RESOURCE_CHUNKS ||--|| CHUNK_EMBEDDINGS : embeds
    RESOURCES ||--o{ NOTES : generates
    RESOURCES ||--o{ FLASHCARDS : generates
    RESOURCES ||--o{ QUIZZES : generates
    RESOURCES ||--o{ INGESTION_JOBS : "tracked by"

    QUIZZES ||--o{ QUIZ_QUESTIONS : contains
    QUIZ_QUESTIONS ||--o{ QUIZ_ATTEMPT_ANSWERS : answered_in

    USERS ||--o{ QUIZ_ATTEMPTS : takes
    QUIZ_ATTEMPTS ||--o{ QUIZ_ATTEMPT_ANSWERS : records

    ROADMAPS ||--o{ ROADMAP_NODES : contains
    ROADMAP_NODES }o--o{ RESOURCES : references

    USERS ||--o{ REVISION_PLANS : has
    REVISION_PLANS ||--o{ REVISION_ITEMS : schedules
    REVISION_ITEMS }o--|| FLASHCARDS : "spaced-repeats"

    CHAT_SESSIONS ||--o{ CHAT_MESSAGES : contains
    CHAT_SESSIONS }o--o{ RESOURCES : "scoped to"

    USERS ||--o{ USAGE_LEDGER : consumes

    USERS {
        uuid id PK
        text email
        text hashed_password
        text display_name
        text plan_tier
        timestamptz created_at
    }
    RESOURCES {
        uuid id PK
        uuid user_id FK
        text source_type
        text title
        text status
        text s3_key
        text source_url
        jsonb metadata
        timestamptz created_at
    }
    RESOURCE_CHUNKS {
        uuid id PK
        uuid resource_id FK
        int chunk_index
        text content
        jsonb structural_metadata
        text content_hash
    }
    CHUNK_EMBEDDINGS {
        uuid chunk_id PK_FK
        vector embedding
        text embedding_model
        int dims
    }
    NOTES {
        uuid id PK
        uuid resource_id FK
        text content_hash
        text prompt_version
        text model_version
        jsonb content
        timestamptz created_at
    }
    QUIZZES {
        uuid id PK
        uuid resource_id FK
        text difficulty
        jsonb generation_meta
    }
    ROADMAPS {
        uuid id PK
        uuid user_id FK
        text goal
        text status
    }
    REVISION_ITEMS {
        uuid id PK
        uuid revision_plan_id FK
        uuid flashcard_id FK
        float ease_factor
        int interval_days
        timestamptz next_review_at
    }
    USAGE_LEDGER {
        uuid id PK
        uuid user_id FK
        text operation_type
        int tokens_used
        numeric cost_usd
        timestamptz created_at
    }
```

---

## 3. Table-by-Table Notes

### 3.1 `resources` — polymorphic source table
Rather than separate tables per source type (`pdfs`, `youtube_videos`, `repos`...), `resources`
uses a `source_type` discriminator + a `jsonb metadata` column holding type-specific fields
(e.g., `{ "video_id": "...", "duration_s": 3600 }` for YouTube, `{ "repo_full_name": "...",
"default_branch": "main" }` for GitHub).

**Why jsonb over per-type tables:**

| | jsonb polymorphic (chosen) | Per-type tables |
|---|---|---|
| Schema churn when adding a new source type | Zero migrations | New table + join logic each time |
| Query ergonomics for type-specific fields | Needs `->>'field'` extraction, GIN index | Native SQL, faster ad-hoc queries |
| Cross-type queries ("all my resources") | Single table scan | UNION across tables |

Given the product will keep adding source types (Notion pages, podcasts, lecture recordings are
plausible next additions), the jsonb approach avoids a migration per new integration. A GIN index
on `metadata` covers the type-specific filters that do get queried often (e.g., `source_type` +
specific metadata key lookups).

### 3.2 `resource_chunks` — the unit of retrieval
Every ingested resource, regardless of type, is normalized into chunks with:
- `content` — the text itself (chunking strategy varies by source type; see `03-ai-rag-pipeline.md`)
- `structural_metadata` — page number, timestamp range (video), file path + line range (repo),
  heading path (markdown/PPT) — used for citations back to the source
- `content_hash` — SHA-256 of normalized content, used to detect unchanged chunks on re-ingestion
  (e.g., a GitHub repo re-synced after a push) so embeddings aren't regenerated needlessly.

### 3.3 `chunk_embeddings` — pgvector storage
```
embedding vector(1536)   -- dimension depends on embedding model, see below
```
- One row per chunk (1:1), not a separate embeddings table with multiple model versions
  initially — see §6 for the multi-model-version tradeoff.
- Indexed with **HNSW** (`pgvector` ≥ 0.5.0), not IVFFlat — see §5.

### 3.4 Derived content tables (`notes`, `flashcards`, `quizzes`, `roadmaps`, `revision_plans`)
Each carries:
- `content_hash` — hash of the source chunks that produced this artifact
- `prompt_version` — which prompt template generated it
- `model_version` — which LLM/version generated it

This triple lets the system answer "is this note stale?" without regenerating on every read:
if source content, prompt, and model versions are unchanged, the cached artifact is served as-is.
Changing any of the three invalidates the cache and queues regeneration.

### 3.5 `usage_ledger` — AI cost metering
Every AI-consuming operation (embedding call, generation call, chat completion) writes a row here.
This is the source of truth for:
- Enforcing plan quotas (e.g., "50 AI generations/month on Free tier")
- Internal cost dashboards
- Billing reconciliation if usage-based pricing is introduced later

---

## 4. Multi-Tenancy Strategy

**Chosen: shared database, shared schema, row-level `user_id`/`workspace_id` scoping**, enforced
at the ORM query-builder layer (a base repository class that always injects the tenant filter).

| Approach | Isolation | Ops overhead | Chosen? |
|---|---|---|---|
| Schema-per-tenant | Strong | High (migrations run N times) | No |
| Database-per-tenant | Strongest | Very high, doesn't scale past low hundreds of tenants | No |
| Shared schema + row filtering (chosen) | Adequate with discipline | Low | **Yes** |

Row-level isolation is enforced in two layers for defense-in-depth:
1. **Application layer:** every repository method requires a `tenant_id` and injects it into the
   `WHERE` clause — there is no code path that queries without it.
2. **Database layer:** PostgreSQL **Row-Level Security (RLS)** policies on all tenant-owned
   tables, keyed to a `current_setting('app.current_user_id')` set per-connection. This protects
   against an application-layer bug leaking cross-tenant data.

This becomes relevant if Lumora later sells to institutions (schools, bootcamps) needing
workspace-level isolation — `workspace_id` is already modeled alongside `user_id` for that path.

---

## 5. Indexing Strategy

| Table | Index | Purpose |
|---|---|---|
| `resources` | B-tree `(user_id, created_at DESC)` | "My recent resources" list view |
| `resources` | GIN `(metadata)` | Type-specific metadata filters |
| `resource_chunks` | B-tree `(resource_id, chunk_index)` | Ordered chunk retrieval |
| `chunk_embeddings` | **HNSW** `(embedding vector_cosine_ops)` | Approximate nearest-neighbor search |
| `notes`/`flashcards`/`quizzes` | B-tree `(resource_id, content_hash)` unique | Cache-hit lookup |
| `chat_messages` | B-tree `(session_id, created_at)` | Ordered conversation replay |
| `usage_ledger` | B-tree `(user_id, created_at)`, partitioned monthly (see below) | Quota checks + billing rollups |

**HNSW vs IVFFlat for pgvector:**

| | HNSW (chosen) | IVFFlat |
|---|---|---|
| Query recall/speed | Higher recall at same latency | Requires tuning `lists`/`probes`, more fragile |
| Build time | Slower to build | Faster to build |
| Behavior on growing data | Degrades gracefully | Needs periodic re-clustering as data grows |
| Cost | Higher memory footprint | Lower |

Since chunk volume grows continuously (users keep uploading) and recall quality directly affects
perceived chat/RAG quality, HNSW's better query-time recall outweighs its higher build/memory
cost at our scale (single-digit millions of chunks, not billions).

---

## 6. Partitioning & Data Lifecycle

- **`usage_ledger`** and **`chat_messages`** are partitioned **by month** (declarative range
  partitioning). These are the highest-write-volume, append-mostly tables. Old partitions can be
  rolled off to cheaper storage or archived after a retention window (e.g., 18 months) without
  touching hot data.
- **`resource_chunks` / `chunk_embeddings`** are *not* partitioned initially — partitioning
  vector indexes adds complexity (HNSW indexes are built per-partition) and current scale
  (single-digit millions of rows) doesn't need it. Revisit if a single tenant's chunk volume
  becomes an outlier (e.g., a professor ingesting an entire course's worth of PDFs).

---

## 7. Open Tradeoff: pgvector vs. Dedicated Vector DB (Pinecone/Weaviate/Qdrant)

| | pgvector (chosen) | Dedicated vector DB |
|---|---|---|
| Operational surface | One database to run/back up/monitor | Second system to operate, sync, monitor |
| Transactional consistency | Embeddings and metadata committed atomically | Eventual consistency between stores |
| Query flexibility | Full SQL — combine vector search with relational filters (user_id, date range, source_type) in one query | Usually requires metadata filtering support, sometimes limited |
| Scale ceiling | Very good to tens of millions of vectors with HNSW | Better suited past that, with more mature sharding |
| Cost at our scale | Included in existing Postgres instance | Additional managed-service bill |

**Decision:** pgvector is the right choice through at least the 100k-user milestone. The
re-evaluation trigger is documented in `05-scalability-deployment.md` §6 (vector volume exceeding
~50M chunks or query latency degrading past acceptable p95).
