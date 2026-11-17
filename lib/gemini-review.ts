import {
  REVIEW_JSON_SCHEMA_HINT,
  normalizeReviewResult,
} from "@/lib/review-schema"
import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

const MAX_CODE_CHARS = 12_000
const GEMINI_TIMEOUT_MS = 45_000

/** Preferred first, then fallbacks if a model is unavailable for this key. */
const GEMINI_MODEL_FALLBACKS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
] as const

const REVIEW_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number" },
    aiLikelihood: { type: "number" },
    summary: { type: "string" },
    revisedCode: { type: "string" },
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
          suggestedCode: { type: "string" },
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
  required: ["score", "aiLikelihood", "summary", "revisedCode", "findings"],
} as const

function isUnavailableModel(status: number, detail: string): boolean {
  if (status === 404) return true
  const lower = detail.toLowerCase()
  return (
    lower.includes("not found") ||
    lower.includes("no longer available") ||
    lower.includes("is not supported") ||
    lower.includes("not supported for generatecontent")
  )
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"))
    ) {
      throw new Error(
        "Gemini timed out after 45s (high demand or slow model). Try a smaller snippet, or retry in a moment."
      )
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

function buildModelList(): string[] {
  const preferred = (process.env.GEMINI_MODEL || "").trim()
  const ordered = preferred
    ? [preferred, ...GEMINI_MODEL_FALLBACKS.filter((m) => m !== preferred)]
    : [...GEMINI_MODEL_FALLBACKS]
  return [...new Set(ordered)]
}

export async function runGeminiReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const code = request.code.trim().slice(0, MAX_CODE_CHARS)

  const prompt = `You are Oki-Ai, a precise code review assistant.
Review the given code for bugs, security risks, style/clarity issues, and performance problems.
Also estimate how likely the snippet was AI-authored (aiLikelihood 0-100).
Return ONLY JSON matching this shape:
${REVIEW_JSON_SCHEMA_HINT}
Rules:
- Be concrete and actionable. Prefer 3-6 findings.
- line must be a real 1-based line number in the snippet when possible.
- score 0-100 where higher is healthier code.
- If the code is short or clean, fewer findings is fine.
- revisedCode must be a complete improved rewrite in the same language.
- Keep revisedCode compact (apply main fixes only; avoid long comments).
- Keep each suggestion to 1-2 short sentences.
- Optional suggestedCode per finding should be a tiny local snippet only.

Language: ${request.language}

Code:
\`\`\`${request.language}
${code}
\`\`\``

  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: REVIEW_RESPONSE_SCHEMA,
    },
  })

  const models = buildModelList()
  let lastError = "No Gemini model succeeded."

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    let response: Response
    try {
      response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body,
        },
        GEMINI_TIMEOUT_MS
      )
    } catch (error) {
      // Timeouts shouldn't burn through every fallback — surface immediately.
      throw error
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      if (isUnavailableModel(response.status, detail)) {
        lastError = `Model unavailable: ${model}`
        continue
      }
      if (response.status === 503 || response.status === 429) {
        throw new Error(
          `Gemini is busy right now (${response.status}). Wait a moment and try again.`
        )
      }
      throw new Error(
        `Gemini request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`
      )
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> }
        finishReason?: string
      }>
    }

    const candidate = payload.candidates?.[0]
    const content = candidate?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim()

    if (!content) {
      throw new Error(
        candidate?.finishReason === "MAX_TOKENS"
          ? "Gemini hit the output limit before finishing. Try a shorter snippet."
          : "Gemini returned an empty review. Retry in a moment."
      )
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error("Gemini returned invalid JSON. Retry the review.")
    }

    return normalizeReviewResult(parsed, request.language, code)
  }

  throw new Error(
    `The selected Gemini model isn’t available for this key (${lastError}). Set GEMINI_MODEL in .env to one your key can use (try gemini-3.8-flash or gemini-3.5-flash-lite).`
  )
}
