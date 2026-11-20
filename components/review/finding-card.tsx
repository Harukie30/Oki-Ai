"use client"

import { useEffect, useState, type MouseEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import type { ReviewFinding } from "@/lib/review-types"
import { cn } from "@/lib/utils"

const severityStyles: Record<
  ReviewFinding["severity"],
  { badge: string; border: string; active: string }
> = {
  critical: {
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    border: "border-l-rose-500",
    active: "ring-rose-400/40",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
    border: "border-l-amber-500",
    active: "ring-amber-400/40",
  },
  info: {
    badge: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    border: "border-l-sky-500",
    active: "ring-sky-400/40",
  },
  suggestion: {
    badge: "bg-teal-500/15 text-teal-800 dark:text-teal-300",
    border: "border-l-teal-500",
    active: "ring-teal-400/40",
  },
}

interface FindingCardProps {
  finding: ReviewFinding
  index: number
  active?: boolean
  onSelect?: (finding: ReviewFinding) => void
  onApplyCode?: (finding: ReviewFinding) => void
}

export function FindingCard({
  finding,
  index,
  active = false,
  onSelect,
  onApplyCode,
}: FindingCardProps) {
  const styles = severityStyles[finding.severity]
  const interactive = Boolean(onSelect)
  const snippet = finding.suggestedCode?.trim() ?? ""
  const hasSnippet = Boolean(snippet)
  const [applied, setApplied] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setApplied(false)
    setCopied(false)
  }, [finding.id, finding.suggestedCode])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  function handleApply(event: MouseEvent) {
    event.stopPropagation()
    if (!snippet || !onApplyCode) return
    onApplyCode(finding)
    setApplied(true)
    window.setTimeout(() => setApplied(false), 1600)
  }

  async function handleCopy(event: MouseEvent) {
    event.stopPropagation()
    if (!snippet) return
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.(finding) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect?.(finding)
              }
            }
          : undefined
      }
      className={cn(
        "min-w-0 rounded-xl border border-border/70 border-l-4 bg-background/80 p-3 shadow-sm backdrop-blur-sm sm:p-4",
        "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500",
        styles.border,
        interactive &&
          "cursor-pointer transition-[box-shadow,transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-background",
        active && cn("ring-2", styles.active)
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {finding.title}
        </h3>
        {interactive ? (
          <span className="shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-wide text-teal-700/50">
            Jump
          </span>
        ) : null}
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge className={styles.badge} variant="secondary">
          {finding.severity}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {finding.category}
        </Badge>
        <span className="font-mono text-[11px] text-muted-foreground">
          line {finding.line}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {finding.detail}
      </p>
      <p className="mt-3 rounded-lg bg-teal-500/8 px-3 py-2 text-sm text-teal-950 dark:text-teal-100">
        <span className="font-medium">Suggestion: </span>
        {finding.suggestion}
      </p>

      {hasSnippet ? (
        <div
          className="mt-3 overflow-hidden rounded-lg border border-teal-900/10 bg-[#0c1214] [color-scheme:dark]"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300/65">
              SuggestedCode
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(event) => void handleCopy(event)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                  copied
                    ? "border-teal-400/40 bg-teal-400/15 text-teal-100"
                    : "border-white/10 bg-white/5 text-teal-100/80 hover:border-teal-400/30 hover:bg-teal-400/10"
                )}
              >
                <HugeiconsIcon
                  icon={copied ? Tick02Icon : Copy01Icon}
                  strokeWidth={1.75}
                  className="size-3"
                />
                {copied ? "Copied" : "Copy"}
              </button>
              {onApplyCode ? (
                <button
                  type="button"
                  onClick={handleApply}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                    applied
                      ? "border-teal-400/40 bg-teal-400/15 text-teal-100"
                      : "border-teal-400/30 bg-teal-400/10 text-teal-100 hover:bg-teal-400/20"
                  )}
                >
                  <HugeiconsIcon
                    icon={applied ? Tick02Icon : ArrowLeft01Icon}
                    strokeWidth={1.75}
                    className="size-3"
                  />
                  {applied ? "Applied" : "Apply"}
                </button>
              ) : null}
            </div>
          </div>
          <pre className="max-h-28 overflow-auto px-3 py-2 font-mono text-[11px] leading-5 text-teal-50/85">
            <code>{snippet}</code>
          </pre>
        </div>
      ) : null}
    </article>
  )
}
