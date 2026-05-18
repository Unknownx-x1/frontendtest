from fastapi import APIRouter, HTTPException, status

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service


router = APIRouter(prefix="/chat")


@router.post("", response_model=ChatResponse)
async def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    try:
        return await chat_service.generate_reply(payload)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Chat service failed to generate a response.",
        ) from exc
