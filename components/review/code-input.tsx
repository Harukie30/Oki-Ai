"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CODE_LANGUAGES,
  LANGUAGE_EXTENSIONS,
  type CodeLanguage,
} from "@/lib/review-types"
import { cn } from "@/lib/utils"

interface CodeInputProps {
  code: string
  language: CodeLanguage
  disabled?: boolean
  onCodeChange: (code: string) => void
  onLanguageChange: (language: CodeLanguage) => void
  onChangeLanguageStep?: () => void
}

function extensionFor(language: CodeLanguage) {
  return LANGUAGE_EXTENSIONS[language]
}

export function CodeInput({
  code,
  language,
  disabled,
  onCodeChange,
  onLanguageChange,
  onChangeLanguageStep,
}: CodeInputProps) {
  const languageLabel =
    CODE_LANGUAGES.find((lang) => lang.value === language)?.label ?? "Language"

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0c1214] shadow-[0_24px_80px_-32px_rgba(8,40,48,0.65)] sm:rounded-2xl",
        "ring-1 ring-teal-400/15 [color-scheme:dark]"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
          <span className="ml-1 truncate font-mono text-[11px] text-white/45 sm:ml-2 sm:text-xs">
            snippet.{extensionFor(language)}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {onChangeLanguageStep ? (
            <button
              type="button"
              onClick={onChangeLanguageStep}
              disabled={disabled}
              className="hidden rounded-full px-2.5 py-1 text-[11px] font-medium text-teal-200/70 transition-colors hover:bg-white/5 hover:text-teal-100 disabled:opacity-50 sm:inline"
            >
              Change
            </button>
          ) : null}
          <Select
            value={language}
            onValueChange={(value) => {
              if (value) onLanguageChange(value as CodeLanguage)
            }}
            disabled={disabled}
          >
            <SelectTrigger
              size="sm"
              className="max-w-full shrink-0 border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
            >
              <SelectValue>
                {() => languageLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end">
              {CODE_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b border-white/5 px-3 py-2 sm:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300/60">
          Step 2 of 2 · Paste {languageLabel}
        </p>
      </div>

      <div className="relative">
        <Textarea
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder={`Paste your ${languageLabel} code here…`}
          className={cn(
            "ide-scroll min-h-[220px] rounded-none border-0 bg-transparent px-3 py-3 font-mono text-[12px] leading-5 text-teal-50/90 sm:min-h-[280px] sm:px-4 sm:py-4 sm:text-[13px] sm:leading-6 md:min-h-[360px]",
            "placeholder:text-white/30 focus-visible:border-transparent focus-visible:ring-0"
          )}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c1214] to-transparent sm:h-16"
        />
      </div>
    </div>
  )
}
