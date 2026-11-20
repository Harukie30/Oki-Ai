"use client"

import { Button } from "@/components/ui/button"
import { REVIEW_MAX_LINES } from "@/lib/review-types"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

interface ReviewLineLimitNoticeProps {
  open: boolean
  onDismiss: () => void
  className?: string
}

export function ReviewLineLimitNotice({
  open,
  onDismiss,
  className,
}: ReviewLineLimitNoticeProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="line-limit-notice-title"
      aria-describedby="line-limit-notice-detail"
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl bg-[#041014]/72 backdrop-blur-[3px] sm:rounded-2xl"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-400/15 bg-[#0f1a1c] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.65)] animate-in fade-in zoom-in-95 duration-200 [color-scheme:dark]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.22),transparent_70%)]"
        />

        <div className="relative px-6 pb-6 pt-7 sm:px-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-200 ring-1 ring-teal-400/20">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={1.75}
              className="size-6"
            />
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300/65">
            Heads up
          </p>
          <h2
            id="line-limit-notice-title"
            className="mt-2 text-xl font-semibold tracking-tight text-white"
          >
            {REVIEW_MAX_LINES}-line limit per review
          </h2>
          <p
            id="line-limit-notice-detail"
            className="mt-2 text-sm leading-relaxed text-white/60"
          >
            Paste a focused snippet or file up to{" "}
            <span className="font-medium text-teal-100/90">
              {REVIEW_MAX_LINES} lines
            </span>
            . Anything longer gets trimmed so the review stays fast and clear.
            Split big files into smaller snippets.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              className="w-full bg-teal-500 text-teal-950 hover:bg-teal-400 sm:w-auto"
              onClick={onDismiss}
            >
              Got it, open editor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
