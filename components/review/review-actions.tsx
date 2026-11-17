"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { FlashIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface ReviewActionsProps {
  analyzing: boolean
  disabled?: boolean
  source?: "gemini" | "openai" | "mock"
  onReview: () => void
}

export function ReviewActions({
  analyzing,
  disabled,
  source,
  onReview,
}: ReviewActionsProps) {
  const hint = analyzing
    ? "Scanning for bugs, security risks, and style issues…"
    : source === "gemini"
      ? "Powered by Gemini — findings are generated from your snippet."
      : source === "openai"
        ? "Powered by OpenAI — findings are generated from your snippet."
        : source === "mock"
          ? "Mock mode — add GEMINI_API_KEY in .env.local for real AI (free tier)."
          : "Reviews call /api/review. Add GEMINI_API_KEY for live AI analysis."

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="order-2 text-sm text-muted-foreground sm:order-1">{hint}</p>
      <Button
        size="lg"
        onClick={onReview}
        disabled={disabled || analyzing}
        className={cn(
          "relative order-1 w-full overflow-hidden bg-teal-600 text-white hover:bg-teal-500 sm:order-2 sm:w-auto sm:min-w-[160px]",
          analyzing && "animate-pulse"
        )}
      >
        {analyzing ? (
          <>
            <HugeiconsIcon
              icon={Loading03Icon}
              strokeWidth={2}
              className="animate-spin"
              data-icon="inline-start"
            />
            Analyzing
          </>
        ) : (
          <>
            <HugeiconsIcon
              icon={FlashIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Review code
          </>
        )}
        {analyzing ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full animate-[scan_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
        ) : null}
      </Button>
    </div>
  )
}
