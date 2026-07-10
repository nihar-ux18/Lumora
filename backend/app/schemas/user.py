from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
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