"use client"

import Image from "next/image"
import { useEffect, useState, type ReactNode } from "react"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { CodeDiffPanel } from "@/components/review/code-diff-panel"
import { CodeInput } from "@/components/review/code-input"
import { LanguagePicker } from "@/components/review/language-picker"
import { ProviderToggle } from "@/components/review/provider-toggle"
import { ReviewActions } from "@/components/review/review-actions"
import { ReviewAnalytics } from "@/components/review/review-analytics"
import { ReviewErrorModal } from "@/components/review/review-error-modal"
import { ReviewLineLimitModal } from "@/components/review/review-line-limit-modal"
import { ReviewLineLimitNotice } from "@/components/review/review-line-limit-notice"
import { ReviewRegisterModal } from "@/components/review/review-register-modal"
import { ReviewSaveReminderModal } from "@/components/review/review-save-reminder-modal"
import {
  GUEST_REVIEW_LIMIT,
  canGuestReview,
  getGuestReviewsRemaining,
  incrementGuestReviewCount,
} from "@/lib/guest-usage"
import {
  FindingsCard,
  ReviewSummaryCard,
} from "@/components/review/review-results"
import { SuggestedFixIde } from "@/components/review/suggested-fix-ide"
import { getReviewExample } from "@/lib/review-examples"
import { runReview, type ReviewResponse } from "@/lib/run-review"
import {
  REVIEW_MAX_LINES,
  clampCodeToMaxLines,
  countCodeLines,
  type CodeLanguage,
  type ReviewFinding,
  type ReviewProvider,
  type ReviewStatus,
} from "@/lib/review-types"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"

type WorkspaceStep = "language" | "paste"
type CompareMode = "editors" | "diff"

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

function AnalyzingBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-teal-700/15 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400/70 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-teal-500" />
      </span>
      <p className="text-xs font-semibold text-teal-950">
        Review running — editors locked
      </p>
    </div>
  )
}

function ResultsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-start"
    >
      <section className="min-w-0 rounded-xl border border-border/80 bg-white/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md sm:rounded-2xl sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[120px_1fr] sm:gap-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative grid size-[96px] place-items-center rounded-full bg-teal-900/5 sm:size-[108px]">
              <div className="size-[74px] animate-pulse rounded-full bg-teal-900/[0.06] sm:size-[84px]" />
            </div>
            <div className="h-4 w-14 animate-pulse rounded-full bg-teal-900/8" />
          </div>
          <div className="min-w-0 space-y-3">
            <div className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-teal-900/10" />
              <div className="h-3 w-full max-w-sm animate-pulse rounded bg-teal-900/6" />
              <div className="h-3 w-4/5 max-w-xs animate-pulse rounded bg-teal-900/5" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-teal-900/8" />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-5 w-14 animate-pulse rounded-full bg-teal-900/6"
                />
              ))}
            </div>
            <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
              scan · score · findings
            </p>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-border/80 bg-white/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md sm:rounded-2xl sm:p-5">
        <div className="mb-4 space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-teal-900/10" />
          <div className="h-3 w-56 animate-pulse rounded bg-teal-900/6" />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-6 w-16 animate-pulse rounded-full bg-teal-900/6"
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-border/60 border-l-4 border-l-teal-400/35 bg-background/60 p-3 sm:p-4"
              style={{ animationDelay: `${n * 80}ms` }}
            >
              <div className="mb-2 h-3.5 w-3/5 animate-pulse rounded bg-teal-900/10" />
              <div className="mb-2 flex gap-1.5">
                <div className="h-5 w-14 animate-pulse rounded-full bg-teal-900/8" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-teal-900/6" />
              </div>
              <div className="h-3 w-full animate-pulse rounded bg-teal-900/5" />
              <div className="mt-1.5 h-3 w-4/5 animate-pulse rounded bg-teal-900/5" />
            </div>
          ))}
        </div>
        <span className="sr-only">Building your review</span>
      </section>
    </div>
  )
}

