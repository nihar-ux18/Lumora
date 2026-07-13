from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SqlEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.base_model import BaseModel


class ResourceType(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    IMAGE = "image"
    URL = "url"
    NOTE = "note"


class Resource(Base, BaseModel):
    __tablename__ = "resources"

    workspace_id: Mapped[UUID] = mapped_column(
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    uploaded_by: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    resource_type: Mapped[ResourceType] = mapped_column(
        SqlEnum(ResourceType,values_callable=lambda enum: [e.value for e in enum],),
        nullable=False,
    )

    file_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    source_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    workspace = relationship(
        "Workspace",
        back_populates="resources",
    )

    uploader = relationship(
        "User",
        back_populates="resources",
    )