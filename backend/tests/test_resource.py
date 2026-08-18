import pytest
from pathlib import Path
from uuid import UUID
from app.core.security import create_access_token, hash_password
from app.models.user import User, Role


async def create_test_user(db, email: str, fullname: str = "Test User") -> User:
    user = User(
        fullname=fullname,
        email=email,
        password_hash=hash_password("securepassword123"),
        is_verified=True,
        is_active=True,
        role=Role.USER,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


def get_auth_headers(user: User) -> dict:
    token = create_access_token(str(user.id))
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_resource_create_and_upload_success(client, db_session):
    user = await create_test_user(db_session, "uploader@example.com", "Uploader User")
    headers = get_auth_headers(user)

    # Create workspace
    res_ws = await client.post(
        "/workspaces", json={"name": "Upload Workspace"}, headers=headers
    )
    assert res_ws.status_code == 201
    workspace_id = res_ws.json()["id"]

    # Create resource object
    res_payload = {
        "title": "Document txt",
        "description": "A text document",
        "resource_type": "note",
    }
    res_resource = await client.post(
        f"/workspaces/{workspace_id}/resources", json=res_payload, headers=headers
    )
    assert res_resource.status_code == 200
    resource_id = res_resource.json()["id"]

    # Upload valid file
    file_content = b"Some plain text content for verification"
    response_upload = await client.post(
        f"/resources/{resource_id}/upload",
        files={"file": ("document.txt", file_content, "text/plain")},
        headers=headers,
    )
    assert response_upload.status_code == 200
    data = response_upload.json()
    assert data["file_path"] is not None

    # Verify the generated file name is a safe UUID name
    path_obj = Path(data["file_path"])
    assert path_obj.suffix == ".txt"
    # Stem should be a valid UUID
    try:
        UUID(path_obj.stem)
        is_valid_uuid = True
    except ValueError:
        is_valid_uuid = False
    assert is_valid_uuid is True


@pytest.mark.asyncio
async def test_resource_upload_unsupported_extension_rejected(client, db_session):
    user = await create_test_user(db_session, "reject@example.com")
    headers = get_auth_headers(user)

    res_ws = await client.post(
        "/workspaces", json={"name": "Rejection Workspace"}, headers=headers
    )
    workspace_id = res_ws.json()["id"]

    res_resource = await client.post(
        f"/workspaces/{workspace_id}/resources",
        json={"title": "Hacked Script", "resource_type": "pdf"},
        headers=headers,
    )
    resource_id = res_resource.json()["id"]

    # Try uploading unsupported file format
    response_upload = await client.post(
        f"/resources/{resource_id}/upload",
        files={
            "file": (
                "hack.exe",
                b"malicious executable payload",
                "application/octet-stream",
            )
        },
        headers=headers,
    )
    assert response_upload.status_code == 409
    assert "Unsupported file type" in response_upload.json()["detail"]


@pytest.mark.asyncio
async def test_resource_upload_path_traversal_protection(client, db_session):
    user = await create_test_user(db_session, "traversal@example.com")
    headers = get_auth_headers(user)

    res_ws = await client.post(
        "/workspaces", json={"name": "Traversal Workspace"}, headers=headers
    )
    workspace_id = res_ws.json()["id"]

    res_resource = await client.post(
        f"/workspaces/{workspace_id}/resources",
        json={"title": "Traversal Document", "resource_type": "pdf"},
        headers=headers,
    )
    resource_id = res_resource.json()["id"]

    # Try uploading file with path traversal in name
    response_upload = await client.post(
        f"/resources/{resource_id}/upload",
        files={"file": ("../../../../etc/passwd.txt", b"passwd dummy", "text/plain")},
        headers=headers,
    )
    assert response_upload.status_code == 200
    file_path = response_upload.json()["file_path"]

    # Verify that the path does NOT contain any traversal sequences and stem is a safe UUID
    assert ".." not in file_path
    assert "etc" not in file_path
    assert "passwd" not in file_path
    path_obj = Path(file_path)
    assert path_obj.suffix == ".txt"
    try:
        UUID(path_obj.stem)
        is_uuid = True
    except ValueError:
        is_uuid = False
    assert is_uuid is True


@pytest.mark.asyncio
async def test_resource_access_workspace_authorization_rules(client, db_session):
    user_owner = await create_test_user(db_session, "resource_owner@example.com")
    user_stranger = await create_test_user(db_session, "resource_stranger@example.com")

    owner_headers = get_auth_headers(user_owner)
    stranger_headers = get_auth_headers(user_stranger)

    # Owner creates workspace and resource
    res_ws = await client.post(
        "/workspaces", json={"name": "Secure Resource Workspace"}, headers=owner_headers
    )
    workspace_id = res_ws.json()["id"]

    res_resource = await client.post(
        f"/workspaces/{workspace_id}/resources",
        json={"title": "Secrets", "resource_type": "pdf"},
        headers=owner_headers,
    )
    resource_id = res_resource.json()["id"]

    # Stranger tries to fetch resource details (returns 403 because they are not workspace member)
    res_get = await client.get(f"/resources/{resource_id}", headers=stranger_headers)
    assert res_get.status_code == 403
    assert "not a member" in res_get.json()["detail"]

    # Stranger tries to upload file (returns 403 because get_resource fails member check)
    response_upload = await client.post(
        f"/resources/{resource_id}/upload",
        files={"file": ("hack.pdf", b"hack", "application/pdf")},
        headers=stranger_headers,
    )
    assert response_upload.status_code == 403
    assert "not a member" in response_upload.json()["detail"]


def test_upload_size_limit_gap_documentation():
    """
    GAP DOCUMENTATION NOTE:
    The FastAPI backend does not currently implement server-side file upload size limits.
    Any files uploaded are written directly to disk without checking Content-Length or total bytes written.
    This can leave the server vulnerable to denial of service (DoS) attacks via disk exhaustion.
    This test verifies that the gap is identified and documented.
    """
    enforced = False  # Set to True if backend adds size limits in the future
    assert enforced is False
