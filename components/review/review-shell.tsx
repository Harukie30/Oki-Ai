"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { AccountControls } from "@/components/auth/account-controls"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AutoHideHeader } from "@/components/layout/auto-hide-header"
import { ReviewWorkspace } from "@/components/review/review-workspace"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function WorkspaceFallback() {
  return (
    <div className="rounded-2xl border border-teal-700/15 bg-white/80 px-4 py-6 text-sm text-teal-950/60">
      Loading workspace…
    </div>
  )
}

function ReviewWorkspaceBody({ compactIntro }: { compactIntro?: boolean }) {
  return (
    <>
      <div className={cn(compactIntro ? "max-w-2xl" : "max-w-2xl")}>
        <h1
          className={cn(
            "font-semibold tracking-tight text-teal-950",
            compactIntro ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl"
          )}
        >
          AI code review
        </h1>
        <p
          className={cn(
            "mt-2 leading-relaxed text-teal-950/65",
            compactIntro ? "text-sm" : "text-sm sm:text-base"
          )}
        >
          Write code, compare the suggested fix, then jump findings or apply
          local SuggestedCode before you commit to your codebase.
        </p>
      </div>
      <Suspense fallback={<WorkspaceFallback />}>
        <ReviewWorkspace />
      </Suspense>
    </>
  )
}

function GuestReviewShell() {
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
        <ReviewWorkspaceBody />
      </main>
    </div>
  )
}

export function ReviewShell() {
  const { isSignedIn, isLoaded } = useOkiAuth()

  if (!isLoaded) {
    return (
      <div className="relative flex h-svh min-h-0 flex-1 items-center justify-center bg-[#f4fbfa] text-sm text-teal-950/50">
        Loading…
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <DashboardShell
        section="review"
        className="flex flex-col gap-5 px-4 py-5 sm:gap-8 sm:px-6 sm:py-6 lg:px-8"
      >
        <ReviewWorkspaceBody compactIntro />
      </DashboardShell>
    )
  }

  return <GuestReviewShell />
}
