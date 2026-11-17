"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import {
  CODE_LANGUAGES,
  LANGUAGE_GROUPS,
  type CodeLanguage,
  type LanguageGroup,
} from "@/lib/review-types"
import { cn } from "@/lib/utils"

interface LanguagePickerProps {
  onSelect: (language: CodeLanguage) => void
}

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0c1214] shadow-[0_24px_80px_-32px_rgba(8,40,48,0.65)] sm:rounded-2xl",
        "ring-1 ring-teal-400/15 [color-scheme:dark]"
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2.5 sm:px-4 sm:py-3">
        <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
        <span className="ml-1 truncate font-mono text-[11px] text-white/45 sm:ml-2 sm:text-xs">
          choose-language
        </span>
      </div>

      <div className="ide-scroll relative max-h-[min(70vh,560px)] overflow-y-auto px-4 py-5 sm:px-5 sm:py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.18),transparent_70%)]"
        />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300/70">
            Step 1 of 2
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
            What language are you reviewing?
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
            Pick the language first so Oki-Ai can review with the right patterns.
            Then paste your snippet.
          </p>
        </div>

        <div className="relative mt-6 space-y-6">
          {LANGUAGE_GROUPS.map((group) => (
            <LanguageGroupSection
              key={group.id}
              groupId={group.id}
              label={group.label}
              detail={group.detail}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LanguageGroupSection({
  groupId,
  label,
  detail,
  onSelect,
}: {
  groupId: LanguageGroup
  label: string
  detail: string
  onSelect: (language: CodeLanguage) => void
}) {
  const languages = CODE_LANGUAGES.filter((lang) => lang.group === groupId)

  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-teal-100">{label}</h3>
        <p className="mt-0.5 text-xs text-white/40">{detail}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {languages.map((lang) => (
          <button
            key={lang.value}
            type="button"
            onClick={() => onSelect(lang.value)}
            className={cn(
              "group flex items-start justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3.5 py-3 text-left transition-all duration-200",
              "hover:border-teal-300/35 hover:bg-teal-400/10 hover:shadow-[0_12px_40px_-24px_rgba(45,212,191,0.8)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50"
            )}
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white/90">
                {lang.label}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
                {lang.blurb}
              </span>
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={1.75}
              className="mt-0.5 size-4 shrink-0 text-teal-300/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-teal-200"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
