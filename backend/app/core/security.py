from datetime import UTC, datetime, timedelta
from typing import Any
import secrets

from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.config.settings import settings

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    """Hash a plain-text password."""
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return password_hash.verify(password, hashed_password)


def _create_token(
    subject: str,
    expires_delta: timedelta,
    token_type: str,
) -> str:
    expire = datetime.now(UTC) + expires_delta

    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_access_token(subject: str) -> str:
    """Create a JWT access token."""
    return _create_token(
        subject=subject,
        expires_delta=timedelta(
            minutes=settings.access_token_expire_minutes,
        ),
        token_type="access",
    )


def create_refresh_token(subject: str) -> str:
    """Create a JWT refresh token."""
    return _create_token(
        subject=subject,
        expires_delta=timedelta(
            days=settings.refresh_token_expire_days,
        ),
        token_type="refresh",
    )


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload

    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
    
def generate_email_verification_token() -> str:
    """Generate a secure email verification token."""
    return secrets.token_urlsafe(32)

def validate_refresh_token(token: str) -> str:
    """
    Validate a refresh token and return the user ID.
    """
    payload = decode_token(token)

    if payload.get("type") != "refresh":
        raise ValueError("Invalid refresh token.")

    subject = payload.get("sub")

    if subject is None:
        raise ValueError("Invalid refresh token.")

    return subject