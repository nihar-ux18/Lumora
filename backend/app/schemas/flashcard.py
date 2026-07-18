from pydantic import BaseModel, Field


class FlashcardGenerateRequest(BaseModel):
    topic: str = Field(
        min_length=1,
        max_length=255,
    )

    num_cards: int = Field(
        ge=1,
        le=50,
    )


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardResponse(BaseModel):
    flashcards: list[Flashcard]