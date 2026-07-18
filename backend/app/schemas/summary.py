from pydantic import BaseModel, Field


class SummaryGenerateRequest(BaseModel):
    topic: str = Field(
        min_length=1,
        max_length=255,
    )


class SummaryResponse(BaseModel):
    summary: str