from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health():
    return {
        "status": "healthy",
    }


@router.get("/ready")
async def readiness():
    return {
        "status": "ready",
    }