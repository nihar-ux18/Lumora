from openai import OpenAI

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