"use client"

import { useState } from "react"
import { CodeInput } from "@/components/review/code-input"
import { ReviewActions } from "@/components/review/review-actions"
import { ReviewResults } from "@/components/review/review-results"
import { DEFAULT_SAMPLE_CODE } from "@/lib/mock-review"
import { runReview, type ReviewResponse } from "@/lib/run-review"
import type { CodeLanguage, ReviewStatus } from "@/lib/review-types"

export function ReviewWorkspace() {
  const [code, setCode] = useState(DEFAULT_SAMPLE_CODE)
  const [language, setLanguage] = useState<CodeLanguage>("typescript")
  const [status, setStatus] = useState<ReviewStatus>("idle")
  const [result, setResult] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzing = status === "analyzing"

  async function handleReview() {
    setStatus("analyzing")
    setError(null)
    try {
      const next = await runReview({ code, language })
      setResult(next)
      setStatus("ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed")
      setStatus(result ? "ready" : "idle")
    }
  }

  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
      <div className="min-w-0 space-y-4">
        <CodeInput
          code={code}
          language={language}
          disabled={analyzing}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
        />
        <ReviewActions
          analyzing={analyzing}
          disabled={!code.trim()}
          source={result?.source}
          onReview={handleReview}
        />
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {result?.notice && status === "ready" ? (
          <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900/80">
            {result.notice}
          </p>
        ) : null}
      </div>

      <div className="min-h-[200px] min-w-0 sm:min-h-[280px]">
        {result && status === "ready" ? (
          <ReviewResults result={result} />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-start justify-center rounded-xl border border-dashed border-teal-700/20 bg-white/50 px-4 py-8 backdrop-blur-sm sm:min-h-[280px] sm:rounded-2xl sm:px-6 sm:py-10 lg:min-h-[420px]">
            <p className="text-sm font-medium text-teal-900/80">
              {analyzing ? "Running review…" : "Results appear here"}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {analyzing
                ? "Scoring quality, flagging risks, and estimating AI authorship signals."
                : "Paste code above, hit Review, and see score, findings, and suggestions."}
            </p>
            {analyzing ? (
              <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-teal-100">
                <div className="h-full w-1/2 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-teal-500" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
