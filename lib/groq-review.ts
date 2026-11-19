import { buildReviewMessages } from "@/lib/openai-review"
import { normalizeReviewResult } from "@/lib/review-schema"
import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

const MAX_CODE_CHARS = 16_000

export async function runGroqReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured")
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
  const messages = buildReviewMessages(request)

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages,
      }),
    }
  )

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    const lower = detail.toLowerCase()
    if (response.status === 401) {
      throw new Error(
        "Groq rejected the API key. Check GROQ_API_KEY in .env, then restart the dev server."
      )
    }
    if (response.status === 429) {
      throw new Error(
        "Groq rate limit hit. Wait a moment and try again, or switch the review model to Gemini."
      )
    }
    if (
      response.status === 404 ||
      lower.includes("model_not_found") ||
      lower.includes("does not exist")
    ) {
      throw new Error(
        `Groq model unavailable (${model}). Set GROQ_MODEL in .env to a model your key can use (e.g. openai/gpt-oss-20b or openai/gpt-oss-120b).`
      )
    }
    if (lower.includes("json_object") || lower.includes("response_format")) {
      throw new Error(
        "Groq model rejected JSON mode. Set GROQ_MODEL to a chat model that supports json_object (e.g. openai/gpt-oss-20b)."
      )
    }
    throw new Error(
      `Groq request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`
    )
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("Groq returned an empty review")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error("Groq returned invalid JSON")
  }

  return normalizeReviewResult(
    parsed,
    request.language,
    request.code.trim().slice(0, MAX_CODE_CHARS)
  )
}
