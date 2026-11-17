import { NextResponse } from "next/server"
import { runGeminiReview } from "@/lib/gemini-review"
import { runMockReview } from "@/lib/mock-review"
import { runOpenAiReview } from "@/lib/openai-review"
import {
  CODE_LANGUAGES,
  type CodeLanguage,
  type ReviewRequest,
} from "@/lib/review-types"

const LANGUAGES = new Set<CodeLanguage>(
  CODE_LANGUAGES.map((language) => language.value)
)

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

  const prefer =
    process.env.REVIEW_PROVIDER?.toLowerCase() ||
    (process.env.GEMINI_API_KEY
      ? "gemini"
      : process.env.OPENAI_API_KEY
        ? "openai"
        : "mock")

  try {
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
        "No AI key found — using mock review. Add GEMINI_API_KEY (free tier) or OPENAI_API_KEY to .env.local.",
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
