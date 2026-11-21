"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { cn } from "@/lib/utils"

export type AuthTransitionKind = "signing-in" | "signing-up" | "signing-out"

const COPY: Record<AuthTransitionKind, { title: string; detail: string }> = {
  "signing-in": {
    title: "Signing you in",
    detail: "Opening your review workspace…",
  },
  "signing-up": {
    title: "Creating your account",
    detail: "Almost ready — setting things up…",
  },
  "signing-out": {
    title: "Signing you out",
    detail: "Clearing your session…",
  },
}

export function AuthLoadingScreen({ kind }: { kind: AuthTransitionKind }) {
  const [mounted, setMounted] = useState(false)
  const copy = COPY[kind]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 px-6",
        "bg-[#f4fbfa]/92 backdrop-blur-md",
        "animate-in fade-in duration-200"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(14,116,144,0.12),_transparent_50%)]"
      />

      <div className="relative flex flex-col items-center gap-5 text-center">
        <OkiAiLogo size="md" href={false} />

        <div className="relative flex size-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/35" />
          <span className="absolute inset-1.5 animate-pulse rounded-full border-2 border-teal-500/30 border-t-teal-600" />
          <span className="size-2.5 rounded-full bg-teal-600" />
        </div>

        <div>
          <p className="text-base font-semibold tracking-tight text-teal-950">
            {copy.title}
          </p>
          <p className="mt-1 text-sm text-teal-950/55">{copy.detail}</p>
        </div>
      </div>
    </div>,
    document.body
  )
}
