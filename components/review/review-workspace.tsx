"use client"

import { useState } from "react"
import { CodeInput } from "@/components/review/code-input"
import { LanguagePicker } from "@/components/review/language-picker"
import { ReviewActions } from "@/components/review/review-actions"
import { ReviewErrorModal } from "@/components/review/review-error-modal"
import { ReviewResults } from "@/components/review/review-results"
import { runReview, type ReviewResponse } from "@/lib/run-review"
import type { CodeLanguage, ReviewStatus } from "@/lib/review-types"

type WorkspaceStep = "language" | "paste"

export function ReviewWorkspace() {
  const [step, setStep] = useState<WorkspaceStep>("language")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<CodeLanguage | null>(null)
  const [status, setStatus] = useState<ReviewStatus>("idle")
  const [result, setResult] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzing = status === "analyzing"
  const readyToReview = Boolean(language && code.trim())

  async function handleReview() {
    if (!language || !code.trim()) return

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

  function handleLanguageSelect(nextLanguage: CodeLanguage) {
    setLanguage(nextLanguage)
    setStep("paste")
    setStatus("idle")
    setResult(null)
    setError(null)
  }

  function handleChangeLanguageStep() {
    setStep("language")
    setStatus("idle")
    setError(null)
  }

  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
      <ReviewErrorModal
        open={Boolean(error)}
        message={error || ""}
        onClose={() => setError(null)}
        onRetry={() => {
          setError(null)
          void handleReview()
        }}
      />

      <div className="min-w-0 space-y-4">
        {step === "language" || !language ? (
          <LanguagePicker onSelect={handleLanguageSelect} />
        ) : (
          <>
            <CodeInput
              code={code}
              language={language}
              disabled={analyzing}
              onCodeChange={setCode}
              onLanguageChange={(next) => {
                setLanguage(next)
                setResult(null)
                setStatus("idle")
              }}
              onChangeLanguageStep={handleChangeLanguageStep}
            />
            <ReviewActions
              analyzing={analyzing}
              disabled={!readyToReview}
              source={result?.source}
              onReview={handleReview}
            />
            {result?.notice && status === "ready" ? (
              <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900/80">
                {result.notice}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="min-h-[200px] min-w-0 sm:min-h-[280px]">
        {result && status === "ready" ? (
          <ReviewResults result={result} />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-start justify-center rounded-xl border border-dashed border-teal-700/20 bg-white/50 px-4 py-8 backdrop-blur-sm sm:min-h-[280px] sm:rounded-2xl sm:px-6 sm:py-10 lg:min-h-[420px]">
            <p className="text-sm font-medium text-teal-900/80">
              {analyzing
                ? "Running review…"
                : step === "language"
                  ? "Choose a language to begin"
                  : "Results appear here"}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {analyzing
                ? "Scoring quality, flagging risks, and estimating AI authorship signals."
                : step === "language"
                  ? "Start with the language type, then paste your snippet in the editor."
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
