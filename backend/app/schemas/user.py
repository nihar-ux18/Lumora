from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.models.user import Role

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id:UUID
    fullname: str
    email: EmailStr
    avatar_url: str | None
    role: Role
    is_verified: bool
    is_active: bool
    created_at: datetime
    
class UpdateProfileRequest(BaseModel):
    fullname: str | None = Field(default=None, min_length=2, max_length=255)
    avatar_url: str | None=Field(default=None, max_length=500)