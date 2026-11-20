"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

function getErrorCopy(message: string): { title: string; detail: string } {
  const lower = message.toLowerCase()
  const mentionsGroq = lower.includes("groq")
  const mentionsGemini = lower.includes("gemini")
  const mentionsOpenAi = lower.includes("openai")
  const mentionsOpenRouter = lower.includes("openrouter")
  const isAuto =
    lower.includes("auto") ||
    (mentionsGroq && mentionsGemini) ||
    lower.includes("both providers") ||
    lower.includes("fallback")

  const providerLabel = isAuto
    ? "Auto"
    : mentionsOpenRouter
      ? "OpenRouter"
      : mentionsGroq
        ? "Groq"
        : mentionsOpenAi
          ? "OpenAI"
          : mentionsGemini
            ? "Gemini"
            : "the AI"

  if (lower.includes("no credits") || lower.includes("insufficient_quota")) {
    return {
      title: "No API credits",
      detail: message.trim(),
    }
  }

  if (
    lower.includes("model unavailable") ||
    lower.includes("model_not_found") ||
    lower.includes("does not exist") ||
    (lower.includes("404") && lower.includes("model"))
  ) {
    return {
      title: "Model unavailable",
      detail: message.trim()
        ? message.trim()
        : isAuto
          ? "One of the Auto models isn’t available for this key. Check GROQ_MODEL / GEMINI_MODEL, then retry."
          : `The selected ${providerLabel} model isn’t available for this key. Update the model in .env, then retry.`,
    }
  }

  if (
    lower.includes("timed out") ||
    lower.includes("504") ||
    lower.includes("high demand") ||
    lower.includes("503") ||
    lower.includes("429") ||
    lower.includes("busy") ||
    lower.includes("rate limit")
  ) {
    return {
      title: isAuto ? "Providers are busy" : "AI is taking too long",
      detail: message.trim()
        ? message.trim()
        : isAuto
          ? "One or more Auto providers didn’t finish in time — often high demand or a large snippet. Wait a moment, try a shorter piece of code, then retry."
          : `${providerLabel} didn’t finish in time — often high demand or a large snippet. Wait a moment, try a shorter piece of code, then retry.`,
    }
  }

  if (lower.includes("api key") || lower.includes("401") || lower.includes("403")) {
    return {
      title: isAuto ? "API keys need a check" : "API key issue",
      detail: message.trim()
        ? message.trim()
        : isAuto
          ? "We couldn’t authenticate with Gemini, Groq, and/or OpenRouter. Confirm the keys on Vercel (or in .env locally), redeploy if needed, then retry."
          : `We couldn’t authenticate with ${providerLabel}. Check the API key in .env, then retry.`,
    }
  }

  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return {
      title: "Connection problem",
      detail:
        "We couldn’t reach the review service. Check your connection and try again.",
    }
  }

  return {
    title: isAuto ? "Auto review couldn’t finish" : "Review couldn’t finish",
    detail:
      message.trim() ||
      (isAuto
        ? "Something went wrong while merging Gemini, Groq, and OpenRouter. Please try again in a moment."
        : "Something went wrong while analyzing your code. Please try again in a moment."),
  }
}

interface ReviewErrorModalProps {
  message: string
  open: boolean
  onClose: () => void
  onRetry?: () => void
}

export function ReviewErrorModal({
  message,
  open,
  onClose,
  onRetry,
}: ReviewErrorModalProps) {
  const copy = getErrorCopy(message)

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
        aria-labelledby="review-error-title"
        aria-describedby="review-error-detail"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-900/10 bg-[#f7fffe] shadow-[0_30px_80px_-28px_rgba(8,60,70,0.55)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.28),transparent_70%)]"
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
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.75} className="size-6" />
          </div>

          <h2
            id="review-error-title"
            className="mt-4 text-xl font-semibold tracking-tight text-teal-950"
          >
            {copy.title}
          </h2>
          <p
            id="review-error-detail"
            className="mt-2 text-sm leading-relaxed text-teal-950/65"
          >
            {copy.detail}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              Close
            </Button>
            {onRetry ? (
              <Button
                className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
                onClick={onRetry}
              >
                Try again
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
