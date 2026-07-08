from fastapi import FastAPI

from app.config.settings import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "environment": settings.app_env,
        "status": "running",
    }