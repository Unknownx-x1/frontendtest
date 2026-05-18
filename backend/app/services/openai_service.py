from openai import APIConnectionError, APIStatusError, APITimeoutError, AsyncOpenAI

from app.core.config import settings
from app.schemas.chat import ChatHistoryMessage, ChatMode
from app.services.persona_prompts import instructions_for_mode


class OpenAIService:
    def __init__(self) -> None:
        self._client = (
            AsyncOpenAI(api_key=settings.openai_api_key, timeout=settings.openai_timeout_seconds)
            if settings.openai_api_key
            else None
        )

    @property
    def is_configured(self) -> bool:
        return self._client is not None

    async def generate_chat_reply(self, *, mode: ChatMode, message: str, history: list[ChatHistoryMessage]) -> str:
        if self._client is None:
            raise RuntimeError("OpenAI API key is not configured.")

        try:
            response = await self._client.responses.create(
                model=settings.openai_model,
                instructions=instructions_for_mode(mode),
                input=[
                    {
                        "role": item.role,
                        "content": [
                            {
                                "type": "input_text",
                                "text": item.content,
                            }
                        ],
                    }
                    for item in history[-10:]
                ]
                + [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": message,
                            }
                        ],
                    }
                ],
            )
        except (APIConnectionError, APIStatusError, APITimeoutError) as exc:
            raise RuntimeError("OpenAI request failed.") from exc

        reply = response.output_text.strip()
        if not reply:
            raise RuntimeError("OpenAI returned an empty response.")

        return reply


openai_service = OpenAIService()
