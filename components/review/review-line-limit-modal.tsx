"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { REVIEW_MAX_LINES } from "@/lib/review-types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

interface ReviewLineLimitModalProps {
  open: boolean
  attemptedLines: number
  onClose: () => void
}

export function ReviewLineLimitModal({
  open,
  attemptedLines,
  onClose,
}: ReviewLineLimitModalProps) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  const trimmed = Math.max(0, attemptedLines - REVIEW_MAX_LINES)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-teal-950/35 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="line-limit-warning-title"
        aria-describedby="line-limit-warning-detail"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-900/10 bg-[#f7fffe] shadow-[0_30px_80px_-28px_rgba(8,60,70,0.55)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.28),transparent_70%)]"
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full text-teal-900/50 transition-colors hover:bg-teal-900/5 hover:text-teal-900"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
        </button>

        <div className="relative px-6 pb-6 pt-7 sm:px-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800 ring-1 ring-amber-600/15">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.75} className="size-6" />
          </div>

          <h2
            id="line-limit-warning-title"
            className="mt-4 text-xl font-semibold tracking-tight text-teal-950"
          >
            Snippet was trimmed
          </h2>
          <p
            id="line-limit-warning-detail"
            className="mt-2 text-sm leading-relaxed text-teal-950/65"
          >
            You pasted about{" "}
            <span className="font-semibold text-teal-950">
              {attemptedLines} lines
            </span>
            . Reviews are capped at{" "}
            <span className="font-semibold text-teal-950">
              {REVIEW_MAX_LINES} lines
            </span>
            , so{" "}
            <span className="font-semibold text-teal-950">
              {trimmed} line{trimmed === 1 ? "" : "s"}
            </span>{" "}
            were cut from the end. Keep the first {REVIEW_MAX_LINES} lines, or
            paste a smaller slice and review again.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
              onClick={onClose}
            >
              Okay, got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
