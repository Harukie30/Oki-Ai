import { diffLines } from "@/lib/line-diff"
import type {
  FindingCategory,
  FindingSeverity,
  ReviewFinding,
  ReviewResult,
} from "@/lib/review-types"

export interface CodeCompareMetrics {
  beforeLines: number
  afterLines: number
  added: number
  removed: number
  hasRevisedCode: boolean
}

export interface SeverityCount {
  key: FindingSeverity
  label: string
  count: number
}

export interface CategoryCount {
  key: FindingCategory
  label: string
  count: number
}

export interface ReviewAnalyticsMetrics {
  compare: CodeCompareMetrics
  severity: SeverityCount[]
  category: CategoryCount[]
  findingTotal: number
}

function countLines(code: string): number {
  if (!code) return 0
  return code.replace(/\r\n/g, "\n").split("\n").length
}

export function getCodeCompareMetrics(
  before: string,
  after: string
): CodeCompareMetrics {
  const revised = after.trim().length > 0
  const rows = revised ? diffLines(before, after) : []
  let added = 0
  let removed = 0
  for (const row of rows) {
    if (row.kind === "add") added += 1
    if (row.kind === "remove") removed += 1
  }

  return {
    beforeLines: countLines(before),
    afterLines: revised ? countLines(after) : 0,
    added,
    removed,
    hasRevisedCode: revised,
  }
}

export function getSeverityCounts(findings: ReviewFinding[]): SeverityCount[] {
  const counts: Record<FindingSeverity, number> = {
    critical: 0,
    warning: 0,
    info: 0,
    suggestion: 0,
  }
  for (const finding of findings) {
    counts[finding.severity] += 1
  }

  return [
    { key: "critical", label: "Critical", count: counts.critical },
    { key: "warning", label: "Warning", count: counts.warning },
    { key: "info", label: "Info", count: counts.info },
    { key: "suggestion", label: "Tips", count: counts.suggestion },
  ]
}

export function getCategoryCounts(findings: ReviewFinding[]): CategoryCount[] {
  const counts: Record<FindingCategory, number> = {
    bug: 0,
    security: 0,
    style: 0,
    performance: 0,
  }
  for (const finding of findings) {
    counts[finding.category] += 1
  }

  return [
    { key: "bug", label: "Bug", count: counts.bug },
    { key: "security", label: "Security", count: counts.security },
    { key: "style", label: "Style", count: counts.style },
    { key: "performance", label: "Performance", count: counts.performance },
  ]
}

export function getReviewAnalyticsMetrics(
  result: ReviewResult,
  baselineCode: string
): ReviewAnalyticsMetrics {
  return {
    compare: getCodeCompareMetrics(baselineCode, result.revisedCode ?? ""),
    severity: getSeverityCounts(result.findings),
    category: getCategoryCounts(result.findings),
    findingTotal: result.findings.length,
  }
}
