"use client"

import { Badge } from "@/components/ui/badge"
import type { ReviewFinding } from "@/lib/review-types"
import { cn } from "@/lib/utils"

const severityStyles: Record<
  ReviewFinding["severity"],
  { badge: string; border: string }
> = {
  critical: {
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    border: "border-l-rose-500",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
    border: "border-l-amber-500",
  },
  info: {
    badge: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    border: "border-l-sky-500",
  },
  suggestion: {
    badge: "bg-teal-500/15 text-teal-800 dark:text-teal-300",
    border: "border-l-teal-500",
  },
}

interface FindingCardProps {
  finding: ReviewFinding
  index: number
}

export function FindingCard({ finding, index }: FindingCardProps) {
  const styles = severityStyles[finding.severity]

  return (
    <article
      className={cn(
        "min-w-0 rounded-xl border border-border/70 border-l-4 bg-background/80 p-3 shadow-sm backdrop-blur-sm sm:p-4",
        "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500",
        styles.border
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge className={styles.badge} variant="secondary">
          {finding.severity}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {finding.category}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          line {finding.line}
        </span>
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {finding.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {finding.detail}
      </p>
      <p className="mt-3 rounded-lg bg-teal-500/8 px-3 py-2 text-sm text-teal-950 dark:text-teal-100">
        <span className="font-medium">Suggestion: </span>
        {finding.suggestion}
      </p>
    </article>
  )
}
