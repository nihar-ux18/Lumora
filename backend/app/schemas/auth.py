from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    
class LoginRequest(BaseModel):
    email: EmailStr= Field(description="User email address",)
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
class ResendVerificationRequest(BaseModel):
    email: EmailStr