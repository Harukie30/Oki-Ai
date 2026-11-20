import type { ReviewRequest, ReviewResult } from "@/lib/review-types"

export type ReviewSource =
  | "auto"
  | "gemini"
  | "groq"
  | "openrouter"
  | "openai"
  | "mock"

export interface ReviewResponse extends ReviewResult {
  source?: ReviewSource
  notice?: string
}

export async function runReview(
  request: ReviewRequest
): Promise<ReviewResponse> {
  const response = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  const data = (await response.json().catch(() => null)) as
    | (ReviewResponse & { error?: string })
    | null

  if (!response.ok) {
    throw new Error(data?.error || `Review failed (${response.status})`)
  }

  if (!data || typeof data.score !== "number" || !Array.isArray(data.findings)) {
    throw new Error("Unexpected review response")
  }

  return data
}
