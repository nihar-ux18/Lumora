from pydantic import BaseModel, Field


class QuizGenerateRequest(BaseModel):
    topic: str = Field(
        min_length=1,
        max_length=255,
    )

    num_questions: int = Field(
        ge=1,
        le=20,
    )


class QuizQuestion(BaseModel):
    question: str

    options: list[str]

    correct_answer: int

    explanation: str


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]
    
class QuizSubmissionRequest(BaseModel):
    questions: list[QuizQuestion]
    answers: list[int]


class QuizResult(BaseModel):
    question: str
    selected_answer: int
    correct_answer: int
    is_correct: bool
    explanation: str


class QuizSubmissionResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    results: list[QuizResult]