import { runGeminiReview } from "@/lib/gemini-review"
import { runGroqReview } from "@/lib/groq-review"
import type {
  FindingSeverity,
  ReviewFinding,
  ReviewRequest,
  ReviewResult,
} from "@/lib/review-types"

const SEVERITY_RANK: Record<FindingSeverity, number> = {
  critical: 4,
  warning: 3,
  info: 2,
  suggestion: 1,
}

function findingKey(finding: ReviewFinding): string {
  return `${finding.line}|${finding.category}|${finding.title.toLowerCase()}`
}

function mergeFindings(
  first: ReviewFinding[],
  second: ReviewFinding[]
): ReviewFinding[] {
  const map = new Map<string, ReviewFinding>()

  for (const finding of [...first, ...second]) {
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
      suggestedCode: keep.suggestedCode || existing.suggestedCode || finding.suggestedCode,
    })
  }

  return Array.from(map.values())
    .sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || a.line - b.line
    )
    .slice(0, 10)
    .map((finding, index) => ({
      ...finding,
      id: finding.id || `auto-${index + 1}`,
    }))
}

function pickRevisedCode(a: string, b: string, original: string): string {
  const left = a.trim()
  const right = b.trim()
  if (left && !right) return left
  if (right && !left) return right
  if (!left && !right) return original
  // Prefer a real rewrite that still looks like the same language/snippet size.
  const leftDelta = Math.abs(left.length - original.length)
  const rightDelta = Math.abs(right.length - original.length)
  if (left === original && right !== original) return right
  if (right === original && left !== original) return left
  return leftDelta <= rightDelta ? left : right
}

export interface AutoReviewResult extends ReviewResult {
  notice: string
  contributors: Array<"groq" | "gemini">
}

/**
 * Auto mode: Groq + Gemini review together, then merge.
 * If one fails, the other still returns a usable review.
 */
export async function runAutoReview(
  request: ReviewRequest
): Promise<AutoReviewResult> {
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasGemini = Boolean(process.env.GEMINI_API_KEY)

  if (!hasGroq && !hasGemini) {
    throw new Error(
      "Auto mode needs GROQ_API_KEY and/or GEMINI_API_KEY configured in .env."
    )
  }

  const tasks: Array<Promise<{ id: "groq" | "gemini"; result: ReviewResult }>> =
    []

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

  const settled = await Promise.allSettled(tasks)
  const ok = settled.flatMap((item) =>
    item.status === "fulfilled" ? [item.value] : []
  )
  const errors = settled.flatMap((item) =>
    item.status === "rejected"
      ? [item.reason instanceof Error ? item.reason.message : String(item.reason)]
      : []
  )

  if (ok.length === 0) {
    throw new Error(
      errors[0] || "Auto review failed — both Gemini and Groq were unavailable."
    )
  }

  if (ok.length === 1) {
    const only = ok[0]
    const otherBusy =
      errors[0]?.toLowerCase().includes("503") ||
      errors[0]?.toLowerCase().includes("busy") ||
      errors[0]?.toLowerCase().includes("high demand")
    return {
      ...only.result,
      contributors: [only.id],
      notice: otherBusy
        ? `Auto used ${only.id === "groq" ? "Groq" : "Gemini"} — the other model was busy. Try Auto again in a moment.`
        : `Auto used ${only.id === "groq" ? "Groq" : "Gemini"} only — the other model didn’t finish.`,
    }
  }

  const [first, second] = ok
  const mergedFindings = mergeFindings(
    first.result.findings,
    second.result.findings
  )
  const score = Math.round((first.result.score + second.result.score) / 2)
  const aiLikelihood = Math.round(
    (first.result.aiLikelihood + second.result.aiLikelihood) / 2
  )
  const summary =
    first.result.summary.trim().length >= second.result.summary.trim().length
      ? first.result.summary
      : second.result.summary

  return {
    score,
    aiLikelihood,
    summary,
    findings: mergedFindings,
    revisedCode: pickRevisedCode(
      first.result.revisedCode,
      second.result.revisedCode,
      request.code
    ),
    analyzedAt: new Date().toISOString(),
    language: request.language,
    contributors: [first.id, second.id],
    notice:
      "Auto combined Groq + Gemini — findings were merged so both models could help catch issues.",
  }
}
