import type { CodeLanguage } from "@/lib/review-types"
import type { ReviewResponse } from "@/lib/run-review"
import type {
  SavedReviewDetail,
  SavedReviewListItem,
} from "@/lib/saved-review-types"

async function parseJson<T>(response: Response): Promise<T & { error?: string }> {
  return (await response.json().catch(() => ({}))) as T & { error?: string }
}

export async function saveReviewToAccount(input: {
  code: string
  language: CodeLanguage
  provider?: string
  result: ReviewResponse
}): Promise<SavedReviewDetail> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ review?: SavedReviewDetail }>(response)
  if (!response.ok || !data.review) {
    throw new Error(data.error || `Save failed (${response.status})`)
  }
  return data.review
}

export async function fetchSavedReviews(): Promise<SavedReviewListItem[]> {
  const response = await fetch("/api/reviews")
  const data = await parseJson<{ reviews?: SavedReviewListItem[] }>(response)
  if (!response.ok) {
    throw new Error(data.error || `Load failed (${response.status})`)
  }
  return data.reviews ?? []
}

export async function fetchSavedReview(
  id: string
): Promise<SavedReviewDetail> {
  const response = await fetch(`/api/reviews/${id}`)
  const data = await parseJson<{ review?: SavedReviewDetail }>(response)
  if (!response.ok || !data.review) {
    throw new Error(data.error || `Load failed (${response.status})`)
  }
  return data.review
}

export async function deleteSavedReview(id: string): Promise<void> {
  const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
  const data = await parseJson<{ ok?: boolean }>(response)
  if (!response.ok) {
    throw new Error(data.error || `Delete failed (${response.status})`)
  }
}
