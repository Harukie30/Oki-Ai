"use client"

import { useMemo, useState } from "react"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const FILTERS: { value: "all" | FindingSeverity; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
  { value: "suggestion", label: "Tips" },
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
}: {
  result: ReviewResult
  className?: string
  activeFindingId?: string | null
  onSelectFinding?: (finding: ReviewFinding) => void
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
            Click a finding to jump to that line in your code.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-teal-900/10 bg-teal-500/8 px-2.5 py-1 text-[11px] font-medium tabular-nums text-teal-900/70">
          {filtered.length}
          {filter !== "all" ? ` / ${result.findings.length}` : ""}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["critical", "Critical", "bg-rose-500/12 text-rose-800 border-rose-500/20"],
            ["warning", "Warning", "bg-amber-500/12 text-amber-900 border-amber-500/20"],
            ["info", "Info", "bg-sky-500/12 text-sky-900 border-sky-500/20"],
            ["suggestion", "Tips", "bg-teal-500/12 text-teal-900 border-teal-500/20"],
          ] as const
        ).map(([key, label, styles]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-opacity",
              styles,
              filter !== "all" && filter !== key && "opacity-45"
            )}
          >
            {label}
            <span className="tabular-nums opacity-70">{filterCounts[key]}</span>
          </button>
        ))}
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as "all" | FindingSeverity)}
      >
        <div className="mb-4 -mx-1 overflow-x-auto px-1">
          <TabsList className="inline-flex w-max min-w-full flex-nowrap gap-1 sm:min-w-0 sm:flex-wrap">
            {FILTERS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                <span className="ml-1.5 tabular-nums opacity-60">
                  {filterCounts[item.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={filter} className="min-h-0 flex-1">
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
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
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
