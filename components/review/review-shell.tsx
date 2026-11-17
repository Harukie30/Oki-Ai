import Link from "next/link"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { AutoHideHeader } from "@/components/layout/auto-hide-header"
import { ReviewWorkspace } from "@/components/review/review-workspace"
import { Button } from "@/components/ui/button"

export function ReviewShell() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(45,212,191,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,116,144,0.14),_transparent_50%),linear-gradient(180deg,#f4fbfa_0%,#eef6f5_45%,#f7faf9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-[0.35] sm:block [background-image:linear-gradient(rgba(15,80,90,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,80,90,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <AutoHideHeader pushContent>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <OkiAiLogo size="sm" className="sm:h-8" />
          <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-teal-700/60 sm:inline">
            review
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <span className="sm:hidden">Home</span>
          <span className="hidden sm:inline">Back to home</span>
        </Button>
      </AutoHideHeader>

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col gap-5 px-4 pb-12 pt-4 sm:gap-8 sm:px-8 sm:pb-16 sm:pt-5">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
            AI code review
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-teal-950/65 sm:text-base">
            Paste a snippet, run a review, and get severity-ranked findings with
            fix suggestions.
          </p>
        </div>
        <ReviewWorkspace />
      </main>
    </div>
  )
}
