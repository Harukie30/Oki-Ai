"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  FlashIcon,
  SparklesIcon,
  Robot01Icon,
  Globe02Icon,
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
    detail: "All together",
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
  {
    id: "openrouter",
    label: "OpenRouter",
    detail: "OpenRouter.ai",
    icon: Globe02Icon,
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
    <div
      role="radiogroup"
      aria-label="Review model"
      className={cn(
        "inline-grid grid-cols-2 gap-0.5 rounded-2xl border border-teal-900/10 bg-white/80 p-1 shadow-sm backdrop-blur-sm sm:grid-cols-4 sm:rounded-full",
        className
      )}
    >
      {PROVIDERS.map((provider) => {
        const selected = value === provider.id
        return (
          <button
            key={provider.id}
            type="button"
            role="radio"
            aria-checked={selected}
            title={provider.detail}
            disabled={disabled}
            onClick={() => onChange(provider.id)}
            className={cn(
              "inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-tight transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "bg-teal-700 text-white shadow-sm"
                : "text-teal-900/60 hover:bg-teal-900/[0.04] hover:text-teal-950"
            )}
          >
            <HugeiconsIcon
              icon={provider.icon}
              strokeWidth={1.75}
              className="size-3"
            />
            {provider.label}
          </button>
        )
      })}
    </div>
  )
}
