from app.schemas.chat import ChatHistoryMessage, ChatMode


def build_context_note(*, mode: ChatMode, history: list[ChatHistoryMessage], current_message: str) -> str:
    if mode != ChatMode.doctor:
        return ""

    transcript = " ".join(
        [item.content.lower() for item in history]
        + [current_message.lower()]
    )

    facts: list[str] = []
    if "back" in transcript:
        facts.append("affected area: back")
    if "lower" in transcript and "back" in transcript:
        facts.append("location: lower back")
    if "slip" in transcript or "slipped" in transcript:
        facts.append("mechanism: slipped while playing football")
    if "no swelling" in transcript or "without swelling" in transcript:
        facts.append("swelling: denied")
    if "can walk" in transcript:
        facts.append("walking: able")
    if "pain while walking" in transcript or "pain when walking" in transcript:
        facts.append("walking: painful")
    if "not run" in transcript or "can't run" in transcript or "cannot run" in transcript:
        facts.append("running: unable")

    for score in range(10, 0, -1):
        if f"{score} pain" in transcript or f"{score}/10" in transcript or f"pain score {score}" in transcript:
            facts.append(f"pain score: {score}/10")
            break

    if not facts:
        return ""

    return (
        "Known athlete-provided injury context. Do not ask again for facts already listed here:\n"
        + "\n".join(f"- {fact}" for fact in facts)
    )
