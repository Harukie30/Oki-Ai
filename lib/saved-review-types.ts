import type {
  CodeLanguage,
  ReviewFinding,
  ReviewResult,
} from "@/lib/review-types"
import type { ReviewSource } from "@/lib/run-review"

export type SavedReviewListItem = {
  id: string
  title: string
  language: string
  provider: string
  score: number
  summary: string
  analyzedAt: string
  createdAt: string
}

export type SavedReviewDetail = SavedReviewListItem & {
  code: string
  revisedCode: string
  aiLikelihood: number
  findings: ReviewFinding[]
  result: ReviewResult & { source?: ReviewSource; language: CodeLanguage }
}
