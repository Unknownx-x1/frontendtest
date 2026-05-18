const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export function sendChatMessage({ mode, message, conversationId, history = [] }) {
  return requestJson('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({
      mode,
      message,
      conversation_id: conversationId,
      history,
    }),
  })
}
