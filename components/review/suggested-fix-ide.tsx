"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import {
  CODE_LANGUAGES,
  LANGUAGE_EXTENSIONS,
  type CodeLanguage,
} from "@/lib/review-types"
import { cn } from "@/lib/utils"

interface SuggestedFixIdeProps {
  code: string
  language: CodeLanguage
  className?: string
}

export function SuggestedFixIde({
  code,
  language,
  className,
}: SuggestedFixIdeProps) {
  const [copied, setCopied] = useState(false)
  const languageLabel =
    CODE_LANGUAGES.find((lang) => lang.value === language)?.label ?? language
  const extension = LANGUAGE_EXTENSIONS[language]

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0c1214] shadow-[0_24px_80px_-32px_rgba(8,40,48,0.65)] sm:rounded-2xl",
        "ring-1 ring-teal-400/20 [color-scheme:dark]",
        "animate-in fade-in slide-in-from-bottom-3 duration-700",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
          <span className="ml-1 truncate font-mono text-[11px] text-white/45 sm:ml-2 sm:text-xs">
            SuggestedCode.{extension}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-md border border-teal-400/25 bg-teal-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-teal-200/90">
            SuggestedCode
          </span>
          <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white/50 sm:inline">
            {languageLabel}
          </span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-[background-color,border-color,color,transform] duration-200",
              copied
                ? "border-teal-400/40 bg-teal-400/15 text-teal-100"
                : "border-white/10 bg-white/5 text-teal-100/80 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-50"
            )}
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Copy01Icon}
              strokeWidth={1.75}
              className="size-3.5"
            />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="border-b border-white/5 px-3 py-2 sm:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300/60">
          SuggestedCode · study & copy
        </p>
      </div>

      <div className="relative">
        <pre
          className={cn(
            "ide-scroll max-h-[min(52vh,420px)] min-h-[180px] overflow-auto px-3 py-3 font-mono text-[12px] leading-5 text-teal-50/90 sm:min-h-[220px] sm:px-4 sm:py-4 sm:text-[13px] sm:leading-6"
          )}
        >
          <code>{code}</code>
        </pre>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c1214] to-transparent sm:h-14"
        />
      </div>
    </div>
  )
}
