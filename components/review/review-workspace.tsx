"use client"

import Image from "next/image"
import { useState, type ReactNode } from "react"
import { CodeInput } from "@/components/review/code-input"
import { LanguagePicker } from "@/components/review/language-picker"
import { ReviewActions } from "@/components/review/review-actions"
import { ReviewErrorModal } from "@/components/review/review-error-modal"
import {
  FindingsCard,
  ReviewSummaryCard,
} from "@/components/review/review-results"
import { SuggestedFixIde } from "@/components/review/suggested-fix-ide"
import { runReview, type ReviewResponse } from "@/lib/run-review"
import type { CodeLanguage, ReviewStatus } from "@/lib/review-types"
import { cn } from "@/lib/utils"

type WorkspaceStep = "language" | "paste"

function SectionLabel({
  step,
  title,
  detail,
}: {
  step: string
  title: string
  detail: string
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700/55">
          {step}
        </p>
        <h2 className="mt-1 text-sm font-semibold tracking-tight text-teal-950 sm:text-base">
          {title}
        </h2>
      </div>
      <p className="hidden max-w-xs text-right text-xs text-teal-950/45 sm:block">
        {detail}
      </p>
    </div>
  )
}

function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("min-w-0", className)}>{children}</div>
}

export function ReviewWorkspace() {
  const [step, setStep] = useState<WorkspaceStep>("language")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<CodeLanguage | null>(null)
  const [status, setStatus] = useState<ReviewStatus>("idle")
  const [result, setResult] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzing = status === "analyzing"
  const readyToReview = Boolean(language && code.trim())
  const reviewReady = Boolean(result && status === "ready")

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
    <div className="flex min-w-0 flex-col gap-8 sm:gap-10">
      <ReviewErrorModal
        open={Boolean(error)}
        message={error || ""}
        onClose={() => setError(null)}
        onRetry={() => {
          setError(null)
          void handleReview()
        }}
      />

      {/* 1. Write → 2. Suggested fix (side by side when ready) */}
      <section className="min-w-0">
        <SectionLabel
          step={reviewReady ? "Step 1 · Compare" : "Step 1 · Write"}
          title={
            reviewReady ? "Your code and the suggested fix" : "Paste your code"
          }
          detail={
            reviewReady
              ? "Read left to right: original first, then the improved version."
              : "Choose a language, paste a snippet, then run the review."
          }
        />

        {step === "language" || !language ? (
          <LanguagePicker onSelect={handleLanguageSelect} />
        ) : (
          <div className="space-y-4">
            <div
              className={cn(
                "grid min-w-0 items-center gap-4",
                reviewReady &&
                  "xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
              )}
            >
              <Panel>
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
              </Panel>

              {reviewReady && result?.revisedCode ? (
                <>
                  <div
                    aria-hidden
                    className="flex items-center justify-center py-1 xl:px-1 xl:py-0"
                  >
                    <Image
                      src="/brand/oki-ai-logo.png"
                      alt=""
                      width={120}
                      height={142}
                      className="h-14 w-auto opacity-70 sm:h-16 xl:h-20"
                    />
                  </div>
                  <Panel>
                    <SuggestedFixIde
                      code={result.revisedCode}
                      language={result.language}
                    />
                  </Panel>
                </>
              ) : null}
            </div>

            <ReviewActions
              analyzing={analyzing}
              disabled={!readyToReview}
              source={result?.source}
              onReview={handleReview}
            />

            {result?.notice && reviewReady ? (
              <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900/80">
                {result.notice}
              </p>
            ) : null}
          </div>
        )}
      </section>

      {/* 2. Analysis: summary then findings */}
      <section className="min-w-0">
        <SectionLabel
          step="Step 2 · Understand"
          title="Score and findings"
          detail="Start with the summary, then skim findings by severity."
        />

        {reviewReady && result ? (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-start">
            <ReviewSummaryCard result={result} />
            <FindingsCard result={result} />
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-start justify-center rounded-xl border border-dashed border-teal-700/20 bg-white/50 px-4 py-8 backdrop-blur-sm sm:min-h-[260px] sm:rounded-2xl sm:px-6 sm:py-10">
            <p className="text-sm font-medium text-teal-900/80">
              {analyzing
                ? "Running review…"
                : step === "language"
                  ? "Choose a language to begin"
                  : "Results will show up here"}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {analyzing
                ? "Scoring quality, flagging risks, and drafting a suggested fix you can copy."
                : step === "language"
                  ? "Start with the language type, then paste your snippet in the editor."
                  : "Hit Review to get a score, findings, and a suggested-fix editor side by side with your code."}
            </p>
            {analyzing ? (
              <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-teal-100">
                <div className="h-full w-1/2 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-teal-500" />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}
