from fastapi import APIRouter, Depends, status

from app.api.deps import get_auth_service
from app.schemas.auth import (LoginRequest, RegisterRequest, TokenResponse)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED,)
async def register(data: RegisterRequest, service: AuthService=Depends(get_auth_service)):
    return await service.register(data)

@router.post("/login", response_model=TokenResponse,)
async def login(data: LoginRequest, service: AuthService=Depends(get_auth_service)):
    return await service.login(data)