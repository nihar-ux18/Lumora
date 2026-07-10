from fastapi import APIRouter, Depends, status, Query

from app.api.deps import get_auth_service
from app.schemas.auth import (LoginRequest, RegisterRequest, ResendVerificationRequest, TokenResponse)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED,)
async def register(data: RegisterRequest, service: AuthService=Depends(get_auth_service)):
    return await service.register(data)

@router.post("/login", response_model=TokenResponse,)
async def login(data: LoginRequest, service: AuthService=Depends(get_auth_service)):
    return await service.login(data)

@router.get("/verify-email")
async def verify_email(
    token: str = Query(...),
    service: AuthService = Depends(get_auth_service),
):
    await service.verify_email(token)

    return {
        "message": "Email verified successfully."
    }
    
@router.post("/resend-verification")
async def resend_verification(
    request: ResendVerificationRequest,
    service: AuthService = Depends(get_auth_service),
):
    await service.resend_verification(
        request.email
    )

    return {
        "message": "Verification email sent."
    }