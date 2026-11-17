import type {
  CodeLanguage,
  FindingCategory,
  FindingSeverity,
  ReviewFinding,
  ReviewResult,
} from "@/lib/review-types"

const SEVERITIES: FindingSeverity[] = [
  "critical",
  "warning",
  "info",
  "suggestion",
]
const CATEGORIES: FindingCategory[] = [
  "bug",
  "security",
  "style",
  "performance",
]

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function normalizeSeverity(value: unknown): FindingSeverity {
  const raw = asString(value).toLowerCase()
  return SEVERITIES.includes(raw as FindingSeverity)
    ? (raw as FindingSeverity)
    : "info"
}

function normalizeCategory(value: unknown): FindingCategory {
  const raw = asString(value).toLowerCase()
  return CATEGORIES.includes(raw as FindingCategory)
    ? (raw as FindingCategory)
    : "bug"
}

export function normalizeReviewResult(
  raw: unknown,
  language: CodeLanguage
): ReviewResult {
  const data =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}

  const findingsRaw = Array.isArray(data.findings) ? data.findings : []
  const findings: ReviewFinding[] = findingsRaw.slice(0, 12).map((item, i) => {
    const row =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    return {
      id: asString(row.id, `finding-${i + 1}`),
      severity: normalizeSeverity(row.severity),
      category: normalizeCategory(row.category),
      line: Math.max(1, asNumber(row.line, 1)),
      title: asString(row.title, "Finding"),
      detail: asString(row.detail, "No detail provided."),
      suggestion: asString(row.suggestion, "No suggestion provided."),
    }
  })

  return {
    score: clamp(asNumber(data.score, 70), 0, 100),
    aiLikelihood: clamp(asNumber(data.aiLikelihood, 40), 0, 100),
    summary: asString(
      data.summary,
      findings.length
        ? "Review complete. Address the highest-severity findings first."
        : "No major issues detected in this snippet."
    ),
    findings,
    analyzedAt: new Date().toISOString(),
    language,
  }
}

export const REVIEW_JSON_SCHEMA_HINT = `{
  "score": number (0-100),
  "aiLikelihood": number (0-100),
  "summary": string,
  "findings": [
    {
      "id": string,
      "severity": "critical" | "warning" | "info" | "suggestion",
      "category": "bug" | "security" | "style" | "performance",
      "line": number,
      "title": string,
      "detail": string,
      "suggestion": string
    }
  ]
}`
