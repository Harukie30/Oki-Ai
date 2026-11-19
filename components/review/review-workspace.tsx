"use client"

import Image from "next/image"
import { useState, type ReactNode } from "react"
import { CodeDiffPanel } from "@/components/review/code-diff-panel"
import { CodeInput } from "@/components/review/code-input"
import { LanguagePicker } from "@/components/review/language-picker"
import { ProviderToggle } from "@/components/review/provider-toggle"
import { ReviewActions } from "@/components/review/review-actions"
import { ReviewErrorModal } from "@/components/review/review-error-modal"
import {
  FindingsCard,
  ReviewSummaryCard,
} from "@/components/review/review-results"
import { SuggestedFixIde } from "@/components/review/suggested-fix-ide"
import { runReview, type ReviewResponse } from "@/lib/run-review"
import type {
  CodeLanguage,
  ReviewFinding,
  ReviewProvider,
  ReviewStatus,
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

function AnalyzingBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-teal-700/15 bg-white/90 shadow-sm backdrop-blur-sm",
        compact ? "px-4 py-2" : "w-full max-w-md flex-col px-5 py-4 sm:flex-row"
      )}
    >
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400/70 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-teal-500" />
      </span>
      <div className={cn("min-w-0", !compact && "text-center sm:text-left")}>
        <p className="text-xs font-semibold text-teal-950">
          {compact ? "Review running — editors locked" : "Running review…"}
        </p>
        {!compact ? (
          <p className="mt-0.5 text-[11px] text-teal-900/55">
            Scoring quality, flagging risks, drafting SuggestedCode
          </p>
        ) : null}
      </div>
      {!compact ? (
        <div className="h-1 w-28 overflow-hidden rounded-full bg-teal-100 sm:ml-auto">
          <div className="h-full w-1/2 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-teal-300 via-teal-500 to-cyan-400" />
        </div>
      ) : null}
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

  const analyzing = status === "analyzing"
  const readyToReview = Boolean(language && code.trim())
  const hasResult = Boolean(result)
  const resultsStale =
    hasResult && !analyzing && status === "ready" && code !== reviewedCode
  const showCompare = hasResult && Boolean(result?.revisedCode)
  const showResults = hasResult

  function markCodeChanged(nextCode: string) {
    setCode(nextCode)
  }

  async function handleReview() {
    if (!language || !code.trim()) return

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
  }

  function handleChangeLanguageStep() {
    setStep("language")
    setStatus("idle")
    setError(null)
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
                  <AnalyzingBanner compact />
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
                <Panel>
                  <CodeInput
                    code={code}
                    language={language}
                    disabled={analyzing}
                    highlightLine={highlightLine}
                    onCodeChange={markCodeChanged}
                    onLanguageChange={(next) => {
                      setLanguage(next)
                      setResult(null)
                      setStatus("idle")
                      setActiveFindingId(null)
                      setHighlightLine(null)
                      setReviewedCode("")
                    }}
                    onChangeLanguageStep={handleChangeLanguageStep}
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
                      className="w-full max-w-sm"
                    />
                  </div>
                </div>
              </div>

              <ReviewActions
                analyzing={analyzing}
                disabled={!readyToReview}
                hasResult={showResults}
                stale={resultsStale}
                source={result?.source}
                selectedProvider={provider}
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

        {analyzing ? (
          <div className="mb-4">
            <AnalyzingBanner />
          </div>
        ) : null}

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
            <ReviewSummaryCard result={result} />
            <FindingsCard
              result={result}
              activeFindingId={activeFindingId}
              onSelectFinding={handleSelectFinding}
              onApplyFindingCode={handleApplyFindingCode}
            />
          </div>
        ) : (
          <div className="relative flex min-h-[200px] flex-col items-start justify-center overflow-hidden rounded-xl border border-dashed border-teal-700/20 bg-white/50 px-4 py-8 backdrop-blur-sm sm:min-h-[260px] sm:rounded-2xl sm:px-6 sm:py-10">
            {analyzing ? (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.18),transparent_55%)]"
                />
                <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/60">
                  scan · score · findings
                </p>
                <p className="relative mt-3 text-sm font-medium text-teal-900/85">
                  Building your review…
                </p>
                <p className="relative mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Checking bugs, security risks, and drafting a SuggestedCode
                  rewrite you can copy or apply.
                </p>
                <div className="relative mt-6 h-1 w-44 overflow-hidden rounded-full bg-teal-100">
                  <div className="absolute inset-y-0 w-1/2 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-teal-300 via-teal-500 to-cyan-400" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-teal-900/80">
                  {step === "language"
                    ? "Choose a language to begin"
                    : "Results will show up here"}
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {step === "language"
                    ? "Start with the language type, then paste your snippet in the editor."
                    : "Hit Review to compare code, open a Diff, and jump from findings to lines."}
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
