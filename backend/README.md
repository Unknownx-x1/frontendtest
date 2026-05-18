# AthleteEdge AI Backend

FastAPI backend for AthleteEdge AI.

## Local Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Health Check

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "AthleteEdge AI Backend",
  "environment": "development",
  "timestamp": "2026-05-18T..."
}
```

## Chat Check

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/v1/chat `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"mode":"coach","message":"How do I improve stamina?"}'
```

The endpoint currently returns deterministic Coach or Doctor mode responses. OpenAI integration is added in a later phase.

Coach and Doctor mode are selected through the `mode` field:

```json
{
  "mode": "doctor",
  "message": "My knee has swelling and sharp pain"
}
```

The response echoes the active mode so the frontend can keep each AI message attached to the persona that generated it, even if the user switches roles later.

## AI Provider Setup

Choose the remote model provider in `backend/.env`.

For Groq:

```env
AI_PROVIDER="groq"
GROQ_API_KEY="your_groq_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"
GROQ_BASE_URL="https://api.groq.com/openai/v1"
GROQ_TIMEOUT_SECONDS=30
```

For OpenAI:

```env
AI_PROVIDER="openai"
OPENAI_API_KEY="your_api_key_here"
OPENAI_MODEL="gpt-5.2"
OPENAI_TIMEOUT_SECONDS=30
```

Restart the backend after changing `.env`:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

When a remote provider is configured, `/api/v1/chat` uses that provider. If the selected key is missing or the API request fails, the backend returns the local fallback response so the UI remains usable during development.

The response includes the provider that produced the answer:

```json
{
  "provider": "groq"
}
```

or:

```json
{
  "provider": "local"
}
```
