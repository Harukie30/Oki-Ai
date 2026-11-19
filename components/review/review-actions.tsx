"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { FlashIcon, Loading03Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface ReviewActionsProps {
  analyzing: boolean
  disabled?: boolean
  hasResult?: boolean
  stale?: boolean
  source?: "auto" | "gemini" | "groq" | "openai" | "mock"
  selectedProvider?: "auto" | "gemini" | "groq"
  onReview: () => void
  className?: string
}

export function ReviewActions({
  analyzing,
  disabled,
  hasResult = false,
  stale = false,
  source,
  selectedProvider = "auto",
  onReview,
  className,
}: ReviewActionsProps) {
  const activeLabel =
    source === "auto"
      ? "Auto (Groq + Gemini)"
      : source === "groq"
        ? "Groq"
        : source === "openai"
          ? "OpenAI"
          : source === "gemini"
            ? "Gemini"
            : source === "mock"
              ? "Mock"
              : selectedProvider === "auto"
                ? "Auto (Groq + Gemini)"
                : selectedProvider === "groq"
                  ? "Groq"
                  : "Gemini"

  const hint = analyzing
    ? `Scanning with ${activeLabel} for bugs, security risks, and style issues…`
    : stale
      ? "Code changed since the last review — re-run for a fresh score and findings."
      : hasResult
        ? `Last review used ${activeLabel}. Change the model or code, then re-review.`
        : source === "mock"
          ? "Mock mode — no AI key ran this time. Check your .env keys."
          : `Ready to review with ${activeLabel}.`

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p
        className={cn(
          "order-2 text-sm sm:order-1",
          stale ? "font-medium text-amber-900/80" : "text-muted-foreground"
        )}
      >
        {hint}
      </p>
      <Button
        size="lg"
        onClick={onReview}
        disabled={disabled || analyzing}
        className={cn(
          "relative order-1 w-full overflow-hidden bg-teal-600 text-white hover:bg-teal-500 sm:order-2 sm:w-auto sm:min-w-[160px]",
          analyzing && "animate-pulse",
          stale && !analyzing && "ring-2 ring-amber-400/50 ring-offset-2 ring-offset-[#f4fbfa]"
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
        ) : hasResult || stale ? (
          <>
            <HugeiconsIcon
              icon={RefreshIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Re-review
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
