import { buildReviewMessages } from "@/lib/openai-review"
import { normalizeReviewResult } from "@/lib/review-schema"
import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

const MAX_CODE_CHARS = 16_000

export async function runOpenRouterReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
  const messages = buildReviewMessages(request)
  const siteUrl =
    process.env.OPENROUTER_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://oki-ai-five.vercel.app"
  const siteName = process.env.OPENROUTER_SITE_NAME || "Oki-Ai"

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
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
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "OpenRouter rejected the API key. Check OPENROUTER_API_KEY in .env, then restart the dev server."
      )
    }
    if (response.status === 402 || lower.includes("insufficient")) {
      throw new Error(
        "OpenRouter has no credits for this key. Add credits at openrouter.ai, then retry."
      )
    }
    if (response.status === 429) {
      throw new Error(
        "OpenRouter rate limit hit. Wait a moment and try again, or switch to Gemini/Groq."
      )
    }
    if (
      response.status === 404 ||
      lower.includes("not found") ||
      lower.includes("no endpoints")
    ) {
      throw new Error(
        `OpenRouter model unavailable (${model}). Set OPENROUTER_MODEL in .env to a model your key can use.`
      )
    }
    throw new Error(
      `OpenRouter request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`
    )
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("OpenRouter returned an empty review")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error("OpenRouter returned invalid JSON")
  }

  return normalizeReviewResult(
    parsed,
    request.language,
    request.code.trim().slice(0, MAX_CODE_CHARS)
  )
}
