import pytest
from datetime import timedelta
from app.config.settings import settings
from app.core.security import _create_token


@pytest.mark.asyncio
async def test_register_success(client):
    payload = {
        "fullname": "Auth Tester",
        "email": "tester@example.com",
        "password": "securepassword123",
    }
    # Temporarily set app env to development for auto-verification
    settings.app_env = "development"
    response = await client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["fullname"] == payload["fullname"]
    assert data["email"] == payload["email"]
    assert data["is_verified"] is True
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    payload = {
        "fullname": "First User",
        "email": "duplicate@example.com",
        "password": "securepassword123",
    }
    response1 = await client.post("/auth/register", json=payload)
    assert response1.status_code == 201

    payload["fullname"] = "Second User"
    response2 = await client.post("/auth/register", json=payload)
    assert response2.status_code == 409
    assert "already registered" in response2.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(client):
    # Register and auto-verify
    settings.app_env = "development"
    register_payload = {
        "fullname": "Login Tester",
        "email": "login_tester@example.com",
        "password": "securepassword123",
    }
    await client.post("/auth/register", json=register_payload)

    login_payload = {
        "email": "login_tester@example.com",
        "password": "securepassword123",
    }
    response = await client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_failure(client):
    # Invalid email/password
    login_payload = {"email": "nonexistent@example.com", "password": "somepassword"}
    response = await client.post("/auth/login", json=login_payload)
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]

    # Register user but make them unverified
    settings.app_env = "production"
    register_payload = {
        "fullname": "Unverified User",
        "email": "unverified@example.com",
        "password": "securepassword123",
    }
    await client.post("/auth/register", json=register_payload)

    # Try logging in before verification
    login_payload = {"email": "unverified@example.com", "password": "securepassword123"}
    response = await client.post("/auth/login", json=login_payload)
    assert response.status_code == 401
    assert "verify your email" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protected_endpoints_missing_auth(client):
    response = await client.get("/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_endpoints_invalid_jwt(client):
    headers = {"Authorization": "Bearer invalid_token_value"}
    response = await client.get("/auth/me", headers=headers)
    assert response.status_code == 401
    assert "Invalid access token" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protected_endpoints_expired_jwt(client):
    # Create an expired token manually
    expired_token = _create_token(
        subject="expired-user-id",
        expires_delta=timedelta(seconds=-10),
        token_type="access",
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = await client.get("/auth/me", headers=headers)
    assert response.status_code == 401
    assert "Invalid access token" in response.json()["detail"]


@pytest.mark.asyncio
async def test_development_verification_bypass_rules(client):
    # 1. Verification bypass works in development
    settings.app_env = "development"
    payload_dev = {
        "fullname": "Dev User",
        "email": "dev@lumora.dev",
        "password": "securepassword123",
    }
    res_dev = await client.post("/auth/register", json=payload_dev)
    assert res_dev.status_code == 201
    assert res_dev.json()["is_verified"] is True

    # 2. Verification bypass is disabled in production
    settings.app_env = "production"
    payload_prod = {
        "fullname": "Prod User",
        "email": "prod@lumora.dev",
        "password": "securepassword123",
    }
    res_prod = await client.post("/auth/register", json=payload_prod)
    assert res_prod.status_code == 201
    assert res_prod.json()["is_verified"] is False
