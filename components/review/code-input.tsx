"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  highlightLine?: number | null
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
  highlightLine = null,
  onCodeChange,
  onLanguageChange,
  onChangeLanguageStep,
}: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const [lineMetrics, setLineMetrics] = useState({ lineHeight: 20, paddingTop: 12 })
  const [scrollTop, setScrollTop] = useState(0)
  const languageLabel =
    CODE_LANGUAGES.find((lang) => lang.value === language)?.label ?? "Language"

  const lineCount = useMemo(
    () => Math.max(1, code.split("\n").length),
    [code]
  )

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    const measure = () => {
      const styles = window.getComputedStyle(el)
      setLineMetrics({
        lineHeight: Number.parseFloat(styles.lineHeight) || 20,
        paddingTop: Number.parseFloat(styles.paddingTop) || 12,
      })
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [code])

  useEffect(() => {
    if (!highlightLine || highlightLine < 1) return
    const el = textareaRef.current
    if (!el) return

    const { lineHeight, paddingTop } = lineMetrics
    const target = paddingTop + (highlightLine - 1) * lineHeight
    el.scrollTop = Math.max(0, target - el.clientHeight / 3)
    setScrollTop(el.scrollTop)
    if (gutterRef.current) gutterRef.current.scrollTop = el.scrollTop

    const start =
      code.split("\n").slice(0, highlightLine - 1).join("\n").length +
      (highlightLine > 1 ? 1 : 0)
    const lineText = code.split("\n")[highlightLine - 1] ?? ""
    el.focus()
    el.setSelectionRange(start, start + lineText.length)
  }, [highlightLine, code, lineMetrics])

  function syncGutterScroll() {
    const el = textareaRef.current
    if (!el) return
    setScrollTop(el.scrollTop)
    if (gutterRef.current) gutterRef.current.scrollTop = el.scrollTop
  }

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0c1214] shadow-[0_24px_80px_-32px_rgba(8,40,48,0.65)] sm:rounded-2xl",
        "ring-1 ring-teal-400/15 [color-scheme:dark]",
        highlightLine ? "ring-amber-300/35" : null
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
              <SelectValue>{() => languageLabel}</SelectValue>
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
          {highlightLine
            ? `Focus · line ${highlightLine}`
            : `Your code · ${languageLabel}`}
        </p>
      </div>

      <div className="relative flex min-h-[220px] sm:min-h-[280px] md:min-h-[360px]">
        <div
          ref={gutterRef}
          aria-hidden
          className="ide-scroll pointer-events-none w-10 shrink-0 overflow-hidden border-r border-white/6 bg-black/20 py-3 text-right font-mono text-[11px] leading-5 text-white/30 sm:w-12 sm:py-4 sm:text-[12px] sm:leading-6"
        >
          {Array.from({ length: lineCount }, (_, index) => {
            const line = index + 1
            const active = highlightLine === line
            return (
              <div
                key={line}
                className={cn(
                  "px-2 tabular-nums",
                  active && "bg-amber-300/20 font-semibold text-amber-200"
                )}
              >
                {line}
              </div>
            )
          })}
        </div>

        <div className="relative min-w-0 flex-1">
          {highlightLine && highlightLine >= 1 && highlightLine <= lineCount ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 z-0 border-y border-amber-300/25 bg-amber-300/14 transition-[top] duration-200 animate-in fade-in"
              style={{
                top:
                  lineMetrics.paddingTop +
                  (highlightLine - 1) * lineMetrics.lineHeight -
                  scrollTop,
                height: lineMetrics.lineHeight,
              }}
            />
          ) : null}
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            onScroll={syncGutterScroll}
            disabled={disabled}
            spellCheck={false}
            placeholder={`Paste your ${languageLabel} code here…`}
            className={cn(
              "ide-scroll relative z-[1] min-h-[220px] rounded-none border-0 bg-transparent px-3 py-3 font-mono text-[12px] leading-5 text-teal-50/90 sm:min-h-[280px] sm:px-4 sm:py-4 sm:text-[13px] sm:leading-6 md:min-h-[360px]",
              "placeholder:text-white/30 focus-visible:border-transparent focus-visible:ring-0"
            )}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-12 bg-gradient-to-t from-[#0c1214] to-transparent sm:h-16"
          />
        </div>
      </div>
    </div>
  )
}
