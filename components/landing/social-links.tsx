"use client"

import { useState } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  DiscordIcon,
  GithubIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const SOCIAL_LINKS: {
  label: string
  href: string
  icon: IconSvgElement
}[] = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: GithubIcon,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: NewTwitterIcon,
  },
  {
    label: "Discord",
    href: "https://discord.com",
    icon: DiscordIcon,
  },
]

export function SocialLinks({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        {SOCIAL_LINKS.map((social) => {
          const isActive = active === social.label
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              onMouseEnter={() => setActive(social.label)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(social.label)}
              onBlur={() => setActive(null)}
              className={cn(
                "group relative inline-flex size-10 items-center justify-center rounded-full",
                "border border-teal-900/10 bg-white/80 text-teal-900/70 shadow-sm",
                "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:-translate-y-1 hover:scale-110 hover:border-teal-600/40 hover:bg-teal-600 hover:text-white hover:shadow-[0_12px_24px_-12px_rgba(13,148,136,0.75)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4fbfa]",
                "active:translate-y-0 active:scale-95 active:shadow-none",
                isActive &&
                  "border-teal-600/40 bg-teal-600 text-white shadow-[0_12px_24px_-12px_rgba(13,148,136,0.75)]"
              )}
            >
              <HugeiconsIcon
                icon={social.icon}
                strokeWidth={1.75}
                className="size-4 transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
              />
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-teal-950 px-2 py-1 text-[10px] font-medium tracking-wide text-teal-50",
                  "opacity-0 transition-[opacity,transform] duration-200",
                  "translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                )}
              >
                {social.label}
              </span>
            </a>
          )
        })}
      </div>
      <p className="min-h-4 text-xs text-teal-900/45 sm:min-h-5">
        {active ? `Open ${active}` : "\u00A0"}
      </p>
    </div>
  )
}
