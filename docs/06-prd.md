# Product Requirements Document: Lumora

**Document Owner:** Product Team
**Status:** Draft v1.0
**Last Updated:** July 8, 2026

---

## 1. Vision

Lumora is an AI-powered learning workspace that transforms scattered learning materials — PDFs, YouTube videos, GitHub repositories, websites, markdown files, PPTs, and personal notes — into a single, structured, intelligent learning companion.

Instead of passively storing content, Lumora actively understands what a user is studying and helps them learn it faster: generating notes, summaries, flashcards, quizzes, and personalized roadmaps, while letting users converse directly with their own material through AI chat.

The long-term vision is for Lumora to become the default "second brain" for anyone learning anything — from a student cramming for exams to a professional upskilling on a new technology — by combining resource organization, retrieval-augmented AI, and adaptive learning science into one workspace.

---

## 2. Problem Statement

Learners today consume information from many disconnected sources: PDFs, lecture videos, blog posts, GitHub repos, and their own scattered notes across apps like Notion, Google Docs, and Notability. This creates three core problems:

1. **Fragmentation** — Learning material lives across many tools with no unified structure or search.
2. **Passive consumption** — Reading or watching content doesn't guarantee retention; learners rarely convert material into active-recall tools like flashcards or quizzes because it's time-consuming.
3. **No feedback loop** — Learners have no way to know what they've actually learned, what they're forgetting, or what to study next, so they either over-study familiar material or under-study weak areas.

Existing note-taking and knowledge-management tools (Notion, Obsidian, Evernote) are storage-first, not learning-first. Existing AI study tools (Quizlet, Anki) are flashcard-first and don't ingest raw source material intelligently. There is no tool that combines ingestion + understanding + active recall + progress tracking in one AI-native workspace.

---

## 3. Goals

- Enable users to upload/import any common learning resource type and have it automatically processed and organized.
- Automatically generate high-quality structured notes, summaries, flashcards, and quizzes from any resource using AI.
- Let users chat with their uploaded resources using RAG-based retrieval for accurate, source-grounded answers.
- Provide personalized learning roadmaps and revision plans based on a user's goals and progress.
- Track learning progress over time and surface what needs revision.
- Deliver a fast, reliable, production-grade experience that scales to thousands of concurrent users.

---

## 4. Non-Goals

- Lumora is **not** a live classroom / video-conferencing tool (no live teaching, webinars, or cohort-based courses in v1).
- Lumora is **not** a general-purpose note-taking or document editor replacement (no rich collaborative document editing like Notion/Google Docs in v1).
- Lumora will **not** build its own LLM; it will rely on third-party model providers (OpenAI/Gemini) via API.
- Lumora is **not** a plagiarism-detection or academic-integrity enforcement tool.
- Lumora will not support offline-first/local-only usage in v1 (requires internet connectivity).
- Lumora will not provide certification, grading, or accreditation services in v1.

---

## 5. Target Users

- **College Students** — need to convert lecture PDFs/slides into digestible notes and revise efficiently before exams.
- **Teachers/Educators** — need to prepare structured material, quizzes, and explanations quickly for their students.
- **Working Professionals** — need to upskill efficiently (e.g., learning a new framework from docs/GitHub repos) alongside a full-time job.
- **Competitive Exam Aspirants** — need structured revision plans, spaced repetition, and quiz practice across large syllabi.
- **Self Learners** — hobbyists and lifelong learners consuming YouTube videos, blogs, and books who want retention tools.

---

## 6. User Personas

### Persona 1: Aditi — The College Student
- **Age:** 20, final-year CS undergraduate
- **Goals:** Pass exams efficiently while working on side projects; convert professor's PDF slides into concise notes.
- **Pain Points:** Too many PDFs and no time to make flashcards manually; forgets material learned weeks ago.
- **Usage Pattern:** Uploads lecture PDFs weekly, generates flashcards before exams, uses AI chat to clarify doubts at 1 AM.

