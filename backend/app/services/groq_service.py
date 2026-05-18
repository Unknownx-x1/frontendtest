from openai import APIConnectionError, APIStatusError, APITimeoutError, AsyncOpenAI

from app.core.config import settings
from app.schemas.chat import ChatHistoryMessage, ChatMode
from app.services.persona_prompts import instructions_for_mode


def _to_groq_messages(history: list[ChatHistoryMessage], message: str) -> list[dict[str, str]]:
    messages = [
        {
            "role": item.role,
            "content": item.content,
        }
        for item in history[-10:]
    ]
    messages.append({"role": "user", "content": message})
    return messages


class GroqService:
    def __init__(self) -> None:
        self._client = (
            AsyncOpenAI(
                api_key=settings.groq_api_key,
                base_url=settings.groq_base_url,
                timeout=settings.groq_timeout_seconds,
            )
            if settings.groq_api_key
            else None
        )

    @property
    def is_configured(self) -> bool:
        return self._client is not None

    async def generate_chat_reply(self, *, mode: ChatMode, message: str, history: list[ChatHistoryMessage]) -> str:
        if self._client is None:
            raise RuntimeError("Groq API key is not configured.")

        try:
            response = await self._client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": instructions_for_mode(mode)},
                    *_to_groq_messages(history, message),
                ],
                temperature=0.4,
            )
        except (APIConnectionError, APIStatusError, APITimeoutError) as exc:
            raise RuntimeError("Groq request failed.") from exc

        reply = response.choices[0].message.content
        if not reply:
            raise RuntimeError("Groq returned an empty response.")

        return reply.strip()


groq_service = GroqService()