function ResultsEmptyState({
  step,
}: {
  step: WorkspaceStep
}) {
  const choosing = step === "language"

  return (
    <div className="relative flex min-h-[200px] flex-col items-start justify-center overflow-hidden rounded-xl border border-teal-700/15 bg-white/60 px-4 py-8 backdrop-blur-sm sm:min-h-[260px] sm:rounded-2xl sm:px-6 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.2),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(14,116,144,0.1),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,80,90,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,80,90,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_78%)]"
      />
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
        Step 2 · Understand
      </p>
      <p className="relative mt-3 text-sm font-medium text-teal-900/85">
        {choosing ? "Choose a language to begin" : "Results will show up here"}
      </p>
      <p className="relative mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {choosing
          ? "Start with the language type, then paste your snippet in the editor."
          : "Hit Review to compare code, open a Diff, and jump from findings to lines."}
      </p>
    </div>
  )
}

export function ReviewWorkspace() {
  const [step, setStep] = useState<WorkspaceStep>("language")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<CodeLanguage | null>(null)
  const [provider, setProvider] = useState<ReviewProvider>("auto")
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [status, setStatus] = useState<ReviewStatus>("idle")
  const [result, setResult] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState<CompareMode>("editors")
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null)
  const [highlightLine, setHighlightLine] = useState<number | null>(null)
  const [baselineCode, setBaselineCode] = useState("")
  const [reviewedCode, setReviewedCode] = useState("")
  const [lineLimitAcknowledged, setLineLimitAcknowledged] = useState(false)
  const [lineLimitWarning, setLineLimitWarning] = useState<{
    open: boolean
    attemptedLines: number
  }>({ open: false, attemptedLines: 0 })
  const [saveReminderOpen, setSaveReminderOpen] = useState(false)
  const [codePreserved, setCodePreserved] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [guestRemaining, setGuestRemaining] = useState(GUEST_REVIEW_LIMIT)

  const { isSignedIn, isLoaded: authLoaded } = useOkiAuth()
  const isGuest = authLoaded && !isSignedIn

  const analyzing = status === "analyzing"
  const codeLineCount = countCodeLines(code)
  const overLineLimit = codeLineCount > REVIEW_MAX_LINES
  const readyToReview = Boolean(
    language && code.trim() && !overLineLimit && codeLineCount <= REVIEW_MAX_LINES
  )
  const hasResult = Boolean(result)
  const resultsStale =
    hasResult && !analyzing && status === "ready" && code !== reviewedCode
  const showCompare = hasResult && Boolean(result?.revisedCode)
  const showResults = hasResult
  const warnOnLeave = hasResult && !codePreserved

  useEffect(() => {
    if (!warnOnLeave) return

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [warnOnLeave])

  useEffect(() => {
    setGuestRemaining(getGuestReviewsRemaining())
  }, [isSignedIn])

  function markCodeChanged(nextCode: string) {
    const attemptedLines = countCodeLines(nextCode)
    if (attemptedLines > REVIEW_MAX_LINES) {
      setLineLimitWarning({ open: true, attemptedLines })
      setCode(clampCodeToMaxLines(nextCode, REVIEW_MAX_LINES))
      return
    }
    setCode(nextCode)
  }

  function handleLineLimitExceeded(info: {
    attemptedLines: number
    keptLines: number
  }) {
    setLineLimitWarning({
      open: true,
      attemptedLines: info.attemptedLines,
    })
  }

  async function handleReview() {
    if (!language || !code.trim()) return
    if (countCodeLines(code) > REVIEW_MAX_LINES) {
      setError(
        `Code is limited to ${REVIEW_MAX_LINES} lines per review. Shorten the snippet and try again.`
      )
      return
    }

    if (isGuest && !canGuestReview()) {
      setRegisterOpen(true)
      return
    }

    setStatus("analyzing")
    setError(null)
    setActiveFindingId(null)
    setHighlightLine(null)
    document
      .getElementById("review-understand")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })

    try {
      const next = await runReview({ code, language, provider })
      setResult(next)
      setBaselineCode(code)
      setReviewedCode(code)
      setStatus("ready")
      setCompareMode("editors")
      setCodePreserved(false)
      setSaveReminderOpen(true)
      if (isGuest) {
        incrementGuestReviewCount()
        setGuestRemaining(getGuestReviewsRemaining())
      }
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
    setActiveFindingId(null)
    setHighlightLine(null)
    setReviewedCode("")
    setLineLimitAcknowledged(false)
    setCodePreserved(false)
  }

  function handleChangeLanguageStep() {
    setStep("language")
    setStatus("idle")
    setError(null)
    setLineLimitAcknowledged(false)
  }

  function handleLoadExample() {
    if (!language) return
    markCodeChanged(getReviewExample(language))
    setActiveFindingId(null)
    setHighlightLine(null)
  }

  function handleApplySuggestedCode() {
    if (!result?.revisedCode) return
    markCodeChanged(result.revisedCode)
    setActiveFindingId(null)
    setHighlightLine(null)
  }

  function handleApplyFindingCode(finding: ReviewFinding) {
    const snippet = finding.suggestedCode?.trim()
    if (!snippet) return

    const lines = code.split("\n")
    const start = Math.max(0, Math.min(lines.length - 1, finding.line - 1))
    const replacement = snippet.split("\n")
    const next = [
      ...lines.slice(0, start),
      ...replacement,
      ...lines.slice(start + 1),
    ]
    markCodeChanged(next.join("\n"))
    setActiveFindingId(finding.id)
    setHighlightLine(start + 1)
    setCompareMode("editors")
    document
      .getElementById("review-compare")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleSelectFinding(finding: ReviewFinding) {
    setActiveFindingId(finding.id)
    setHighlightLine(finding.line)
    setCompareMode("editors")
    document
      .getElementById("review-compare")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
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

      <ReviewLineLimitModal
        open={lineLimitWarning.open}
        attemptedLines={lineLimitWarning.attemptedLines}
        onClose={() =>
          setLineLimitWarning((current) => ({ ...current, open: false }))
        }
      />

      <ReviewSaveReminderModal
        open={saveReminderOpen}
        onClose={() => setSaveReminderOpen(false)}
      />

      <ReviewRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />

      <section id="review-compare" className="relative min-w-0 scroll-mt-24">
        <SectionLabel
          step={showCompare ? "Step 1 · Compare" : "Step 1 · Write"}
          title={
            showCompare
              ? "Your code and the suggested fix"
              : "Paste your code"
          }
          detail={
            showCompare
              ? "Apply SuggestedCode, or open Diff to see what changed."
              : "Choose a language, paste a snippet, then run the review."
          }
        />

        {step === "language" || !language ? (
          <LanguagePicker onSelect={handleLanguageSelect} />
        ) : (
          <div className="relative space-y-4">
            {analyzing ? (
              <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-[#f4fbfa]/60 backdrop-blur-[1.5px]">
                <div className="sticky top-24 mx-auto mt-10 w-fit">
                  <AnalyzingBanner />
                </div>
              </div>
            ) : null}

            {showCompare ? (
              <div className="inline-flex rounded-xl border border-teal-900/10 bg-white/60 p-1 backdrop-blur-sm">
                {(
                  [
                    ["editors", "Editors"],
                    ["diff", "Diff"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCompareMode(mode)}
                    disabled={analyzing}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                      compareMode === mode
                        ? "bg-teal-700 text-white"
                        : "text-teal-900/60 hover:bg-teal-900/5 hover:text-teal-950"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {showCompare && compareMode === "diff" && result?.revisedCode ? (
              <CodeDiffPanel before={baselineCode} after={result.revisedCode} />
            ) : (
              <div
                className={cn(
                  "grid min-w-0 items-center gap-4",
                  showCompare && "xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
                )}
              >
                <Panel className="relative">
                  <CodeInput
                    code={code}
                    language={language}
                    disabled={analyzing || !lineLimitAcknowledged}
                    highlightLine={highlightLine}
                    onCodeChange={markCodeChanged}
                    onLineLimitExceeded={handleLineLimitExceeded}
                    onLoadExample={handleLoadExample}
                    onPreserved={() => setCodePreserved(true)}
                    onLanguageChange={(next) => {
                      setLanguage(next)
                      setResult(null)
                      setStatus("idle")
                      setActiveFindingId(null)
                      setHighlightLine(null)
                      setReviewedCode("")
                      setCodePreserved(false)
                    }}
                    onChangeLanguageStep={handleChangeLanguageStep}
                  />
                  <ReviewLineLimitNotice
                    open={!lineLimitAcknowledged && !analyzing}
                    onDismiss={() => setLineLimitAcknowledged(true)}
                  />
                </Panel>

                {showCompare && result?.revisedCode ? (
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
                        onApply={handleApplySuggestedCode}
                        onPreserved={() => setCodePreserved(true)}
                      />
                    </Panel>
                  </>
                ) : null}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-expanded={optionsOpen}
                  aria-controls="review-options-panel"
                  disabled={analyzing}
                  onClick={() => setOptionsOpen((open) => !open)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-teal-900/10 bg-white/80 px-2.5 py-1.5",
                    "text-[11px] font-medium text-teal-900/70 shadow-sm backdrop-blur-sm",
                    "transition-[background-color,color,box-shadow] duration-200",
                    "hover:bg-teal-50 hover:text-teal-950",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    optionsOpen && "border-teal-500/25 bg-teal-50 text-teal-900"
                  )}
                >
                  <HugeiconsIcon
                    icon={Settings02Icon}
                    strokeWidth={1.75}
                    className="size-3.5"
                  />
                  <span>
                    {provider === "auto"
                      ? "Auto"
                      : provider === "groq"
                        ? "Groq"
                        : provider === "openrouter"
                          ? "OpenRouter"
                          : "Gemini"}
                  </span>
                  <HugeiconsIcon
                    icon={optionsOpen ? ArrowUp01Icon : ArrowDown01Icon}
                    strokeWidth={1.75}
                    className="size-3.5 opacity-60"
                  />
                </button>

                {result?.notice && showResults && !analyzing ? (
                  <p className="max-w-full truncate rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] text-amber-900/75 sm:max-w-md">
                    {result.notice}
                  </p>
                ) : null}
              </div>

              <div
                id="review-options-panel"
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  optionsOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="pb-1">
                    <ProviderToggle
                      value={provider}
                      disabled={analyzing}
                      onChange={setProvider}
                      className="w-full max-w-xl"
                    />
                  </div>
                </div>
              </div>

              <ReviewActions
                analyzing={analyzing}
                disabled={!readyToReview || !authLoaded}
                hasResult={showResults}
                stale={resultsStale}
                source={result?.source}
                selectedProvider={provider}
                guestRemaining={isGuest ? guestRemaining : null}
                guestLimit={GUEST_REVIEW_LIMIT}
                onReview={handleReview}
              />
            </div>
          </div>
        )}
      </section>

      <section id="review-understand" className="min-w-0 scroll-mt-24">
        <SectionLabel
          step="Step 2 · Understand"
          title="Score and findings"
          detail="Filter by severity, jump to a line, or apply a local snippet."
        />

        {resultsStale && result ? (
          <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950/85">
            Findings below are from the previous review. Hit{" "}
            <span className="font-semibold">Re-review</span> after your edits.
          </div>
        ) : null}

        {showResults && result ? (
          <div
            className={cn(
              "grid min-w-0 gap-4 transition-[opacity,filter] duration-300 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-start",
              (resultsStale || analyzing) && "opacity-70",
              analyzing && "pointer-events-none saturate-75"
            )}
          >
            <ReviewSummaryCard result={result} source={result.source} />
            <FindingsCard
              result={result}
              activeFindingId={activeFindingId}
              onSelectFinding={handleSelectFinding}
              onApplyFindingCode={handleApplyFindingCode}
            />
          </div>
        ) : analyzing ? (
          <ResultsSkeleton />
        ) : (
          <ResultsEmptyState step={step} />
        )}
      </section>

      {showResults && result ? (
        <section id="review-analytics" className="min-w-0 scroll-mt-24">
          <SectionLabel
            step="Step 3 · Analytics"
            title="Code and finding charts"
            detail="Compare your snippet to SuggestedCode, then see severity and category mix."
          />
          <div
            className={cn(
              "transition-[opacity,filter] duration-300",
              (resultsStale || analyzing) && "opacity-70",
              analyzing && "pointer-events-none saturate-75"
            )}
          >
            <ReviewAnalytics result={result} baselineCode={baselineCode} />
          </div>
        </section>
      ) : null}
    </div>
  )
}
