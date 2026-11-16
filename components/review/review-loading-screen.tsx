import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { cn } from "@/lib/utils"

export function ReviewLoadingScreen({
  className,
  label = "Opening review workspace",
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(14,116,144,0.16),transparent_50%),linear-gradient(180deg,#f4fbfa_0%,#eef6f5_45%,#f7faf9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(15,80,90,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,80,90,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/30 blur-3xl animate-[pulse_2.8s_ease-in-out_infinite] sm:size-[360px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] size-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-500/15 sm:size-[220px]"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative">
          <OkiAiLogo size="md" href={false} priority className="sm:h-10" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[-12%] top-1/2 h-px -translate-y-1/2 overflow-hidden"
          >
            <span className="absolute inset-y-0 w-1/2 animate-[scan_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent" />
          </span>
        </div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70">
          {label}
        </p>

        <div className="relative mt-5 h-1 w-40 overflow-hidden rounded-full bg-teal-900/10">
          <div className="absolute inset-y-0 w-1/2 animate-[scan_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-teal-300 via-teal-500 to-cyan-400" />
        </div>

        <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-teal-700/50">
          scan · score · findings
        </p>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  )
}
