"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AccountControls } from "@/components/auth/account-controls"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { AutoHideHeader } from "@/components/layout/auto-hide-header"
import { ReviewWorkspace } from "@/components/review/review-workspace"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ReviewShell() {
  const [navOpen, setNavOpen] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)")
    const sync = () => setCoarsePointer(coarse.matches)
    sync()
    coarse.addEventListener("change", sync)

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevHtmlHeight = html.style.height
    const prevBodyHeight = body.style.height

    // Review page owns scrolling via <main>; keep the window scrollbar gone.
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    html.style.height = "100%"
    body.style.height = "100%"

    return () => {
      coarse.removeEventListener("change", sync)
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      html.style.height = prevHtmlHeight
      body.style.height = prevBodyHeight
      document.documentElement.style.setProperty("--oki-nav-shift", "0px")
    }
  }, [])

  const lockPageScroll = navOpen && !coarsePointer

  return (
    <div className="relative flex h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(45,212,191,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,116,144,0.14),_transparent_50%),linear-gradient(180deg,#f4fbfa_0%,#eef6f5_45%,#f7faf9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-[0.35] sm:block [background-image:linear-gradient(rgba(15,80,90,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,80,90,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <AutoHideHeader pushContent onOpenChange={setNavOpen}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <OkiAiLogo size="sm" className="sm:h-8" />
          <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-teal-700/60 sm:inline">
            review
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <AccountControls />
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Back to home</span>
          </Button>
        </div>
      </AutoHideHeader>

      <main
        className={cn(
          "flex min-h-0 w-full min-w-0 flex-1 flex-col gap-5 px-4 pb-12 pt-[calc(1rem+var(--oki-nav-shift,0px))] transition-[padding-top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-8 sm:px-6 sm:pb-16 sm:pt-[calc(1.25rem+var(--oki-nav-shift,0px))] lg:px-8",
          lockPageScroll
            ? "overflow-hidden overscroll-none"
            : "overflow-y-auto overscroll-contain"
        )}
      >
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
            AI code review
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-teal-950/65 sm:text-base">
            Write code, compare the suggested fix, then jump findings or apply
            local SuggestedCode before you commit to your codebase.
          </p>
        </div>
        <ReviewWorkspace />
      </main>
    </div>
  )
}
