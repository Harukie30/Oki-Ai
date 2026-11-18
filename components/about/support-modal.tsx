"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AboutModalShell } from "@/components/about/about-modal-shell"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ArrowRight01Icon,
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
  cue: string
  href?: string
  copyText?: string
  icon: IconSvgElement
}

const SUPPORT_ACTIONS: SupportAction[] = [
  {
    id: "share",
    title: "Share Oki-Ai",
    cue: "Spread the calm",
    detail: "Send the site to a friend who could use a kinder code review.",
    cta: "Copy link",
    copyText: "origin",
    icon: Share08Icon,
  },
  {
    id: "github",
    title: "Star the repo",
    cue: "Open source",
    detail: "A star helps others find Oki-Ai and keeps the project visible.",
    cta: "Open GitHub",
    href: "https://github.com",
    icon: GithubIcon,
  },
  {
    id: "discord",
    title: "Join the chat",
    cue: "Community",
    detail: "Share feedback, report bugs, or hang with other builders.",
    cta: "Open Discord",
    href: "https://discord.com",
    icon: DiscordIcon,
  },
  {
    id: "kindness",
    title: "Keep it kind",
    cue: "Use it",
    detail: "Run a review, notice what helps, and help shape gentler feedback.",
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
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedId) return
    const timer = window.setTimeout(() => setCopiedId(null), 1600)
    return () => window.clearTimeout(timer)
  }, [copiedId])

  async function handleCopy(action: SupportAction) {
    const text =
      action.copyText === "origin"
        ? window.location.origin
        : (action.copyText ?? window.location.origin)
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(action.id)
    } catch {
      setCopiedId(null)
    }
  }

  return (
    <AboutModalShell
      open={open}
      onClose={onClose}
      labelledBy="support-modal-title"
      describedBy="support-modal-detail"
      maxWidthClassName="max-w-xl"
    >
      <div className="px-6 pb-6 pt-8 pr-24 sm:px-8 sm:pb-7 sm:pr-28 sm:pt-9">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10">
          <HugeiconsIcon
            icon={FavouriteIcon}
            strokeWidth={1.75}
            className="size-6"
          />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/60">
          Built to make code reviews feel kinder
        </p>
        <h2
          id="support-modal-title"
          className="mt-2 max-w-[18ch] text-2xl font-semibold tracking-tight text-teal-950 sm:text-[1.7rem]"
        >
          Help Oki-Ai grow gently
        </h2>
        <p
          id="support-modal-detail"
          className="mt-2 max-w-md text-sm leading-relaxed text-teal-950/65"
        >
          Small acts of support keep the project calm and useful — share it,
          star it, or say hello. No pressure.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {SUPPORT_ACTIONS.map((action) => {
            const copied = copiedId === action.id
            const isCopy = Boolean(action.copyText)
            const isInternal = action.href?.startsWith("/")

            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-900/[0.04] text-teal-800 transition-colors group-hover:bg-teal-500/12 group-hover:text-teal-700">
                    <HugeiconsIcon
                      icon={
                        isCopy && copied ? Tick02Icon : action.icon
                      }
                      strokeWidth={1.75}
                      className="size-4"
                    />
                  </span>
                  <span className="rounded-full border border-teal-900/8 bg-white/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-teal-800/55">
                    {action.cue}
                  </span>
                </div>
                <div className="mt-3 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-teal-950">
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-teal-950/60">
                    {action.detail}
                  </p>
                </div>
                <p
                  className={cn(
                    "mt-3 inline-flex items-center gap-1 text-[11px] font-semibold",
                    isCopy && copied
                      ? "text-teal-700"
                      : "text-teal-700/70 group-hover:text-teal-800"
                  )}
                >
                  {isCopy && copied ? "Copied" : action.cta}
                  {!isCopy || !copied ? (
                    <HugeiconsIcon
                      icon={isCopy ? Copy01Icon : ArrowRight01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  ) : null}
                </p>
              </>
            )

            const cardClass = cn(
              "group flex h-full min-h-[9.5rem] flex-col rounded-2xl border border-teal-900/8 bg-white/75 p-4 text-left shadow-[0_12px_30px_-24px_rgba(8,60,70,0.45)] backdrop-blur-sm",
              "transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:-translate-y-0.5 hover:border-teal-500/30 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(13,148,136,0.45)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            )

            if (isCopy) {
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={() => void handleCopy(action)}
                    className={cn(cardClass, "w-full")}
                  >
                    {body}
                  </button>
                </li>
              )
            }

            if (isInternal) {
              return (
                <li key={action.id}>
                  <Link
                    href={action.href!}
                    onClick={onClose}
                    className={cn(cardClass, "w-full")}
                  >
                    {body}
                  </Link>
                </li>
              )
            }

            return (
              <li key={action.id}>
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={cn(cardClass, "w-full")}
                >
                  {body}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="w-full border-teal-900/10 bg-white/60 text-teal-900/75 hover:bg-teal-50 sm:w-auto"
            onClick={onClose}
          >
            Maybe later
          </Button>
        </div>
      </div>
    </AboutModalShell>
  )
}
