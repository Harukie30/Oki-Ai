"use client"

import { useMemo, useState } from "react"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FindingCard } from "@/components/review/finding-card"
import type {
  FindingSeverity,
  ReviewFinding,
  ReviewResult,
} from "@/lib/review-types"
import { cn } from "@/lib/utils"

interface ReviewResultsProps {
  result: ReviewResult
}

const FILTERS: {
  value: "all" | FindingSeverity
  label: string
  styles: string
}[] = [
  {
    value: "all",
    label: "All",
    styles: "bg-teal-900/6 text-teal-950 border-teal-900/12",
  },
  {
    value: "critical",
    label: "Critical",
    styles: "bg-rose-500/12 text-rose-800 border-rose-500/20",
  },
  {
    value: "warning",
    label: "Warning",
    styles: "bg-amber-500/12 text-amber-900 border-amber-500/20",
  },
  {
    value: "info",
    label: "Info",
    styles: "bg-sky-500/12 text-sky-900 border-sky-500/20",
  },
  {
    value: "suggestion",
    label: "Tips",
    styles: "bg-teal-500/12 text-teal-900 border-teal-500/20",
  },
]

const cardClass =
  "min-w-0 rounded-xl border border-border/80 bg-white/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md sm:rounded-2xl sm:p-5"

export function ReviewSummaryCard({
  result,
  className,
}: {
  result: ReviewResult
  className?: string
}) {
  return (
    <section
      className={cn(
        cardClass,
        "animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
    >
      <div className="grid gap-5 sm:grid-cols-[120px_1fr] sm:gap-5">
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="relative grid size-[96px] place-items-center rounded-full sm:size-[108px]"
            style={{
              background: `conic-gradient(#0d9488 ${result.score * 3.6}deg, #e5e7eb 0deg)`,
            }}
          >
            <div className="grid size-[74px] place-items-center rounded-full bg-white text-center shadow-inner sm:size-[84px]">
              <div>
                <p
                  className="text-2xl font-semibold tabular-nums tracking-tight text-foreground animate-in zoom-in-50 duration-700 sm:text-3xl"
                  key={result.score}
                >
                  {result.score}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  score
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              Review summary
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {result.summary}
            </p>
          </div>

          <Progress value={result.aiLikelihood} className="w-full">
            <ProgressLabel>AI authorship likelihood</ProgressLabel>
            <ProgressValue />
          </Progress>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-wide">
              {result.language}
            </span>
            <span>{result.findings.length} findings</span>
            <span suppressHydrationWarning>
              {new Date(result.analyzedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FindingsCard({
  result,
  className,
  activeFindingId = null,
  onSelectFinding,
  onApplyFindingCode,
}: {
  result: ReviewResult
  className?: string
  activeFindingId?: string | null
  onSelectFinding?: (finding: ReviewFinding) => void
  onApplyFindingCode?: (finding: ReviewFinding) => void
}) {
  const [filter, setFilter] = useState<"all" | FindingSeverity>("all")

  const filtered = useMemo(() => {
    if (filter === "all") return result.findings
    return result.findings.filter((finding) => finding.severity === filter)
  }, [filter, result.findings])

  const filterCounts = useMemo(() => {
    const counts: Record<"all" | FindingSeverity, number> = {
      all: result.findings.length,
      critical: 0,
      warning: 0,
      info: 0,
      suggestion: 0,
    }
    for (const finding of result.findings) {
      counts[finding.severity] += 1
    }
    return counts
  }, [result.findings])

  return (
    <section
      className={cn(
        cardClass,
        "flex min-h-0 flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:80ms] fill-mode-both",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            Findings
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Jump to a line, or apply a local SuggestedCode snippet.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-teal-900/10 bg-teal-500/8 px-2.5 py-1 text-[11px] font-medium tabular-nums text-teal-900/70">
          {filtered.length}
          {filter !== "all" ? ` / ${result.findings.length}` : ""}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter findings">
        {FILTERS.map((item) => {
          const selected = filter === item.value
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(item.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-[opacity,background-color,box-shadow]",
                item.styles,
                selected
                  ? "opacity-100 shadow-sm ring-1 ring-teal-900/10"
                  : "opacity-55 hover:opacity-85"
              )}
            >
              {item.label}
              <span className="tabular-nums opacity-70">
                {filterCounts[item.value]}
              </span>
            </button>
          )
        })}
      </div>

      <ScrollArea className="h-[280px] pr-2 sm:h-[340px] sm:pr-3">
        <div className="flex flex-col gap-3 pb-2">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No findings in this filter.
            </p>
          ) : (
            filtered.map((finding, index) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                index={index}
                active={activeFindingId === finding.id}
                onSelect={onSelectFinding}
                onApplyCode={onApplyFindingCode}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </section>
  )
}

/** @deprecated Prefer composing ReviewSummaryCard + FindingsCard for layout control */
export function ReviewResults({ result }: ReviewResultsProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <ReviewSummaryCard result={result} />
      <FindingsCard result={result} />
    </div>
  )
}