### Persona 2: Rohan — The Working Professional
- **Age:** 28, backend engineer learning distributed systems
- **Goals:** Learn from GitHub repos, official docs, and conference talks in the little free time he has.
- **Pain Points:** Learning is unstructured; no way to track what he's actually retained over months.
- **Usage Pattern:** Adds GitHub repos and YouTube tech talks, relies on repository analysis and roadmap features, revisits revision plans weekly.

### Persona 3: Meera — The Teacher
- **Age:** 34, high school science teacher
- **Goals:** Quickly generate quizzes and simplified explanations from her own lecture notes and textbooks.
- **Pain Points:** Manually writing quizzes for every chapter is time-consuming.
- **Usage Pattern:** Uploads textbook chapters, generates quizzes and concept explanations to share with students.

### Persona 4: Farah — The Competitive Exam Aspirant
- **Age:** 23, preparing for a government competitive exam
- **Goals:** Cover a massive syllabus systematically with strong retention and minimal wasted time.
- **Pain Points:** Syllabus is huge; hard to know what to revise and when; anxiety about forgetting topics.
- **Usage Pattern:** Heavy use of personalized roadmaps, spaced revision plans, and quizzes across hundreds of topics.

### Persona 5: Devraj — The Self Learner
- **Age:** 45, hobbyist learning history and philosophy from YouTube and books
- **Goals:** Retain and connect ideas across many long-form videos and articles over time.
- **Pain Points:** Consumes a lot of content passively; struggles to recall specifics months later.
- **Usage Pattern:** Adds YouTube videos and website articles, relies on summaries and AI chat rather than flashcards.

---

## 7. User Stories

**Resource Ingestion**
- As a user, I want to upload a PDF so that Lumora can automatically extract and organize its content.
- As a user, I want to paste a YouTube link so that the video's transcript is processed into notes and summaries.
- As a user, I want to connect a GitHub repository so that Lumora can analyze its structure and generate an explanation of the codebase.
- As a user, I want to paste a website URL so that its content is scraped and added to my workspace.
- As a user, I want to upload PPTs and markdown files so that all my existing material lives in one place.

**AI-Generated Content**
- As a user, I want AI-generated structured notes from my resource so that I don't have to manually summarize it.
- As a user, I want auto-generated flashcards so that I can practice active recall without manual effort.
- As a user, I want auto-generated quizzes so that I can test my understanding of a topic.
- As a user, I want concept explanations in simple language so that I can understand difficult topics faster.
- As a user, I want a repository analysis report so that I can quickly understand an unfamiliar codebase.

**AI Chat & RAG**
- As a user, I want to chat with my uploaded resources so that I can ask questions and get answers grounded in my own material.
- As a user, I want citations/source references in chat answers so that I can trust and verify the AI's response.

**Learning Roadmap & Revision**
- As a user, I want a personalized learning roadmap based on my goals so that I know what to study next.
- As a user, I want a revision plan based on spaced repetition so that I retain what I've learned long-term.
- As a user, I want to see my learning progress across topics so that I know my strengths and weaknesses.

**Account & Platform**
- As a user, I want to sign up/log in via Google or GitHub OAuth so that I can get started quickly.
- As a user, I want my resources organized into folders/collections so that I can navigate my workspace easily.
- As a user, I want to search across all my resources and generated content so that I can find anything quickly.

---

## 8. Functional Requirements

### 8.1 Authentication & User Management
- FR-1: Support JWT-based email/password authentication.
- FR-2: Support Google OAuth and GitHub OAuth login/signup.
- FR-3: Support user profile management (name, avatar, preferences).
- FR-4: Support role-based access (Student, Teacher, Admin) for future extensibility.

