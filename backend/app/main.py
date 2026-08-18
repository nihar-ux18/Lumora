from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import api_router
from app.config.logging import configure_logging
from app.config.settings import settings
from app.core.handlers import register_exception_handlers
from app.core.lifespan import lifespan
from app.core.logger import logger
from app.core.exceptions import ResourceNotFoundError
from app.api.oauth import router as oauth_router
from pathlib import Path


from fastapi.middleware.cors import CORSMiddleware

configure_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads",
)

# CORS configuration
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret_key,)

register_exception_handlers(app)
app.include_router(oauth_router)
app.include_router(api_router)

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")

    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.app_env,
        "status": "running",
    }
    
@app.get("/test-error")
async def test_error():
    raise ResourceNotFoundError("User not found")