"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AccountModal } from "@/components/auth/account-modal"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Folder01Icon,
  Home01Icon,
  Logout01Icon,
  Menu01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"

export type DashboardSection = "review" | "account"

const NAV = [
  {
    id: "review" as const,
    href: "/review",
    label: "Review",
    detail: "IDE workspace",
    icon: SourceCodeIcon,
  },
  {
    id: "account" as const,
    href: "/account",
    label: "Saved",
    detail: "Recent reviews",
    icon: Folder01Icon,
  },
]

function Atmosphere() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(45,212,191,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,116,144,0.12),_transparent_50%),linear-gradient(180deg,#f4fbfa_0%,#eef6f5_45%,#f7faf9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-[0.3] lg:block [background-image:linear-gradient(rgba(15,80,90,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,80,90,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]"
      />
    </>
  )
}

function SidebarNav({
  active,
  onNavigate,
}: {
  active: DashboardSection
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 pt-4" aria-label="Dashboard">
      {NAV.map((item) => {
        const isActive = active === item.id
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              isActive
                ? "bg-teal-700 text-white shadow-sm"
                : "text-teal-950/70 hover:bg-teal-900/[0.06] hover:text-teal-950"
            )}
          >
            <HugeiconsIcon
              icon={item.icon}
              strokeWidth={1.75}
              className={cn(
                "size-4 shrink-0",
                isActive ? "text-white" : "text-teal-800/55 group-hover:text-teal-800"
              )}
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold tracking-tight">
                {item.label}
              </span>
              <span
                className={cn(
                  "block text-[11px]",
                  isActive ? "text-white/70" : "text-teal-950/40"
                )}
              >
                {item.detail}
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarAccount({
  onOpenAccount,
  onNavigate,
}: {
  onOpenAccount: () => void
  onNavigate?: () => void
}) {
  const { user, signOut } = useOkiAuth()
  if (!user) return null

  const initial = (user.name || user.email || "U").slice(0, 1).toUpperCase()

  return (
    <div className="mt-auto border-t border-teal-900/10 p-3">
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          onOpenAccount()
        }}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-teal-900/[0.05]"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-teal-950">
            {user.name || "Account"}
          </span>
          <span className="block truncate text-[11px] text-teal-950/45">
            {user.email}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          void signOut()
        }}
        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-teal-900/55 transition-colors hover:bg-teal-900/[0.05] hover:text-teal-950"
      >
        <HugeiconsIcon
          icon={Logout01Icon}
          strokeWidth={1.75}
          className="size-3.5"
        />
        Sign out
      </button>
    </div>
  )
}

function DashboardSidebar({
  active,
  mobileOpen,
  onClose,
  onOpenAccount,
}: {
  active: DashboardSection
  mobileOpen: boolean
  onClose: () => void
  onOpenAccount: () => void
}) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-teal-950/25 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16.5rem] flex-col border-r border-teal-900/10 bg-[#f7fbfa]/95 backdrop-blur-md",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:z-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-teal-900/10 px-4">
          <Link href="/review" onClick={onClose} className="min-w-0">
            <OkiAiLogo size="sm" href={false} />
          </Link>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-teal-900/60 hover:bg-teal-900/5 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
          </button>
        </div>

        <SidebarNav active={active} onNavigate={onClose} />
        <SidebarAccount onOpenAccount={onOpenAccount} onNavigate={onClose} />
      </aside>
    </>
  )
}

function DashboardNavbar({
  title,
  detail,
  onMenuOpen,
}: {
  title: string
  detail: string
  onMenuOpen: () => void
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-teal-900/10 bg-[#f7fbfa]/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-xl border border-teal-900/10 bg-white/80 text-teal-900/70 shadow-sm lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <HugeiconsIcon icon={Menu01Icon} strokeWidth={1.75} className="size-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-teal-950">
            {title}
          </p>
          <p className="hidden truncate text-[11px] text-teal-950/45 sm:block">
            {detail}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href="/" />}
        className="shrink-0"
      >
        <HugeiconsIcon icon={Home01Icon} strokeWidth={1.75} className="size-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Button>
    </header>
  )
}

export function DashboardShell({
  section,
  children,
  className,
}: {
  section: DashboardSection
  children: ReactNode
  className?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
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
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      html.style.height = prevHtmlHeight
      body.style.height = prevBodyHeight
    }
  }, [])

  const meta =
    section === "review"
      ? {
          title: "Review workspace",
          detail: "Paste code, run a review, compare SuggestedCode",
        }
      : {
          title: "Saved reviews",
          detail: "Open or delete reviews saved to your account",
        }

  return (
    <div className="relative flex h-svh min-h-0 min-w-0 flex-1 overflow-hidden">
      <Atmosphere />
      <DashboardSidebar
        active={section}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardNavbar
          title={meta.title}
          detail={meta.detail}
          onMenuOpen={() => setMobileOpen(true)}
        />
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain",
            className
          )}
        >
          {children}
        </main>
      </div>

      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  )
}
