import { NextResponse } from "next/server"
import {
  CODE_LANGUAGES,
  type CodeLanguage,
  type ReviewFinding,
  type ReviewResult,
} from "@/lib/review-types"
import type { ReviewSource } from "@/lib/run-review"
import {
  createSavedReview,
  listSavedReviews,
  requireSessionUserId,
} from "@/lib/reviews"

const LANGUAGES = new Set<CodeLanguage>(
  CODE_LANGUAGES.map((language) => language.value)
)

export async function GET() {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const reviews = await listSavedReviews(userId)
  return NextResponse.json({ reviews })
}

export async function POST(request: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as {
    code?: unknown
    language?: unknown
    provider?: unknown
    title?: unknown
    result?: Partial<ReviewResult & { source?: ReviewSource }>
  } | null

  if (!body || typeof body.code !== "string" || !body.code.trim()) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 })
  }

  if (
    typeof body.language !== "string" ||
    !LANGUAGES.has(body.language as CodeLanguage)
  ) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 })
  }

  const result = body.result
  if (
    !result ||
    typeof result.score !== "number" ||
    typeof result.aiLikelihood !== "number" ||
    typeof result.summary !== "string" ||
    typeof result.revisedCode !== "string" ||
    !Array.isArray(result.findings)
  ) {
    return NextResponse.json({ error: "Invalid review result" }, { status: 400 })
  }

  const saved = await createSavedReview(userId, {
    code: body.code,
    language: body.language as CodeLanguage,
    provider:
      typeof body.provider === "string" ? body.provider : result.source,
    title: typeof body.title === "string" ? body.title : undefined,
    result: {
      score: result.score,
      aiLikelihood: result.aiLikelihood,
      summary: result.summary,
      findings: result.findings as ReviewFinding[],
      revisedCode: result.revisedCode,
      analyzedAt:
        typeof result.analyzedAt === "string"
          ? result.analyzedAt
          : new Date().toISOString(),
      language: body.language as CodeLanguage,
      source: result.source,
    },
  })

  return NextResponse.json({ review: saved }, { status: 201 })
}