### 8.2 Resource Ingestion
- FR-5: Allow upload of PDF, PPT, and markdown files.
- FR-6: Allow ingestion of YouTube videos via URL (transcript extraction).
- FR-7: Allow ingestion of GitHub repositories via URL (code + README parsing).
- FR-8: Allow ingestion of arbitrary websites via URL (content scraping).
- FR-9: Allow manual note creation/upload as plain text.
- FR-10: Process ingested resources asynchronously via Celery background workers.
- FR-11: Show real-time ingestion/processing status to the user (queued, processing, completed, failed).
- FR-12: Chunk and embed processed content into pgvector for retrieval.

### 8.3 AI Content Generation
- FR-13: Generate structured notes from any processed resource.
- FR-14: Generate concise summaries from any processed resource.
- FR-15: Generate flashcards (question/answer pairs) from any processed resource.
- FR-16: Generate quizzes (MCQ, short answer, true/false) from any processed resource.
- FR-17: Generate plain-language concept explanations on demand.
- FR-18: Generate repository analysis reports (architecture overview, key files, tech stack, setup instructions) for GitHub imports.
- FR-19: Allow regeneration/refinement of any AI-generated content with user feedback.

### 8.4 AI Chat (RAG)
- FR-20: Allow users to chat with a single resource or across their entire workspace.
- FR-21: Ground chat responses in retrieved chunks using RAG; display source citations.
- FR-22: Maintain conversation history per resource/workspace.

### 8.5 Learning Roadmap & Progress
- FR-23: Generate a personalized learning roadmap based on user-defined goals and uploaded material.
- FR-24: Generate spaced-repetition-based revision plans/schedules.
- FR-25: Track quiz/flashcard performance to compute mastery levels per topic.
- FR-26: Display a progress dashboard showing completion and mastery across topics/resources.
- FR-27: Send reminders/notifications for scheduled revisions.

### 8.6 Organization & Search
- FR-28: Allow users to organize resources into folders/collections/subjects.
- FR-29: Provide full-text and semantic search across resources and generated content.
- FR-30: Support tagging of resources and generated content.

### 8.7 Platform
- FR-31: Provide a responsive web application (desktop + mobile browser).
- FR-32: Store files in S3-compatible object storage.
- FR-33: Provide export options (e.g., notes/flashcards as PDF or markdown).

---

## 9. Non-Functional Requirements

- **NFR-1 Performance:** P95 API response time < 500ms for non-AI endpoints; AI generation jobs should complete within 60s for typical documents (<50 pages) or clearly show async progress.
- **NFR-2 Scalability:** Backend must horizontally scale via containerized services (Docker) to support growth in concurrent users and background job volume.
- **NFR-3 Reliability:** 99.5% uptime target for core platform (auth, resource access, chat). Background job failures must be retried with exponential backoff and surfaced to users.
- **NFR-4 Security:** All data encrypted in transit (TLS) and at rest (S3, PostgreSQL). JWT tokens short-lived with refresh token rotation. OAuth tokens stored securely.
- **NFR-5 Data Privacy:** User-uploaded content must not be used to train third-party foundation models without explicit consent. Support account/data deletion (GDPR-style).
- **NFR-6 Multi-tenancy & Isolation:** Strict data isolation between user accounts; embeddings and vector search scoped per-user.
- **NFR-7 Observability:** Centralized logging, error tracking, and monitoring for API and Celery workers; alerting on job failure rate and queue backlog.
- **NFR-8 Cost Control:** Track and cap AI token usage per user/plan tier; implement caching to avoid redundant AI calls on identical content.
- **NFR-9 Accessibility:** Frontend should meet WCAG 2.1 AA standards where feasible.
- **NFR-10 Maintainability:** Backend follows clean architecture (FastAPI + SQLAlchemy + Alembic migrations); frontend follows component-driven design (shadcn/ui) with typed API contracts.

---

## 10. Feature List

