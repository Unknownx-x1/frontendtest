from app.schemas.chat import ChatMode, ChatRequest, ChatResponse, new_conversation_id, utc_now
from app.services.ai_provider import ai_provider
from app.services.context_builder import build_context_note


PERSONA_LABELS = {
    ChatMode.coach: "COACH",
    ChatMode.doctor: "DOCTOR",
}


class ChatService:
    async def generate_reply(self, request: ChatRequest) -> ChatResponse:
        conversation_id = request.conversation_id or new_conversation_id()
        normalized_message = request.message.strip()
        transcript = " ".join(
            [item.content for item in request.history[-10:]]
            + [normalized_message]
        )

        if request.mode == ChatMode.doctor:
            fallback_reply = self._doctor_reply(transcript)
        else:
            fallback_reply = self._coach_reply(transcript)

        provider = "local"
        reply = fallback_reply

        if normalized_message:
            context_note = build_context_note(
                mode=request.mode,
                history=request.history,
                current_message=normalized_message,
            )
            provider_message = (
                f"{context_note}\n\nLatest athlete message:\n{normalized_message}"
                if context_note
                else normalized_message
            )
            try:
                reply, provider = await ai_provider.generate_reply(
                    mode=request.mode,
                    message=provider_message,
                    history=request.history,
                )
            except RuntimeError:
                reply = fallback_reply

        return ChatResponse(
            reply=reply,
            mode=request.mode,
            persona=PERSONA_LABELS[request.mode],
            conversation_id=conversation_id,
            created_at=utc_now(),
            provider=provider,
        )

    def _coach_reply(self, message: str) -> str:
        lower_message = message.lower()

        if any(word in lower_message for word in ["pain", "hurt", "injury", "swelling"]):
            return (
                "Coach mode: respect the signal first. Reduce intensity today, run a pain-free mobility check, "
                "and only train if movement stays clean. If pain rises, switch to Doctor mode for safety triage."
            )

        if any(word in lower_message for word in ["stamina", "endurance", "tired", "fitness"]):
            return (
                "Coach mode: build the engine with intervals. Try 6 rounds of 45 seconds hard effort, "
                "75 seconds easy recovery, then finish with 8 minutes of relaxed cooldown work."
            )

        if any(word in lower_message for word in ["food", "eat", "nutrition", "meal"]):
            return (
                "Coach mode: fuel the session. Aim for carbs before training, protein after training, "
                "and steady hydration. Simple Indian field fuel: banana, curd, dal, rice, eggs or paneer."
            )

        return (
            "Coach mode: lock onto the next useful action. Tell me your sport, goal, training load, "
            "and what feels hardest right now. I will turn that into a sharper training command."
        )

    def _doctor_reply(self, message: str) -> str:
        lower_message = message.lower()

        # These symptoms are treated as safety escalations even before the future risk engine exists.
        if any(word in lower_message for word in ["chest pain", "faint", "numb", "deformity", "can't walk", "cannot walk"]):
            return (
                "Doctor mode: stop activity now and seek urgent medical evaluation. Red-flag symptoms need "
                "hands-on assessment before any return-to-play decision."
            )

        if "back" in lower_message and any(score in lower_message for score in ["7 pain", "7/10", "pain score 7"]):
            return (
                "Doctor mode: lower back pain at 7/10 with pain while walking is a moderate-to-high risk signal. "
                "Stop running and training today. Use relative rest, avoid bending or twisting, and consider ice for "
                "10-15 minutes at a time. Seek a clinician or physio evaluation, especially if pain worsens, spreads "
                "down the leg, or you develop numbness, weakness, or bladder/bowel changes. Return to play only after "
                "walking is pain-free and movement is near normal."
            )

        if any(word in lower_message for word in ["pain", "hurt", "injury", "swelling"]):
            return (
                "Doctor mode: reduce load now. Do not run, sprint, or lift through pain. Track whether pain is "
                "improving over the next 24-48 hours, and seek medical review if pain is sharp, worsening, affects "
                "walking, or comes with numbness, weakness, or bladder/bowel symptoms."
            )

        if any(word in lower_message for word in ["recover", "recovery", "return"]):
            return (
                "Doctor mode: return gradually. Use pain-free movement, normal strength, and sport-specific control "
                "as checkpoints. If symptoms return during progression, step back and reassess."
            )

        return (
            "Doctor mode: share the body area, symptom start time, pain score, swelling status, and what movement "
            "makes it worse. I will help you sort risk and next safe steps."
        )


chat_service = ChatService()
