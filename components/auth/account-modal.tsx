"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Folder01Icon,
  Logout01Icon,
  Mail01Icon,
  SourceCodeIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"

interface AccountModalProps {
  open: boolean
  onClose: () => void
}

export function AccountModal({ open, onClose }: AccountModalProps) {
  const { user, signOut } = useOkiAuth()
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

  if (!mounted || !open || !user) return null

  const initial = (user.name || user.email || "U").slice(0, 1).toUpperCase()

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close account"
        className="absolute inset-0 bg-teal-950/40 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem]",
          "border border-teal-900/10 bg-[#f7fbfa] shadow-[0_32px_80px_-28px_rgba(8,60,70,0.55)]"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.2),_transparent_55%)]"
        />

        <div className="relative flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
              Account
            </p>
            <h2
              id="account-modal-title"
              className="mt-1 text-xl font-semibold tracking-tight text-teal-950"
            >
              Your profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl border border-teal-900/10 bg-white/80 text-teal-900/60 transition-colors hover:bg-white hover:text-teal-950"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
          </button>
        </div>

        <div className="relative space-y-5 px-5 py-5 sm:px-6 sm:pb-6">
          <div className="flex items-center gap-4 rounded-2xl border border-teal-900/10 bg-white/80 px-4 py-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-teal-700 text-lg font-semibold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-teal-950">
                {user.name || "Account"}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-teal-950/55">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={1.75}
                  className="size-3.5 shrink-0"
                />
                {user.email}
              </p>
            </div>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl px-1 py-1">
              <dt className="flex items-center gap-2 text-teal-950/50">
                <HugeiconsIcon icon={UserIcon} strokeWidth={1.75} className="size-3.5" />
                Name
              </dt>
              <dd className="truncate font-medium text-teal-950">
                {user.name || "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl px-1 py-1">
              <dt className="flex items-center gap-2 text-teal-950/50">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.75} className="size-3.5" />
                Email
              </dt>
              <dd className="truncate font-medium text-teal-950">{user.email}</dd>
            </div>
          </dl>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              nativeButton={false}
              render={<Link href="/review" onClick={onClose} />}
            >
              <HugeiconsIcon
                icon={SourceCodeIcon}
                strokeWidth={1.75}
                className="size-3.5"
              />
              Review
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              nativeButton={false}
              render={<Link href="/account" onClick={onClose} />}
            >
              <HugeiconsIcon
                icon={Folder01Icon}
                strokeWidth={1.75}
                className="size-3.5"
              />
              Saved reviews
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full text-rose-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
            onClick={() => {
              void signOut()
              onClose()
            }}
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              strokeWidth={1.75}
              className="size-3.5"
            />
            Sign out
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
