from fastapi import APIRouter, Depends, status, Query

from app.api.deps import get_auth_service
from app.api.deps import get_current_active_user
from app.api.deps import require_admin
from app.schemas.auth import (LoginRequest, RefreshTokenRequest, RegisterRequest, ResendVerificationRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest)
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
async def verify_email(token: str = Query(...),service: AuthService = Depends(get_auth_service),):
    await service.verify_email(token)

    return {
        "message": "Email verified successfully."
    }
    
@router.post("/resend-verification")
async def resend_verification(request: ResendVerificationRequest,service: AuthService = Depends(get_auth_service),):
    await service.resend_verification(
        request.email
    )

    return {
        "message": "Verification email sent."
    }
    
@router.post("/refresh",response_model=TokenResponse,)
async def refresh_token(request: RefreshTokenRequest,service: AuthService = Depends(get_auth_service),):
    return await service.refresh_token(
        request.refresh_token
    )
    
@router.get("/me",response_model=UserResponse,)
async def get_me(current_user=Depends(get_current_active_user),):
    return current_user

@router.get("/admin")
async def admin_dashboard(current_user=Depends(require_admin()),):
    return {"message": "Welcome Admin!","user": current_user.email,}

@router.post("/forgot-password", status_code=200)
async def forgot_password(data: ForgotPasswordRequest,service: AuthService = Depends(get_auth_service),):
    await service.forgot_password(data.email)
    return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }
    
@router.post("/reset-password", status_code=200)
async def reset_password(data: ResetPasswordRequest,service: AuthService = Depends(get_auth_service),):
    await service.reset_password(
        token=data.token,
        new_password=data.new_password,
    )
    return {
        "message": "Password reset successfully."
    }