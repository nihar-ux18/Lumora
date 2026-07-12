from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UniqueConstraint

from app.db.base import Base
from app.db.base_model import BaseModel



class WorkspaceRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class WorkspaceMember(Base, BaseModel):
    __tablename__ = "workspace_members"
    
    __table_args__ = (
        UniqueConstraint(
            "workspace_id",
            "user_id",
            name="uq_workspace_member",
        ),
    )

    workspace_id: Mapped[UUID] = mapped_column(
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[WorkspaceRole] = mapped_column(
        SQLEnum(WorkspaceRole),
        default=WorkspaceRole.MEMBER,
        nullable=False,
    )

    workspace = relationship(
        "Workspace",
        back_populates="members",
    )

    user = relationship(
        "User",
        back_populates="workspace_memberships",
    )