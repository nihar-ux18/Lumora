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
    You are Lumora AI.
    
    Answer ONLY using the context below.
    
    If the answer cannot be found in the context, reply exactly:
    
    "I couldn't find that information in this workspace."
    
    Context:
    
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