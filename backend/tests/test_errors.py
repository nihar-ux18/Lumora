import pytest
from app.main import app


def has_test_error_route() -> bool:
    for route in app.routes:
        if getattr(route, "path", None) == "/test-error":
            return True
    return False


@pytest.mark.asyncio
@pytest.mark.skipif(
    not has_test_error_route(), reason="/test-error route is not defined"
)
async def test_error_response_compatibility(client):
    response = await client.get("/test-error")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "User not found"
    assert data["success"] is False
