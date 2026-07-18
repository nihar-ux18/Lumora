from openai import OpenAI
import json

from app.config.settings import settings


class AIService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    from openai import OpenAI

from app.config.settings import settings


class AIService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    async def generate_response(
        self,
        context: str,
        prompt: str,
        history: list[dict],
    ) -> str:

        system_prompt = f"""
You are Lumora AI, an intelligent learning assistant.

You must answer ONLY using the retrieved workspace context below.

Rules:
- Never invent or assume information.
- If the answer is not present in the context, reply exactly:
"I couldn't find that information in this workspace."
- Keep answers concise and accurate.
- When appropriate, use bullet points.
- Do not mention internal implementation details such as embeddings, vector search, or retrieval.

Retrieved Context:
------------------
{context}
"""

        messages = [
            {
                "role": "system",
                "content": system_prompt,
            },
            *history,
            {
                "role": "user",
                "content": prompt,
            },
        ]

        response = self.client.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
        )

        return response.choices[0].message.content
    
    async def generate_quiz(
        self,
        context: str,
        topic: str,
        num_questions: int,
    ):
        prompt = f"""
    Generate exactly {num_questions} multiple-choice questions.

    Topic:
    {topic}

    Context:
    {context}

    Return ONLY valid JSON.

    Format:

    {{
    "questions": [
        {{
        "question": "...",
        "options": [
            "...",
            "...",
            "...",
            "..."
        ],
        "correct_answer": 0,
        "explanation": "..."
        }}
    ]
    }}

    Rules:

    - Exactly 4 options.
    - correct_answer is the option index (0-3).
    - Use ONLY the provided context.
    - If the context doesn't contain enough information, return:

    {{
    "questions":[]
    }}

    Do NOT wrap the JSON inside markdown.
    Do NOT explain anything.
    """

        response = self.client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate educational quizzes "
                        "using only the provided context."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        content = response.choices[0].message.content

        return json.loads(content)
    
    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
    ):
        response = self.client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )
    
        return json.loads(
            response.choices[0].message.content
        )