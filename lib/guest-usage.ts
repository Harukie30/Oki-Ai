export const GUEST_REVIEW_LIMIT = 3
export const GUEST_REVIEW_STORAGE_KEY = "oki-guest-reviews"

function readCount(): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = window.localStorage.getItem(GUEST_REVIEW_STORAGE_KEY)
    const parsed = Number.parseInt(raw ?? "0", 10)
    if (!Number.isFinite(parsed) || parsed < 0) return 0
    return Math.min(parsed, GUEST_REVIEW_LIMIT)
  } catch {
    return 0
  }
}

export function getGuestReviewCount(): number {
  return readCount()
}

export function getGuestReviewsRemaining(): number {
  return Math.max(0, GUEST_REVIEW_LIMIT - readCount())
}

export function canGuestReview(): boolean {
  return readCount() < GUEST_REVIEW_LIMIT
}

export function incrementGuestReviewCount(): number {
  if (typeof window === "undefined") return 0
  const next = Math.min(readCount() + 1, GUEST_REVIEW_LIMIT)
  try {
    window.localStorage.setItem(GUEST_REVIEW_STORAGE_KEY, String(next))
  } catch {
    // ignore quota / private mode
  }
  return next
}
