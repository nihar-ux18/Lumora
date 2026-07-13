from uuid import UUID

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.base_model import BaseModel


class Workspace(Base, BaseModel):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    owner_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="workspaces",
    )
    
    members = relationship(
    "WorkspaceMember",
    back_populates="workspace",
    cascade="all, delete-orphan",
    )

    invitations = relationship(
        "WorkspaceInvitation",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )
    
    resources = relationship(
        "Resource",
        back_populates="workspace",
        cascade="all, delete-orphan",
    )