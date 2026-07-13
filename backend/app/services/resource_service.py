from uuid import UUID
from fastapi import UploadFile

from app.core.exceptions import (
    ForbiddenError,
    ResourceNotFoundError,
)
from app.models.resource import Resource
from app.models.user import User
from app.repositories.resource_repository import ResourceRepository
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
)
from app.services.workspace_member_service import (
    WorkspaceMemberService,
)
from app.utils.file_upload import save_resource_file


class ResourceService:
    def __init__(
        self,
        repository: ResourceRepository,
        workspace_member_service: WorkspaceMemberService,
    ):
        self.repository = repository
        self.workspace_member_service = workspace_member_service

    async def create_resource(
        self,
        workspace_id: UUID,
        current_user: User,
        data: ResourceCreate,
    ) -> Resource:
        await self.workspace_member_service.require_member(
            workspace_id,
            current_user.id,
        )

        resource = Resource(
            workspace_id=workspace_id,
            uploaded_by=current_user.id,
            title=data.title,
            description=data.description,
            resource_type=data.resource_type,
            source_url=data.source_url,
            file_path=None,
        )

        return await self.repository.create(resource)

    async def list_resources(
        self,
        workspace_id: UUID,
        current_user: User,
    ) -> list[Resource]:
        await self.workspace_member_service.require_member(
            workspace_id,
            current_user.id,
        )

        return await self.repository.list_by_workspace(
            workspace_id,
        )

    async def get_resource(
        self,
        resource_id: UUID,
        current_user: User,
    ) -> Resource:
        resource = await self.repository.get_by_id(
            resource_id,
        )

        if resource is None:
            raise ResourceNotFoundError(
                "Resource not found."
            )

        await self.workspace_member_service.require_member(
            resource.workspace_id,
            current_user.id,
        )

        return resource

    async def update_resource(
        self,
        resource_id: UUID,
        current_user: User,
        data: ResourceUpdate,
    ) -> Resource:
        resource = await self.get_resource(
            resource_id,
            current_user,
        )

        update_data = data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(resource, key, value)

        return await self.repository.update(
            resource,
        )

    async def delete_resource(
        self,
        resource_id: UUID,
        current_user: User,
    ) -> None:
        resource = await self.get_resource(
            resource_id,
            current_user,
        )

        member = await self.workspace_member_service.member_repository.get_member(
            resource.workspace_id,
            current_user.id,
        )

        if member.role.value not in (
            "owner",
            "admin",
        ):
            raise ForbiddenError(
                "You don't have permission to delete resources."
            )

        await self.repository.delete(
            resource,
        )
        
    async def upload_resource_file(
        self,
        resource_id: UUID,
        current_user: User,
        file: UploadFile,
    ) -> Resource:
        resource = await self.get_resource(
            resource_id,
            current_user,
        )

        file_path = await save_resource_file(
            file,
        )

        resource.file_path = file_path

        return await self.repository.update(
            resource,
        )