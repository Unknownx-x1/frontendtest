from app.core.config import settings
from app.schemas.chat import ChatHistoryMessage, ChatMode
from app.services.groq_service import groq_service
from app.services.openai_service import openai_service


class AIProvider:
    async def generate_reply(
        self,
        *,
        mode: ChatMode,
        message: str,
        history: list[ChatHistoryMessage],
    ) -> tuple[str, str]:
        if settings.ai_provider == "groq":
            if not groq_service.is_configured:
                raise RuntimeError("Groq provider selected but GROQ_API_KEY is missing.")
            return await groq_service.generate_chat_reply(mode=mode, message=message, history=history), "groq"

        if settings.ai_provider == "openai":
            if not openai_service.is_configured:
                raise RuntimeError("OpenAI provider selected but OPENAI_API_KEY is missing.")
            return await openai_service.generate_chat_reply(mode=mode, message=message, history=history), "openai"

        raise RuntimeError("Remote AI provider is disabled.")


ai_provider = AIProvider()
