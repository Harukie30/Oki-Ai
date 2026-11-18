"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface AboutModalShellProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  describedBy: string
  children: ReactNode
  className?: string
  maxWidthClassName?: string
}

/**
 * Shared Oki-Ai modal chrome: soft teal atmosphere, grid, logo, close control.
 */
export function AboutModalShell({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  className,
  maxWidthClassName = "max-w-md",
}: AboutModalShellProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-teal-950/40 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={cn(
          "relative flex w-full max-h-[min(92dvh,40rem)] flex-col overflow-hidden rounded-[1.75rem] border border-teal-900/10 bg-[#f7fffe]",
          "shadow-[0_36px_90px_-30px_rgba(8,60,70,0.58)]",
          "animate-in fade-in zoom-in-95 duration-200",
          maxWidthClassName,
          className
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.3),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(14,116,144,0.14),transparent_48%),linear-gradient(165deg,#f7fffe_0%,#eef8f6_48%,#f5faf9_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_38%,transparent_78%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-teal-300/25 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-7 z-[5] size-[4.25rem] sm:right-8 sm:top-8 sm:size-[4.75rem]"
        >
          <Image
            src="/brand/oki-ai-logo.png"
            alt=""
            width={96}
            height={114}
            className="h-full w-auto object-contain drop-shadow-[0_14px_30px_rgba(8,60,70,0.24)]"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/75 text-teal-900/50 backdrop-blur-sm transition-colors hover:bg-teal-900/5 hover:text-teal-900"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
        </button>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
