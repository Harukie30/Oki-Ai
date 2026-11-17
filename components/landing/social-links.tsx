"use client"

import { useState } from "react"
import {
  DiscordIcon,
  GithubIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import {
  SocialInviteModal,
  type SocialInvite,
} from "@/components/landing/social-invite-modal"

const SOCIAL_LINKS: SocialInvite[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    cue: "open source",
    title: "Star us on GitHub",
    detail:
      "Follow the repo for updates, issues, and the latest Oki-Ai builds. We’ll drop the official link here once it’s live.",
    cta: "Open GitHub",
    icon: GithubIcon,
    artwork: "/github.png",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com",
    cue: "updates",
    title: "Follow us on X",
    detail:
      "Catch shipping notes, tips, and calm code-review vibes. Official handle coming soon — for now this opens X.",
    cta: "Follow on X",
    icon: NewTwitterIcon,
    artwork: "/twitter.png",
  },
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.com",
    cue: "community",
    title: "Join our Discord",
    detail:
      "Chat with other builders, share snippets, and get feedback. Invite link will land here when the server is ready.",
    cta: "Join Discord",
    icon: DiscordIcon,
    artwork: "/discord.png",
  },
]

export function SocialLinks({ className }: { className?: string }) {
  const [active, setActive] = useState<SocialInvite | null>(null)

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
          Connect
        </p>
        <ul className="flex flex-wrap items-center gap-2">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.id}>
              <button
                type="button"
                onClick={() => setActive(social)}
                aria-label={`Open ${social.label} invite`}
                className={cn(
                  "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl",
                  "border border-teal-900/10 bg-white/55 px-3 py-2 backdrop-blur-sm",
                  "text-sm font-medium text-teal-900/75",
                  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "hover:-translate-y-0.5 hover:border-teal-500/35 hover:bg-teal-50/90 hover:text-teal-950",
                  "hover:shadow-[0_14px_32px_-18px_rgba(13,148,136,0.55)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef8f6]",
                  "active:translate-y-0 active:shadow-none"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-teal-300/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
                />
                <span className="relative inline-flex size-7 items-center justify-center rounded-lg bg-teal-900/[0.04] text-teal-800 transition-colors duration-300 group-hover:bg-teal-500/15 group-hover:text-teal-700">
                  <HugeiconsIcon
                    icon={social.icon}
                    strokeWidth={1.75}
                    className="size-3.5 transition-transform duration-300 group-hover:scale-110"
                  />
                </span>
                <span className="relative flex flex-col items-start leading-none">
                  <span>{social.label}</span>
                  <span className="mt-0.5 text-[10px] font-normal tracking-wide text-teal-900/40 transition-colors duration-300 group-hover:text-teal-700/55">
                    {social.cue}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <SocialInviteModal
        social={active}
        open={active !== null}
        onClose={() => setActive(null)}
      />
    </>
  )
}
