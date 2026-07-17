from pydantic import BaseModel

class SearchQuery(BaseModel):
    query: str
    limit: int = 5