import {
  REVIEW_JSON_SCHEMA_HINT,
  normalizeReviewResult,
} from "@/lib/review-schema"
import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

const MAX_CODE_CHARS = 16_000

export function buildReviewMessages(request: ReviewRequest) {
  const code = request.code.trim().slice(0, MAX_CODE_CHARS)

  return [
    {
      role: "system" as const,
      content: `You are Oki-Ai, a precise code review assistant.
Review the given code for bugs, security risks, style/clarity issues, and performance problems.
Also estimate how likely the snippet was AI-authored (aiLikelihood 0-100).
Return ONLY valid JSON matching this shape:
${REVIEW_JSON_SCHEMA_HINT}
Rules:
- Be concrete and actionable. Prefer 3-8 findings.
- line must be a real 1-based line number in the snippet when possible.
- score 0-100 where higher is healthier code.
- If the code is short or clean, fewer findings is fine.
- revisedCode must be a complete, improved rewrite of the submitted snippet that applies the main fixes.
- Keep revisedCode in the same language. Prefer runnable code over comments-only guidance.
- For each finding, optionally include suggestedCode as a short local fix snippet.
- Do not wrap the JSON in markdown fences.`,
    },
    {
      role: "user" as const,
      content: `Language: ${request.language}

Code:
\`\`\`${request.language}
${code}
\`\`\``,
    },
  ]
}

export async function runOpenAiReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const messages = buildReviewMessages(request)

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    const lower = detail.toLowerCase()
    if (
      response.status === 429 &&
      (lower.includes("insufficient_quota") || lower.includes("no credits"))
    ) {
      throw new Error(
        "OpenAI has no credits left. Add billing credits at platform.openai.com/settings/organization/billing, or switch the review model to Gemini."
      )
    }
    if (response.status === 401) {
      throw new Error(
        "OpenAI rejected the API key. Check OPENAI_API_KEY in .env, then restart the dev server."
      )
    }
    throw new Error(
      `OpenAI request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`
    )
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("OpenAI returned an empty review")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error("OpenAI returned invalid JSON")
  }

  return normalizeReviewResult(
    parsed,
    request.language,
    request.code.trim().slice(0, MAX_CODE_CHARS)
  )
}
