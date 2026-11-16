"use client"

import { useMemo, useState } from "react"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FindingCard } from "@/components/review/finding-card"
import type { FindingSeverity, ReviewResult } from "@/lib/review-types"
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

export function ReviewResults({ result }: ReviewResultsProps) {
  const [filter, setFilter] = useState<"all" | FindingSeverity>("all")

  const filtered = useMemo(() => {
    if (filter === "all") return result.findings
    return result.findings.filter((finding) => finding.severity === filter)
  }, [filter, result.findings])

  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-border/80 bg-white/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md sm:rounded-2xl sm:p-5",
        "animate-in fade-in slide-in-from-bottom-4 duration-700"
      )}
    >
      <div className="grid gap-5 sm:grid-cols-[140px_1fr] sm:gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="relative grid size-[100px] place-items-center rounded-full sm:size-[116px]"
            style={{
              background: `conic-gradient(#0d9488 ${result.score * 3.6}deg, #e5e7eb 0deg)`,
            }}
          >
            <div className="grid size-[78px] place-items-center rounded-full bg-white text-center shadow-inner sm:size-[92px]">
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

        <div className="min-w-0 space-y-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              Review results
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

      <Separator className="my-4 sm:my-5" />

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as "all" | FindingSeverity)}
      >
        <div className="mb-4 -mx-1 overflow-x-auto px-1">
          <TabsList className="inline-flex w-max min-w-full flex-nowrap sm:min-w-0 sm:flex-wrap">
            {FILTERS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={filter}>
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
