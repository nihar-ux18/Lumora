from fastapi import FastAPI
from app.core.logger import logge
from app.api.health import router as health_routerr

from app.config.settings import settings
from app.config.logging import configure_logging

configure_logging()
app.include_router(health_router)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


@app.get("/")
async def root():
    logger.info("Root endpoint accessed")

    return {
        "app": settings.app_name,
        "environment": settings.app_env,
        "status": "running",
    }