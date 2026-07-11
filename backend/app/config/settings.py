from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    app_name: str = Field(default="Lumora API", alias="APP_NAME")
    app_version: str = Field(default="0.1.0", alias="APP_VERSION")
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=True, alias="DEBUG")

    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    backend_url: str = Field(
        default="http://localhost:8000",
        alias="BACKEND_URL",
    )

    database_url: str = Field(alias="DATABASE_URL")
    redis_url: str = Field(alias="REDIS_URL")

    jwt_secret_key: str = Field(alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(
        default="HS256",
        alias="JWT_ALGORITHM",
    )

    access_token_expire_minutes: int = Field(
        default=15,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )

    refresh_token_expire_days: int = Field(
        default=7,
        alias="REFRESH_TOKEN_EXPIRE_DAYS",
    )

    email_verification_expire_hours: int = Field(
        default=24,
        alias="EMAIL_VERIFICATION_EXPIRE_HOURS",
    )

    openai_api_key: str = Field(
        default="",
        alias="OPENAI_API_KEY",
    )

    gemini_api_key: str = Field(
        default="",
        alias="GEMINI_API_KEY",
    )
    
    google_client_id: str = Field(
    default="",
    alias="GOOGLE_CLIENT_ID",
    )

    google_client_secret: str = Field(
        default="",
        alias="GOOGLE_CLIENT_SECRET",
    )

    github_client_id: str = Field(
        default="",
        alias="GITHUB_CLIENT_ID",
    )

    github_client_secret: str = Field(
        default="",
        alias="GITHUB_CLIENT_SECRET",
    )

    cors_origins: str = Field(alias="CORS_ORIGINS")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()