| Feature | Description |
|---|---|
| Multi-format Resource Upload | PDF, PPT, markdown, notes, YouTube, GitHub, websites |
| Auto-organization | Folders, tags, auto-categorization by subject |
| Structured Notes Generation | AI-generated structured notes per resource |
| Summaries | Short and long-form summaries |
| Flashcards | Auto-generated, editable, spaced-repetition-ready |
| Quizzes | MCQ, short answer, true/false, auto-graded |
| Concept Explanations | On-demand simplified explanations |
| Repository Analysis | Codebase architecture & setup breakdown |
| AI Chat (RAG) | Chat with one resource or entire workspace, with citations |
| Learning Roadmap | Personalized study path generation |
| Revision Plans | Spaced repetition scheduling |
| Progress Tracking | Mastery dashboard per topic/resource |
| Search | Semantic + full-text search |
| Notifications | Revision reminders, processing status |
| Export | Notes/flashcards export to PDF/markdown |
| Auth | JWT, Google OAuth, GitHub OAuth |

---

## 11. MVP Scope

**Included in MVP:**
- Auth: JWT + Google OAuth
- Resource ingestion: PDF, YouTube, website URL (GitHub and PPT can follow shortly after)
- Async processing pipeline (Celery + Redis) with status indicators
- AI generation: Structured notes, summaries, flashcards, quizzes
- AI Chat (RAG) scoped to a single resource
- Basic folder-based organization
- Basic progress tracking (quiz/flashcard scores per resource)
- Responsive web app (Next.js)

**Excluded from MVP (see Future Scope):**
- GitHub repository analysis
- PPT ingestion
- GitHub OAuth
- Personalized roadmap generation
- Spaced-repetition revision engine
- Workspace-wide (cross-resource) chat
- Export functionality
- Notifications/reminders

---

## 12. Future Scope

- GitHub repository ingestion and repository analysis reports
- PPT and additional file format support (DOCX, EPUB)
- GitHub OAuth login
- Full personalized learning roadmap engine
- Spaced-repetition revision scheduling with notifications
- Workspace-wide AI chat across all resources
- Collaborative workspaces (shared folders for study groups/classrooms)
- Mobile native apps (iOS/Android)
- Offline mode
- Export to PDF/Markdown/Anki
- Teacher-specific tools (assignment creation, class analytics)
- Gamification (streaks, badges, leaderboards)
- Voice-based interaction with resources
- Browser extension for one-click resource capture

---

## 13. Success Metrics

- **Activation:** % of new users who upload at least one resource and generate at least one AI artifact (notes/flashcards/quiz) within first session.
- **Engagement:** Weekly Active Users (WAU) / Monthly Active Users (MAU) ratio.
- **Retention:** Week-4 retention rate of new signups.
- **Content Generation Volume:** Average number of AI-generated artifacts (notes, flashcards, quizzes) per active user per week.
- **Chat Usage:** Average number of RAG chat queries per active user per week.
- **Learning Outcome Proxy:** Improvement in quiz scores over repeated attempts on the same topic (mastery growth).
- **Processing Reliability:** % of ingestion jobs completed successfully without manual retry.
- **Latency:** P95 time from upload to first generated artifact available.
- **Revenue (post-monetization):** Conversion rate from free to paid tier.

---

## 14. Competitor Analysis

| Competitor | Strength | Weakness (relative to Lumora) |
|---|---|---|
| **Notion AI / Notion** | Strong organization & collaboration | Not learning-science focused; no auto flashcards/quizzes/RAG chat grounded in sources |
| **Anki** | Best-in-class spaced repetition | No AI content generation, no resource ingestion (PDF/video/repo), manual card creation |
| **Quizlet** | Popular flashcard/quiz platform, large content library | No RAG chat, limited ingestion of diverse formats (no GitHub, limited PDF/video parsing) |
| **NotebookLM (Google)** | Strong RAG chat and source grounding | No flashcards/quizzes/roadmaps/spaced repetition; not positioned as a full learning workspace |
| **Obsidian** | Powerful personal knowledge graph, plugin ecosystem | No native AI generation or ingestion pipeline; requires heavy manual setup |
| **Coursera/Udemy** | Structured courses with credentials | Not built around user's own material; no personalization to arbitrary uploaded content |

