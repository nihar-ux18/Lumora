from pydantic import BaseModel


class RoadmapRequest(BaseModel):
    topic: str


class RoadmapResponse(BaseModel):
    roadmap: list[str]