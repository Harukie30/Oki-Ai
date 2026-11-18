"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AboutModalShell } from "@/components/about/about-modal-shell"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Copy01Icon,
  FavouriteIcon,
  Share08Icon,
  SparklesIcon,
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
  icon?: IconSvgElement
  logoSrc?: string
  accent: string
}

const SUPPORT_ACTIONS: SupportAction[] = [
  {
    id: "share",
    title: "Share Oki-Ai",
    detail: "Send the site to a friend who could use a kinder code review.",
    cta: "Copy link",
    copyText: "https://oki-ai-five.vercel.app",
    icon: Share08Icon,
    accent: "bg-teal-500/12 text-teal-800",
  },
  {
    id: "github",
    title: "Star the repo",
    detail: "A star helps others find Oki-Ai and keeps the project visible.",
    cta: "Open GitHub",
    href: "https://github.com",
    logoSrc: "/github.png",
    accent: "bg-white",
  },
  {
    id: "discord",
    title: "Join the chat",
    detail: "Share feedback, report bugs, or hang with other builders.",
    cta: "Open Discord",
    href: "https://discord.com",
    logoSrc: "/discord.png",
    accent: "bg-white",
  },
  {
    id: "kindness",
    title: "Try a gentle review",
    detail: "Use Oki-Ai yourself — the kindest support is putting it to work.",
    cta: "Start reviewing",
    href: "/review",
    icon: SparklesIcon,
    accent: "bg-emerald-500/12 text-emerald-900",
  },
]

interface SupportModalProps {
  open: boolean
  onClose: () => void
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) setCopiedId(null)
  }, [open])

  useEffect(() => {
    if (!copiedId) return
    const timer = window.setTimeout(() => setCopiedId(null), 1600)
    return () => window.clearTimeout(timer)
  }, [copiedId])

  async function handleCopy(action: SupportAction) {
    const text = action.copyText ?? ""
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
      maxWidthClassName="max-w-2xl"
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
          Community care
        </p>
        <h2
          id="support-modal-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-teal-950 sm:text-[1.7rem]"
        >
          Want to help keep reviews kinder?
        </h2>
        <p
          id="support-modal-detail"
          className="mt-2 text-sm leading-relaxed text-teal-950/65"
        >
          Oki-Ai stays free and calm with community support. Pick a small way to
          help — no pressure, just kindness.
        </p>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {SUPPORT_ACTIONS.map((action, index) => {
            const copied = copiedId === action.id
            const isCopy = Boolean(action.copyText)
            const isInternal = action.href?.startsWith("/")

            return (
              <li
                key={action.id}
                className={cn(
                  "group/action relative flex flex-col overflow-hidden rounded-2xl border border-teal-900/8 bg-white/75 p-3.5",
                  "shadow-[0_12px_30px_-24px_rgba(8,60,70,0.4)] backdrop-blur-sm",
                  "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "hover:-translate-y-0.5 hover:border-teal-500/20 hover:bg-white hover:shadow-[0_18px_40px_-22px_rgba(8,60,70,0.5)]",
                  index === 0 && "sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                )}
                style={{
                  transitionDelay: open ? `${index * 40}ms` : "0ms",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-teal-300/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover/action:opacity-100"
                />

                <div className="relative flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-teal-900/8 shadow-sm",
                      "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/action:scale-105",
                      action.accent
                    )}
                  >
                    {action.logoSrc ? (
                      <Image
                        src={action.logoSrc}
                        alt=""
                        width={28}
                        height={28}
                        className="size-6 object-contain"
                      />
                    ) : action.icon ? (
                      <HugeiconsIcon
                        icon={action.icon}
                        strokeWidth={1.75}
                        className="size-4"
                      />
                    ) : null}
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

                <div className="relative mt-3 sm:mt-0">
                  {isCopy ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "w-full shrink-0 border-teal-900/10 bg-white/80 sm:w-auto",
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
                      className={cn(
                        "w-full shrink-0 sm:w-auto",
                        isInternal
                          ? "bg-teal-600 text-white hover:bg-teal-500"
                          : "border border-teal-900/10 bg-white/80 text-teal-900 hover:bg-teal-50"
                      )}
                      variant={isInternal ? "default" : "outline"}
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
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-teal-900/45">
          Every share, star, and kind note helps Oki-Ai stay gentle and free.
        </p>

        <div className="mt-5 flex justify-end">
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
