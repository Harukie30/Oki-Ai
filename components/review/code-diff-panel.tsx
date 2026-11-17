"use client"

import { useMemo } from "react"
import { diffLines } from "@/lib/line-diff"
import { cn } from "@/lib/utils"

interface CodeDiffPanelProps {
  before: string
  after: string
  className?: string
}

export function CodeDiffPanel({ before, after, className }: CodeDiffPanelProps) {
  const rows = useMemo(() => diffLines(before, after), [before, after])
  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    for (const row of rows) {
      if (row.kind === "add") added++
      if (row.kind === "remove") removed++
    }
    return { added, removed }
  }, [rows])

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-teal-900/10 bg-white/70 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md sm:rounded-2xl",
        "animate-in fade-in slide-in-from-bottom-3 duration-700",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-900/8 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700/55">
            Diff
          </p>
          <h3 className="mt-1 text-sm font-semibold tracking-tight text-teal-950">
            What changed
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-emerald-800">
            +{stats.added}
          </span>
          <span className="rounded-full bg-rose-500/12 px-2.5 py-1 text-rose-800">
            −{stats.removed}
          </span>
        </div>
      </div>

      <div className="ide-scroll max-h-[min(48vh,380px)] overflow-auto bg-[#0c1214] font-mono text-[12px] leading-6 text-teal-50/90 sm:text-[13px]">
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/40">
            No differences to show.
          </p>
        ) : (
          rows.map((row, index) => (
            <div
              key={`${row.kind}-${index}-${row.leftLine}-${row.rightLine}`}
              className={cn(
                "grid grid-cols-[2.5rem_2.5rem_1.25rem_minmax(0,1fr)] gap-0 border-b border-white/[0.03]",
                row.kind === "add" && "bg-emerald-500/12",
                row.kind === "remove" && "bg-rose-500/12"
              )}
            >
              <span className="select-none px-2 py-0.5 text-right text-white/25">
                {row.leftLine ?? ""}
              </span>
              <span className="select-none px-2 py-0.5 text-right text-white/25">
                {row.rightLine ?? ""}
              </span>
              <span
                className={cn(
                  "select-none py-0.5 text-center",
                  row.kind === "add" && "text-emerald-300",
                  row.kind === "remove" && "text-rose-300",
                  row.kind === "equal" && "text-white/20"
                )}
              >
                {row.kind === "add" ? "+" : row.kind === "remove" ? "−" : " "}
              </span>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all px-2 py-0.5">
                {row.text || " "}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
