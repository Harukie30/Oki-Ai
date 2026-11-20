import { runGeminiReview } from "@/lib/gemini-review"
import { runGroqReview } from "@/lib/groq-review"
import { runOpenRouterReview } from "@/lib/openrouter-review"
import type {
  FindingSeverity,
  ReviewFinding,
  ReviewRequest,
  ReviewResult,
} from "@/lib/review-types"

export type AutoContributor = "groq" | "gemini" | "openrouter"

const CONTRIBUTOR_LABEL: Record<AutoContributor, string> = {
  groq: "Groq",
  gemini: "Gemini",
  openrouter: "OpenRouter",
}

const SEVERITY_RANK: Record<FindingSeverity, number> = {
  critical: 4,
  warning: 3,
  info: 2,
  suggestion: 1,
}

function findingKey(finding: ReviewFinding): string {
  return `${finding.line}|${finding.category}|${finding.title.toLowerCase()}`
}

function mergeFindings(groups: ReviewFinding[][]): ReviewFinding[] {
  const map = new Map<string, ReviewFinding>()

  for (const finding of groups.flat()) {
    const key = findingKey(finding)
    const existing = map.get(key)
    if (!existing) {
      map.set(key, finding)
      continue
    }
    const keep =
      SEVERITY_RANK[finding.severity] > SEVERITY_RANK[existing.severity]
        ? finding
        : existing.detail.length >= finding.detail.length
          ? existing
          : finding
    map.set(key, {
      ...keep,
      suggestion:
        keep.suggestion.length >=
        (keep === existing ? finding.suggestion : existing.suggestion).length
          ? keep.suggestion
          : keep === existing
            ? finding.suggestion
            : existing.suggestion,
      suggestedCode:
        keep.suggestedCode || existing.suggestedCode || finding.suggestedCode,
    })
  }

  return Array.from(map.values())
    .sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || a.line - b.line
    )
    .slice(0, 12)
    .map((finding, index) => ({
      ...finding,
      id: finding.id || `auto-${index + 1}`,
    }))
}

function pickRevisedCode(candidates: string[], original: string): string {
  const usable = candidates.map((c) => c.trim()).filter(Boolean)
  if (usable.length === 0) return original

  const rewrites = usable.filter((c) => c !== original.trim())
  const pool = rewrites.length > 0 ? rewrites : usable

  return pool.reduce((best, current) => {
    const bestDelta = Math.abs(best.length - original.length)
    const currentDelta = Math.abs(current.length - original.length)
    return currentDelta < bestDelta ? current : best
  })
}

function labelList(ids: AutoContributor[]): string {
  return ids.map((id) => CONTRIBUTOR_LABEL[id]).join(" + ")
}

export interface AutoReviewResult extends ReviewResult {
  notice: string
  contributors: AutoContributor[]
}

/**
 * Auto mode: Gemini + Groq + OpenRouter (whichever keys exist) in parallel, then merge.
 * If some fail, successful providers still return a usable review.
 */
export async function runAutoReview(
  request: ReviewRequest
): Promise<AutoReviewResult> {
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasGemini = Boolean(process.env.GEMINI_API_KEY)
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY)

  if (!hasGroq && !hasGemini && !hasOpenRouter) {
    throw new Error(
      "Auto mode needs GROQ_API_KEY, GEMINI_API_KEY, and/or OPENROUTER_API_KEY configured in .env."
    )
  }

  const tasks: Array<
    Promise<{ id: AutoContributor; result: ReviewResult }>
  > = []

  if (hasGroq) {
    tasks.push(
      runGroqReview(request).then((result) => ({ id: "groq" as const, result }))
    )
  }
  if (hasGemini) {
    tasks.push(
      runGeminiReview(request).then((result) => ({
        id: "gemini" as const,
        result,
      }))
    )
  }
  if (hasOpenRouter) {
    tasks.push(
      runOpenRouterReview(request).then((result) => ({
        id: "openrouter" as const,
        result,
      }))
    )
  }

  const settled = await Promise.allSettled(tasks)
  const ok = settled.flatMap((item) =>
    item.status === "fulfilled" ? [item.value] : []
  )
  const errors = settled.flatMap((item) =>
    item.status === "rejected"
      ? [
          item.reason instanceof Error
            ? item.reason.message
            : String(item.reason),
        ]
      : []
  )

  if (ok.length === 0) {
    throw new Error(
      errors[0] ||
        "Auto review failed — Gemini, Groq, and OpenRouter were unavailable."
    )
  }

  const contributors = ok.map((item) => item.id)
  const configuredCount = tasks.length

  if (ok.length === 1) {
    const only = ok[0]
    const otherBusy = errors.some((message) => {
      const lower = message.toLowerCase()
      return (
        lower.includes("503") ||
        lower.includes("busy") ||
        lower.includes("high demand") ||
        lower.includes("429") ||
        lower.includes("rate limit")
      )
    })
    return {
      ...only.result,
      contributors,
      notice:
        configuredCount === 1
          ? `Auto used ${CONTRIBUTOR_LABEL[only.id]} — only one provider key is configured.`
          : otherBusy
            ? `Auto used ${CONTRIBUTOR_LABEL[only.id]} — the other model(s) were busy. Try Auto again in a moment.`
            : `Auto used ${CONTRIBUTOR_LABEL[only.id]} only — the other model(s) didn’t finish.`,
    }
  }

  const score = Math.round(
    ok.reduce((sum, item) => sum + item.result.score, 0) / ok.length
  )
  const aiLikelihood = Math.round(
    ok.reduce((sum, item) => sum + item.result.aiLikelihood, 0) / ok.length
  )
  const summary = ok
    .map((item) => item.result.summary.trim())
    .sort((a, b) => b.length - a.length)[0]

  const partial =
    ok.length < configuredCount
      ? ` (${ok.length} of ${configuredCount} providers finished)`
      : ""

  return {
    score,
    aiLikelihood,
    summary,
    findings: mergeFindings(ok.map((item) => item.result.findings)),
    revisedCode: pickRevisedCode(
      ok.map((item) => item.result.revisedCode),
      request.code
    ),
    analyzedAt: new Date().toISOString(),
    language: request.language,
    contributors,
    notice: `Auto combined ${labelList(contributors)}${partial} — findings were merged so each model could help catch issues.`,
  }
}
