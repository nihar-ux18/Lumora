from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api import api_router
from app.config.logging import configure_logging
from app.config.settings import settings
from app.core.handlers import register_exception_handlers
from app.core.lifespan import lifespan
from app.core.logger import logger
from app.core.middleware import RequestContextMiddleware 
from app.core.exceptions import ResourceNotFoundError
from app.api.oauth import router as oauth_router


configure_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
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