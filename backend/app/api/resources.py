from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_current_user,
    get_resource_service,
)
from app.models.user import User
from app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
    ResourceUpdate,
)
from app.services.resource_service import ResourceService

router = APIRouter(
    tags=["Resources"],
)


@router.post(
    "/workspaces/{workspace_id}/resources",
    response_model=ResourceResponse,
)
async def create_resource(
    workspace_id: UUID,
    data: ResourceCreate,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.create_resource(
        workspace_id=workspace_id,
        current_user=current_user,
        data=data,
    )


@router.get(
    "/workspaces/{workspace_id}/resources",
    response_model=list[ResourceResponse],
)
async def list_resources(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.list_resources(
        workspace_id=workspace_id,
        current_user=current_user,
    )


@router.get(
    "/resources/{resource_id}",
    response_model=ResourceResponse,
)
async def get_resource(
    resource_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.get_resource(
        resource_id=resource_id,
        current_user=current_user,
    )


@router.patch(
    "/resources/{resource_id}",
    response_model=ResourceResponse,
)
async def update_resource(
    resource_id: UUID,
    data: ResourceUpdate,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.update_resource(
        resource_id=resource_id,
        current_user=current_user,
        data=data,
    )


@router.delete(
    "/resources/{resource_id}",
)
async def delete_resource(
    resource_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    await service.delete_resource(
        resource_id=resource_id,
        current_user=current_user,
    )

    return {
        "message": "Resource deleted successfully."
    }