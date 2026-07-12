from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class InviteMemberRequest(BaseModel):
    email: EmailStr


class WorkspaceInvitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workspace_id: UUID
    email: EmailStr
    accepted: bool
    expires_at: datetime
    created_at: datetime