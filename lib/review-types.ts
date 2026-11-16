export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "go"
  | "rust"

export type FindingSeverity = "critical" | "warning" | "info" | "suggestion"

export type FindingCategory = "bug" | "security" | "style" | "performance"

export interface ReviewRequest {
  code: string
  language: CodeLanguage
}

export interface ReviewFinding {
  id: string
  severity: FindingSeverity
  category: FindingCategory
  line: number
  title: string
  detail: string
  suggestion: string
}

export interface ReviewResult {
  score: number
  aiLikelihood: number
  summary: string
  findings: ReviewFinding[]
  analyzedAt: string
  language: CodeLanguage
}

export type ReviewStatus = "idle" | "analyzing" | "ready"

export const CODE_LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]
