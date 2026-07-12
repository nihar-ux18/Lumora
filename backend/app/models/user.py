from datetime import datetime
from enum import Enum
from app.models.workspace import Workspace
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.db.base_model import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.email_verification import EmailVerificationToken

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"
    
class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"
    
class User(Base, BaseModel):
    __tablename__ = "users"
    fullname: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    provider: Mapped[AuthProvider] = mapped_column(
        SQLEnum(AuthProvider),
        default=AuthProvider.LOCAL,
        nullable=False,
    )
    role: Mapped[Role] = mapped_column(
        SQLEnum(Role),
        default=Role.USER,
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
    verification_tokens: Mapped[list["EmailVerificationToken"]] = relationship(
    back_populates="user",
    cascade="all, delete-orphan",
    )
    workspaces: Mapped[list["Workspace"]] = relationship("Workspace",back_populates="owner",cascade="all, delete-orphan",)
    
    workspaces = relationship(
    "Workspace",
    back_populates="owner",
    )
    
    workspace_memberships = relationship(
        "WorkspaceMember",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    