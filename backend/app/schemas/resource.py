from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.resource import ResourceType


class ResourceCreate(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    resource_type: ResourceType

    source_url: str | None = Field(
        default=None,
        max_length=1000,
    )


class ResourceUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    source_url: str | None = Field(
        default=None,
        max_length=1000,
    )


class ResourceResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    workspace_id: UUID
    uploaded_by: UUID

    title: str
    description: str | None

    resource_type: ResourceType

    file_path: str | None
    source_url: str | None

    created_at: datetime
    updated_at: datetime