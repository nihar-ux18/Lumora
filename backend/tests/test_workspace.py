import pytest
from app.core.security import create_access_token, hash_password
from app.models.user import User, Role
from app.models.workspace_member import WorkspaceMember, WorkspaceRole


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
async def test_owner_workspace_operations(client, db_session):
    user_owner = await create_test_user(
        db_session, "owner@example.com", "Workspace Owner"
    )
    headers = get_auth_headers(user_owner)

    # 1. Create Workspace
    create_payload = {"name": "Test Workspace", "description": "My test workspace"}
    res_create = await client.post("/workspaces", json=create_payload, headers=headers)
    assert res_create.status_code == 201
    workspace_id = res_create.json()["id"]

    # 2. Get Workspace (Access own workspace)
    res_get = await client.get(f"/workspaces/{workspace_id}", headers=headers)
    assert res_get.status_code == 200
    assert res_get.json()["name"] == create_payload["name"]

    # 3. Update Workspace
    update_payload = {"name": "Updated Name"}
    res_update = await client.patch(
        f"/workspaces/{workspace_id}", json=update_payload, headers=headers
    )
    assert res_update.status_code == 200
    assert res_update.json()["name"] == "Updated Name"

    # 4. Delete Workspace
    res_delete = await client.delete(f"/workspaces/{workspace_id}", headers=headers)
    assert res_delete.status_code == 204


@pytest.mark.asyncio
async def test_non_owner_workspace_access_restrictions(client, db_session):
    user_owner = await create_test_user(
        db_session, "owner_res@example.com", "Workspace Owner"
    )
    user_non_owner = await create_test_user(
        db_session, "non_owner@example.com", "Non Owner"
    )

    owner_headers = get_auth_headers(user_owner)
    non_owner_headers = get_auth_headers(user_non_owner)

    # Owner creates workspace
    create_payload = {"name": "Secure Workspace", "description": "Owner only"}
    res_create = await client.post(
        "/workspaces", json=create_payload, headers=owner_headers
    )
    assert res_create.status_code == 201
    workspace_id = res_create.json()["id"]

    # Non-owner cannot view workspace (returns 404)
    res_get = await client.get(f"/workspaces/{workspace_id}", headers=non_owner_headers)
    assert res_get.status_code == 404
    assert "Workspace not found" in res_get.json()["detail"]

    # Non-owner cannot update workspace (returns 404)
    res_update = await client.patch(
        f"/workspaces/{workspace_id}",
        json={"name": "Hacked"},
        headers=non_owner_headers,
    )
    assert res_update.status_code == 404
    assert "Workspace not found" in res_update.json()["detail"]

    # Non-owner cannot delete workspace (returns 404)
    res_delete = await client.delete(
        f"/workspaces/{workspace_id}", headers=non_owner_headers
    )
    assert res_delete.status_code == 404
    assert "Workspace not found" in res_delete.json()["detail"]


@pytest.mark.asyncio
async def test_workspace_membership_authorization(client, db_session):
    user_owner = await create_test_user(
        db_session, "owner_member@example.com", "Owner User"
    )
    user_non_owner = await create_test_user(
        db_session, "stranger@example.com", "Stranger User"
    )
    user_to_invite = await create_test_user(
        db_session, "invitee@example.com", "Invitee User"
    )

    owner_headers = get_auth_headers(user_owner)
    non_owner_headers = get_auth_headers(user_non_owner)

    # Owner creates workspace
    res_create = await client.post(
        "/workspaces", json={"name": "Member Workspace"}, headers=owner_headers
    )
    assert res_create.status_code == 201
    workspace_id = res_create.json()["id"]

    # 1. Non-owner cannot invite members
    invite_payload = {"email": "invitee@example.com"}
    res_invite_fail = await client.post(
        f"/workspaces/{workspace_id}/invite",
        json=invite_payload,
        headers=non_owner_headers,
    )
    assert res_invite_fail.status_code == 403
    assert "Only workspace owner" in res_invite_fail.json()["detail"]

    # Owner invites successfully
    res_invite_ok = await client.post(
        f"/workspaces/{workspace_id}/invite", json=invite_payload, headers=owner_headers
    )
    assert res_invite_ok.status_code == 201

    # Add invitee manually as member for role modification / removal tests
    member_to_mod = WorkspaceMember(
        workspace_id=workspace_id, user_id=user_to_invite.id, role=WorkspaceRole.MEMBER
    )
    db_session.add(member_to_mod)
    await db_session.commit()

    # 2. Non-owner cannot modify member roles
    role_payload = {"role": "admin"}
    res_role_fail = await client.patch(
        f"/workspaces/{workspace_id}/members/{user_to_invite.id}",
        json=role_payload,
        headers=non_owner_headers,
    )
    assert res_role_fail.status_code == 403
    assert "Only workspace owner" in res_role_fail.json()["detail"]

    # Owner can modify member roles
    res_role_ok = await client.patch(
        f"/workspaces/{workspace_id}/members/{user_to_invite.id}",
        json=role_payload,
        headers=owner_headers,
    )
    assert res_role_ok.status_code == 200

    # 3. Non-owner cannot remove members
    res_remove_fail = await client.delete(
        f"/workspaces/{workspace_id}/members/{user_to_invite.id}",
        headers=non_owner_headers,
    )
    assert res_remove_fail.status_code == 403
    assert "Only workspace owner" in res_remove_fail.json()["detail"]

    # Owner can remove members
    res_remove_ok = await client.delete(
        f"/workspaces/{workspace_id}/members/{user_to_invite.id}", headers=owner_headers
    )
    assert res_remove_ok.status_code == 200
