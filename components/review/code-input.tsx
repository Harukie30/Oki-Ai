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
  REVIEW_MAX_LINES,
  clampCodeToMaxLines,
  countCodeLines,
  type CodeLanguage,
} from "@/lib/review-types"
import { downloadTextFile } from "@/lib/download-code"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

interface CodeInputProps {
  code: string
  language: CodeLanguage
  disabled?: boolean
  highlightLine?: number | null
  onCodeChange: (code: string) => void
  onLanguageChange: (language: CodeLanguage) => void
  onChangeLanguageStep?: () => void
  /** Fired when pasted/typed content exceeds the max and gets trimmed. */
  onLineLimitExceeded?: (info: {
    attemptedLines: number
    keptLines: number
  }) => void
  onLoadExample?: () => void
  onPreserved?: () => void
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
  onLineLimitExceeded,
  onLoadExample,
  onPreserved,
}: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const [lineMetrics, setLineMetrics] = useState({ lineHeight: 20, paddingTop: 12 })
  const [scrollTop, setScrollTop] = useState(0)
  const [downloaded, setDownloaded] = useState(false)
  const languageLabel =
    CODE_LANGUAGES.find((lang) => lang.value === language)?.label ?? "Language"
  const filename = `snippet.${extensionFor(language)}`

  const lineCount = useMemo(
    () => Math.max(1, countCodeLines(code) || 1),
    [code]
  )
  const atLineLimit = lineCount >= REVIEW_MAX_LINES
  const nearLineLimit = lineCount >= Math.floor(REVIEW_MAX_LINES * 0.85)

  function handleCodeChange(next: string) {
    const attemptedLines = countCodeLines(next)
    if (attemptedLines > REVIEW_MAX_LINES) {
      onLineLimitExceeded?.({
        attemptedLines,
        keptLines: REVIEW_MAX_LINES,
      })
      onCodeChange(clampCodeToMaxLines(next, REVIEW_MAX_LINES))
      return
    }
    onCodeChange(next)
  }

  function handleDownload() {
    if (!code.trim()) return
    downloadTextFile(filename, code)
    setDownloaded(true)
    onPreserved?.()
    window.setTimeout(() => setDownloaded(false), 1600)
  }

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
          {onLoadExample ? (
            <button
              type="button"
              onClick={onLoadExample}
              disabled={disabled}
              className="rounded-full border border-teal-400/25 bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium text-teal-100 transition-colors hover:bg-teal-400/20 disabled:opacity-50"
            >
              Try example
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleDownload}
            disabled={disabled || !code.trim()}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50",
              downloaded
                ? "border-teal-400/40 bg-teal-400/15 text-teal-100"
                : "border-white/10 bg-white/5 text-teal-100/80 hover:border-teal-400/30 hover:bg-teal-400/10"
            )}
          >
            <HugeiconsIcon
              icon={downloaded ? Tick02Icon : Download01Icon}
              strokeWidth={1.75}
              className="size-3.5"
            />
            {downloaded ? "Saved" : "Download"}
          </button>
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

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-3 py-2 sm:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300/60">
          {highlightLine
            ? `Focus · line ${highlightLine}`
            : `Your code · ${languageLabel}`}
        </p>
        <p
          className={cn(
            "font-mono text-[10px] tabular-nums tracking-wide",
            atLineLimit
              ? "font-semibold text-amber-300"
              : nearLineLimit
                ? "text-amber-200/80"
                : "text-white/35"
          )}
          aria-live="polite"
        >
          {lineCount} / {REVIEW_MAX_LINES} lines
          {atLineLimit ? " · max" : ""}
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
            onChange={(event) => handleCodeChange(event.target.value)}
            onScroll={syncGutterScroll}
            disabled={disabled}
            spellCheck={false}
            placeholder={`Paste your ${languageLabel} code here… (max ${REVIEW_MAX_LINES} lines)`}
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

      {atLineLimit ? (
        <div className="border-t border-amber-300/15 bg-amber-300/8 px-3 py-2 sm:px-4">
          <p className="text-[11px] leading-relaxed text-amber-100/85">
            Line limit reached ({REVIEW_MAX_LINES}). Trim the snippet or review
            a smaller piece — extra pasted lines are dropped.
          </p>
        </div>
      ) : null}
    </div>
  )
}
