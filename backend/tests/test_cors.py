import pytest
from app.config.settings import settings


@pytest.mark.asyncio
async def test_cors_configured_origin_allowed(client):
    settings.cors_origins = "http://localhost:3000"

    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization",
    }
    response = await client.options("/auth/me", headers=headers)
    assert response.status_code == 200
    assert (
        response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    )
    assert response.headers.get("access-control-allow-credentials") == "true"


@pytest.mark.asyncio
async def test_cors_unconfigured_origin_rejected(client):
    settings.cors_origins = "http://localhost:3000"

    headers = {
        "Origin": "http://unallowed-origin.com",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization",
    }
    response = await client.options("/auth/me", headers=headers)
    assert response.headers.get("access-control-allow-origin") is None
