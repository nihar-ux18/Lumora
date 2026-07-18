from pydantic import BaseModel


class RevisionRequest(BaseModel):
    topic: str


class RevisionResponse(BaseModel):
    revision_points: list[str]
    