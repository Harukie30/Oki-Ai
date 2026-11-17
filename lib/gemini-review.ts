import {
  REVIEW_JSON_SCHEMA_HINT,
  normalizeReviewResult,
} from "@/lib/review-schema"
import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

const MAX_CODE_CHARS = 16_000

const REVIEW_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number" },
    aiLikelihood: { type: "number" },
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          severity: {
            type: "string",
            enum: ["critical", "warning", "info", "suggestion"],
          },
          category: {
            type: "string",
            enum: ["bug", "security", "style", "performance"],
          },
          line: { type: "integer" },
          title: { type: "string" },
          detail: { type: "string" },
          suggestion: { type: "string" },
        },
        required: [
          "severity",
          "category",
          "line",
          "title",
          "detail",
          "suggestion",
        ],
      },
    },
  },
  required: ["score", "aiLikelihood", "summary", "findings"],
} as const

export async function runGeminiReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash"
  const code = request.code.trim().slice(0, MAX_CODE_CHARS)

  const prompt = `You are Oki-Ai, a precise code review assistant.
Review the given code for bugs, security risks, style/clarity issues, and performance problems.
Also estimate how likely the snippet was AI-authored (aiLikelihood 0-100).
Return ONLY JSON matching this shape:
${REVIEW_JSON_SCHEMA_HINT}
Rules:
- Be concrete and actionable. Prefer 3-8 findings.
- line must be a real 1-based line number in the snippet when possible.
- score 0-100 where higher is healthier code.
- If the code is short or clean, fewer findings is fine.

Language: ${request.language}

Code:
\`\`\`${request.language}
${code}
\`\`\``

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: REVIEW_RESPONSE_SCHEMA,
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(
      `Gemini request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`
    )
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim()

  if (!content) {
    throw new Error("Gemini returned an empty review")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error("Gemini returned invalid JSON")
  }

  return normalizeReviewResult(parsed, request.language)
}
