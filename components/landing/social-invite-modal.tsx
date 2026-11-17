"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export type SocialInvite = {
  id: string
  label: string
  href: string
  title: string
  detail: string
  cta: string
  cue: string
  icon: IconSvgElement
  artwork: string
}

interface SocialInviteModalProps {
  social: SocialInvite | null
  open: boolean
  onClose: () => void
}

export function SocialInviteModal({
  social,
  open,
  onClose,
}: SocialInviteModalProps) {
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

  if (!mounted || !open || !social) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-teal-950/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-invite-title"
        aria-describedby="social-invite-detail"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-900/10 bg-[#f7fffe] shadow-[0_30px_80px_-28px_rgba(8,60,70,0.55)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.3),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-cyan-200/35 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-7 top-8 z-[5] size-[4.5rem] sm:right-9 sm:top-9 sm:size-20"
        >
          <Image
            src={social.artwork}
            alt=""
            width={96}
            height={96}
            className="size-full object-contain drop-shadow-[0_12px_28px_rgba(8,60,70,0.22)]"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-[#f7fffe]/80 text-teal-900/50 backdrop-blur-sm transition-colors hover:bg-teal-900/5 hover:text-teal-900"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
        </button>

        <div className="relative px-6 pb-6 pt-7 pr-28 sm:px-7 sm:pr-32">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",
              "bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10"
            )}
          >
            <HugeiconsIcon icon={social.icon} strokeWidth={1.75} className="size-6" />
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/60">
            {social.cue}
          </p>
          <h2
            id="social-invite-title"
            className="mt-2 text-xl font-semibold tracking-tight text-teal-950 sm:text-2xl"
          >
            {social.title}
          </h2>
          <p
            id="social-invite-detail"
            className="mt-2 text-sm leading-relaxed text-teal-950/65"
          >
            {social.detail}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full border-teal-900/10 text-teal-900/75 hover:bg-teal-50 sm:w-auto"
              onClick={onClose}
            >
              Maybe later
            </Button>
            <Button
              className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
              nativeButton={false}
              render={
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                />
              }
            >
              {social.cta}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                data-icon="inline-end"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
