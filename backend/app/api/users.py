from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import (get_auth_service,get_current_active_user,)
from app.models.user import User
from app.schemas.user import (UpdateProfileRequest,UserResponse,)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/users",tags=["Users"],)


@router.get("/me",response_model=UserResponse,)
async def get_me(current_user: User = Depends(get_current_active_user),):
    return current_user


@router.patch("/me",response_model=UserResponse,)
async def update_me(data: UpdateProfileRequest,current_user: User = Depends(get_current_active_user),service: AuthService = Depends(get_auth_service),):
    return await service.update_profile(
        current_user,
        data,
    )
    
@router.post("/me/avatar",response_model=UserResponse,)
async def upload_avatar(file: UploadFile = File(...),current_user=Depends(get_current_active_user),service: AuthService = Depends(get_auth_service),):
    return await service.upload_avatar(
        current_user,
        file,
    )