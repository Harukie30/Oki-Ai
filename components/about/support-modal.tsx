"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Cancel01Icon,
  Copy01Icon,
  DiscordIcon,
  FavouriteIcon,
  GithubIcon,
  Share08Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type SupportAction = {
  id: string
  title: string
  detail: string
  cta: string
  href?: string
  copyText?: string
  icon: IconSvgElement
}

const SUPPORT_ACTIONS: SupportAction[] = [
  {
    id: "share",
    title: "Share Oki-Ai",
    detail: "Send the site to a friend who could use a kinder code review.",
    cta: "Copy link",
    copyText: "https://oki-ai.app",
    icon: Share08Icon,
  },
  {
    id: "github",
    title: "Star the repo",
    detail: "A star helps others find Oki-Ai and keeps the project visible.",
    cta: "Open GitHub",
    href: "https://github.com",
    icon: GithubIcon,
  },
  {
    id: "discord",
    title: "Join the chat",
    detail: "Share feedback, report bugs, or hang with other builders.",
    cta: "Open Discord",
    href: "https://discord.com",
    icon: DiscordIcon,
  },
  {
    id: "kindness",
    title: "Keep it kind",
    detail:
      "Use Oki-Ai, tell us what feels helpful, and help shape gentler reviews.",
    cta: "Start a review",
    href: "/review",
    icon: FavouriteIcon,
  },
]

interface SupportModalProps {
  open: boolean
  onClose: () => void
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  useEffect(() => {
    if (!copiedId) return
    const timer = window.setTimeout(() => setCopiedId(null), 1600)
    return () => window.clearTimeout(timer)
  }, [copiedId])

  async function handleCopy(action: SupportAction) {
    const text =
      action.copyText ??
      (typeof window !== "undefined" ? window.location.origin : "")
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(action.id)
    } catch {
      setCopiedId(null)
    }
  }

  if (!mounted || !open) return null

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
        aria-labelledby="support-modal-title"
        aria-describedby="support-modal-detail"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-teal-900/10 bg-[#f7fffe] shadow-[0_30px_80px_-28px_rgba(8,60,70,0.55)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.3),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-10 h-40 w-40 rounded-full bg-cyan-200/35 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-7 z-[5] size-16 sm:right-8 sm:top-8 sm:size-[4.5rem]"
        >
          <Image
            src="/brand/oki-ai-logo.png"
            alt=""
            width={96}
            height={114}
            className="h-full w-auto object-contain opacity-90 drop-shadow-[0_12px_28px_rgba(8,60,70,0.22)]"
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

        <div className="relative px-6 pb-6 pt-7 pr-24 sm:px-7 sm:pr-28">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10">
            <HugeiconsIcon
              icon={FavouriteIcon}
              strokeWidth={1.75}
              className="size-6"
            />
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/60">
            Support Oki-Ai
          </p>
          <h2
            id="support-modal-title"
            className="mt-2 text-xl font-semibold tracking-tight text-teal-950 sm:text-2xl"
          >
            Want to help keep reviews kinder?
          </h2>
          <p
            id="support-modal-detail"
            className="mt-2 text-sm leading-relaxed text-teal-950/65"
          >
            Oki-Ai stays free and calm with community support. Pick a small way
            to help — no pressure, just kindness.
          </p>

          <ul className="mt-5 space-y-2.5">
            {SUPPORT_ACTIONS.map((action) => {
              const copied = copiedId === action.id
              const isCopy = Boolean(action.copyText)
              const isInternal = action.href?.startsWith("/")

              return (
                <li
                  key={action.id}
                  className="flex flex-col gap-3 rounded-2xl border border-teal-900/8 bg-white/70 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-900/[0.04] text-teal-800">
                      <HugeiconsIcon
                        icon={action.icon}
                        strokeWidth={1.75}
                        className="size-4"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-teal-950">
                        {action.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-teal-950/60">
                        {action.detail}
                      </p>
                    </div>
                  </div>

                  {isCopy ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "w-full shrink-0 border-teal-900/10 sm:w-auto",
                        copied && "border-teal-500/30 bg-teal-50 text-teal-800"
                      )}
                      onClick={() => void handleCopy(action)}
                    >
                      <HugeiconsIcon
                        icon={copied ? Tick02Icon : Copy01Icon}
                        strokeWidth={1.75}
                        data-icon="inline-start"
                      />
                      {copied ? "Copied" : action.cta}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full shrink-0 bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
                      nativeButton={false}
                      render={
                        <a
                          href={action.href}
                          {...(isInternal
                            ? {}
                            : {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              })}
                          onClick={onClose}
                        />
                      }
                    >
                      {action.cta}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-5 flex justify-end">
            <Button
              variant="outline"
              className="w-full border-teal-900/10 text-teal-900/75 hover:bg-teal-50 sm:w-auto"
              onClick={onClose}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
