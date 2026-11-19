import { NextResponse } from "next/server"
import { runAutoReview } from "@/lib/auto-review"
import { runGeminiReview } from "@/lib/gemini-review"
import { runGroqReview } from "@/lib/groq-review"
import { runMockReview } from "@/lib/mock-review"
import { runOpenAiReview } from "@/lib/openai-review"
import {
  CODE_LANGUAGES,
  type CodeLanguage,
  type ReviewProvider,
  type ReviewRequest,
} from "@/lib/review-types"

const LANGUAGES = new Set<CodeLanguage>(
  CODE_LANGUAGES.map((language) => language.value)
)

const PROVIDERS = new Set<ReviewProvider>(["auto", "gemini", "groq"])

function resolveProvider(
  requested: unknown
): ReviewProvider | "openai" | "mock" {
  if (
    typeof requested === "string" &&
    PROVIDERS.has(requested as ReviewProvider)
  ) {
    return requested as ReviewProvider
  }

  const fromEnv = process.env.REVIEW_PROVIDER?.toLowerCase()
  if (
    fromEnv === "auto" ||
    fromEnv === "gemini" ||
    fromEnv === "groq" ||
    fromEnv === "openai" ||
    fromEnv === "mock"
  ) {
    return fromEnv
  }

  if (process.env.GEMINI_API_KEY && process.env.GROQ_API_KEY) return "auto"
  if (process.env.GEMINI_API_KEY) return "gemini"
  if (process.env.GROQ_API_KEY) return "groq"
  if (process.env.OPENAI_API_KEY) return "openai"
  return "mock"
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  const code = typeof record.code === "string" ? record.code : ""
  const language = record.language

  if (!code.trim()) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 })
  }

  if (typeof language !== "string" || !LANGUAGES.has(language as CodeLanguage)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 })
  }

  const payload: ReviewRequest = {
    code,
    language: language as CodeLanguage,
  }

  const prefer = resolveProvider(record.provider)

  try {
    if (prefer === "auto") {
      const result = await runAutoReview(payload)
      return NextResponse.json({ ...result, source: "auto" })
    }

    if (prefer === "gemini") {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not configured" },
          { status: 500 }
        )
      }
      const result = await runGeminiReview(payload)
      return NextResponse.json({ ...result, source: "gemini" })
    }

    if (prefer === "groq") {
      if (!process.env.GROQ_API_KEY) {
        return NextResponse.json(
          { error: "GROQ_API_KEY is not configured" },
          { status: 500 }
        )
      }
      const result = await runGroqReview(payload)
      return NextResponse.json({ ...result, source: "groq" })
    }

    if (prefer === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: "OPENAI_API_KEY is not configured" },
          { status: 500 }
        )
      }
      const result = await runOpenAiReview(payload)
      return NextResponse.json({ ...result, source: "openai" })
    }

    const result = await runMockReview(payload)
    return NextResponse.json({
      ...result,
      source: "mock",
      notice:
        "No AI key found — using mock review. Add GEMINI_API_KEY or GROQ_API_KEY to .env.",
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Review failed unexpectedly"
    const timedOut = message.toLowerCase().includes("timed out")
    return NextResponse.json(
      { error: message },
      { status: timedOut ? 504 : 502 }
    )
  }
}
