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
        messages = [
            {
                "role": "system",
                "content": context,
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