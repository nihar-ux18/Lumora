from google import genai

from app.config.settings import settings


class LLMService:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def generate_response(
        self,
        prompt: str,
    ) -> str:
        response = self.client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt,
        )

        return response.text