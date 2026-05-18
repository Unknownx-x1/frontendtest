from datetime import UTC, datetime
from enum import StrEnum
from uuid import uuid4

from pydantic import BaseModel, Field


class ChatMode(StrEnum):
    coach = "coach"
    doctor = "doctor"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    mode: ChatMode = ChatMode.coach
    conversation_id: str | None = Field(default=None, max_length=120)
    history: list["ChatHistoryMessage"] = Field(default_factory=list, max_length=12)


class ChatHistoryMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    mode: ChatMode
    persona: str
    conversation_id: str
    created_at: datetime
    provider: str


def new_conversation_id() -> str:
    return f"conv_{uuid4().hex}"


def utc_now() -> datetime:
    return datetime.now(UTC)
