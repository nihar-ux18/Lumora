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
        prompt: str,
    ) -> str:
        response = self.client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content