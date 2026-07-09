from datetime import datetime
from enum import Enum
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.db.base_model import BaseModel

class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GUTHUB = "github"
    
class User(Base, BaseModel):
    __tableaname__ = "users"
    fullname: Mapped[str] = mapped_column(
        String(225),
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(225),
        unique=True,
        index=True,
        nullable=False
    )
    password_hash: Mapped[str | None] = mapped_column(
        String(225),
        nullable=True
    )
    avtar_url: Mapped[str |None] = mapped_column(
        String(500),
        nullable=true
    )
    provider: Mapped[AuthProvider] = mapped_column(
        SQLEnum(AuthProvider),
        default=AuthProvider.LOCAL,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    