**Lumora's Differentiation:** Combines multi-format ingestion + RAG-grounded chat + auto-generated active-recall tools (flashcards/quizzes) + progress-aware personalized roadmaps in a single AI-native workspace — a category no single competitor fully covers.

---

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| AI generation quality inconsistent (hallucinations, poor summaries) | High | Use RAG grounding, citation display, allow user feedback/regeneration, human-in-the-loop editing |
| High AI/API costs at scale | High | Token usage caps per tier, caching, prompt optimization, model tiering (cheaper model for simple tasks) |
| Long processing times for large PDFs/videos hurting UX | Medium | Async processing with clear status, chunked/streaming generation, background workers with autoscaling |
| Copyright/IP issues with ingested YouTube/website content | Medium | Clear ToS on personal-use only, no redistribution features, respect robots.txt/YouTube ToS |
| Data privacy concerns (sensitive study material) | High | Encryption at rest/in transit, per-user data isolation, clear privacy policy, deletion support |
| Vendor lock-in / API pricing changes (OpenAI/Gemini) | Medium | Abstract AI provider behind LangChain interface to allow model swapping |
| Low user retention if learning outcomes aren't felt | High | Invest early in progress tracking and revision plans to demonstrate tangible learning gains |
| Scaling background job infrastructure (Celery/Redis) under load | Medium | Queue monitoring, autoscaling workers, dead-letter queues, retries with backoff |

---

## 16. Assumptions

- Users have reliable internet access; offline usage is not required for MVP.
- Third-party AI APIs (OpenAI/Gemini) remain available and reasonably priced.
- Users are comfortable uploading their study material to a cloud platform.
- Most learning resources (PDFs, videos, repos) are in English initially; multilingual support may follow.
- YouTube transcripts are accessible via API/existing captions for most target videos.
- Users are willing to adopt a new tool alongside or in place of existing note-taking apps.
- A freemium pricing model will be viable to drive adoption before monetization.

---

## 17. Open Questions

- What pricing/plan tiers will Lumora offer (free tier limits, pro tier pricing)?
- Which AI provider will be primary vs. fallback — OpenAI, Gemini, or a router between both?
- Should workspace-wide RAG chat be part of MVP or deferred, given complexity of cross-resource retrieval?
- How will Lumora handle very large resources (e.g., 500-page PDFs, multi-hour video courses) within processing time/cost constraints?
- What is the data retention policy for deleted resources and their embeddings?
- Will there be a collaborative/team plan for classrooms in the near term, or purely single-user in year one?
- How should mastery/progress scoring be calculated — quiz accuracy only, or weighted with flashcard recall and time-based decay (forgetting curve)?
- Do we need content moderation for uploaded material (e.g., copyrighted textbooks, inappropriate content)?

---

## 18. Milestones

| Milestone | Scope | Target Timeline |
|---|---|---|
| **M1: Foundation** | Auth (JWT + Google OAuth), project scaffolding (Next.js + FastAPI), DB schema, S3 storage setup | Weeks 1–3 |
| **M2: Ingestion Pipeline** | PDF, YouTube, website ingestion; Celery workers; embedding pipeline (pgvector) | Weeks 4–6 |
| **M3: AI Generation Core** | Structured notes, summaries, flashcards, quizzes generation | Weeks 7–9 |
| **M4: RAG Chat** | Single-resource AI chat with citations | Weeks 10–11 |
| **M5: Organization & Progress** | Folders, basic search, quiz/flashcard progress tracking | Weeks 12–13 |
| **M6: MVP Launch (Private Beta)** | End-to-end MVP scope live for a limited user group | Week 14 |
| **M7: GitHub & PPT Ingestion** | Repository analysis, PPT parsing, GitHub OAuth | Weeks 15–18 |
| **M8: Roadmap & Revision Engine** | Personalized roadmaps, spaced-repetition revision plans, notifications | Weeks 19–23 |
| **M9: Public Launch** | Workspace-wide chat, export features, polished onboarding, monetization | Week 24+ |

