from fastapi import APIRouter, Request
from datetime import datetime, UTC
from httpx import AsyncClient

from app.services.oauth_service import oauth
from app.core.security import (
    create_access_token,
    create_refresh_token,
)
from app.models.user import (
    AuthProvider,
    User,
)
from app.repositories.auth_repository import AuthRepository
from app.db.session import AsyncSessionLocal


router = APIRouter(prefix="/oauth", tags=["OAuth"])

@router.get("/google")
async def google_login(request: Request):
    redirect_uri= request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/github")
async def github_login(request: Request):
    redirect_uri= request.url_for("github_callback")
    print("Redirect URI:", redirect_uri)
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)

    user_info = token["userinfo"]

    async with AsyncSessionLocal() as session:
        repository = AuthRepository(session)

        user = await repository.get_user_by_email(
            user_info["email"],
        )

        if user is None:
            user = User(
                fullname=user_info["name"],
                email=user_info["email"],
                avatar_url=user_info.get("picture"),
                provider=AuthProvider.GOOGLE,
                is_verified=True,
                last_login=datetime.now(UTC),
            )

            user = await repository.create_user(user)

        else:
            user.last_login = datetime.now(UTC)
            await repository.update_user(user)

        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }
        
@router.get("/github/callback", name="github_callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)

    async with AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {token['access_token']}",
            },
        )

        github_user = response.json()

        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {token['access_token']}",
            },
        )

        emails = email_response.json()

    primary_email = next(
        (
            email["email"]
            for email in emails
            if email["primary"]
        ),
        None,
    )

    async with AsyncSessionLocal() as session:
        repository = AuthRepository(session)

        user = await repository.get_user_by_email(primary_email)

        if user is None:
            user = User(
                fullname=github_user["name"] or github_user["login"],
                email=primary_email,
                avatar_url=github_user["avatar_url"],
                provider=AuthProvider.GITHUB,
                is_verified=True,
                last_login=datetime.now(UTC),
            )

            user = await repository.create_user(user)

        else:
            user.last_login = datetime.now(UTC)
            await repository.update_user(user)

        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }
