"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  FlashIcon,
  SparklesIcon,
  Robot01Icon,
} from "@hugeicons/core-free-icons"
import type { ReviewProvider } from "@/lib/review-types"
import { cn } from "@/lib/utils"

const PROVIDERS: {
  id: ReviewProvider
  label: string
  detail: string
  icon: typeof SparklesIcon
}[] = [
  {
    id: "auto",
    label: "Auto",
    detail: "Both together",
    icon: Robot01Icon,
  },
  {
    id: "gemini",
    label: "Gemini",
    detail: "Google",
    icon: SparklesIcon,
  },
  {
    id: "groq",
    label: "Groq",
    detail: "Groq cloud",
    icon: FlashIcon,
  },
]

interface ProviderToggleProps {
  value: ReviewProvider
  disabled?: boolean
  onChange: (provider: ReviewProvider) => void
  className?: string
}

export function ProviderToggle({
  value,
  disabled,
  onChange,
  className,
}: ProviderToggleProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700/55">
        Review model
      </p>
      <div
        role="radiogroup"
        aria-label="Review model"
        className="mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-teal-900/10 bg-white/70 p-1.5 shadow-[0_12px_30px_-24px_rgba(8,60,70,0.4)] backdrop-blur-sm"
      >
        {PROVIDERS.map((provider) => {
          const selected = value === provider.id
          return (
            <button
              key={provider.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(provider.id)}
              className={cn(
                "group/provider relative flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center transition-[background-color,box-shadow,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex-row sm:items-center sm:gap-2.5 sm:px-3 sm:text-left",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "bg-teal-700 text-white shadow-[0_12px_28px_-16px_rgba(15,118,110,0.7)]"
                  : "text-teal-900/65 hover:bg-teal-900/[0.04] hover:text-teal-950"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 sm:size-8",
                  selected
                    ? "bg-white/15 text-white"
                    : "bg-teal-600/10 text-teal-800 group-hover/provider:bg-teal-600/15"
                )}
              >
                <HugeiconsIcon
                  icon={provider.icon}
                  strokeWidth={1.75}
                  className="size-3.5"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold leading-none tracking-tight sm:text-sm">
                  {provider.label}
                </span>
                <span
                  className={cn(
                    "mt-1 hidden text-[10px] leading-none tracking-wide sm:block",
                    selected ? "text-teal-50/70" : "text-teal-700/45"
                  )}
                >
                  {provider.detail}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
