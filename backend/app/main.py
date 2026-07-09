from fastapi import FastAPI

from app.api.health import router as health_router
from app.config.logging import configure_logging
from app.config.settings import settings
from app.core.lifespan import lifespan
from app.core.logger import logger

configure_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.include_router(health_router)


@app.get("/")
async def root():
    logger.info("Root endpoint accessed")

    return {
        "app": settings.app_name,
        "environment": settings.app_env,
        "status": "running",
        "version": settings.app_version,
    }