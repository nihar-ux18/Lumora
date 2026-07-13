from uuid import UUID

from app.core.exceptions import ResourceNotFoundError
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_member import (WorkspaceMember,WorkspaceRole,)
from app.repositories.workspace_member_repository import (WorkspaceMemberRepository,)
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
)


class WorkspaceService:
    def __init__(
        self,
        repository: WorkspaceRepository,
        member_repository: WorkspaceMemberRepository,
    ):
        self.repository = repository
        self.member_repository = member_repository

    async def create_workspace(
        self,
        owner: User,
        data: WorkspaceCreate,
    ) -> Workspace:
        workspace = Workspace(
            name=data.name,
            description=data.description,
            owner_id=owner.id,
        )
        
        workspace = await self.repository.create(workspace)
        
        owner_member = WorkspaceMember(
        workspace_id=workspace.id,user_id=owner.id,role=WorkspaceRole.OWNER,)
        
        await self.member_repository.create(owner_member)

        return workspace

    async def list_workspaces(
        self,
        owner: User,
    ) -> list[Workspace]:
        return await self.repository.get_all_by_owner(
            owner.id,
        )

    async def get_workspace(
        self,
        owner: User,
        workspace_id: UUID,
    ) -> Workspace:
        workspace = await self.repository.get_by_id(
            workspace_id,
        )

        if (
            workspace is None
            or workspace.owner_id != owner.id
        ):
            raise ResourceNotFoundError(
                "Workspace not found."
            )

        return workspace

    async def update_workspace(
        self,
        owner: User,
        workspace_id: UUID,
        data: WorkspaceUpdate,
    ) -> Workspace:
        workspace = await self.get_workspace(
            owner,
            workspace_id,
        )

        update_data = data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(workspace, key, value)

        return await self.repository.update(workspace)

    async def delete_workspace(
        self,
        owner: User,
        workspace_id: UUID,
    ) -> None:
        workspace = await self.get_workspace(
            owner,
            workspace_id,
        )

        await self.repository.delete(workspace)