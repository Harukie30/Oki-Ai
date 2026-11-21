"use client"

import { useEffect, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  CircleLock01Icon,
  Mail01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

type AuthMode = "sign-in" | "sign-up"

interface AuthModalProps {
  open: boolean
  mode?: AuthMode
  onClose: () => void
  onSuccess?: () => void
}

const SIGN_UP_PERKS = [
  "Unlimited reviews on this account",
  "Save progress across browsers",
  "Same kinder review voice you already use",
]

export function AuthModal({
  open,
  mode: initialMode = "sign-in",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { refresh, beginAuthTransition, endAuthTransition } = useOkiAuth()
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    setMode(initialMode)
    setError(null)
  }, [open, initialMode])

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    beginAuthTransition(mode === "sign-up" ? "signing-up" : "signing-in")

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Oki user",
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || "Could not create account")
          await endAuthTransition()
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || "Could not sign in")
          await endAuthTransition()
          return
        }
      }

      await refresh()
      onSuccess?.()
      onClose()
      setPassword("")
      await endAuthTransition()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      await endAuthTransition()
    } finally {
      setSubmitting(false)
    }
  }

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
        aria-labelledby="auth-modal-title"
        className={cn(
          "relative flex w-full max-w-[26rem] max-h-[min(92dvh,40rem)] flex-col overflow-hidden rounded-[1.75rem]",
          "border border-teal-900/10 bg-[#f7fffe]",
          "shadow-[0_36px_90px_-30px_rgba(8,60,70,0.58)]",
          "animate-in fade-in zoom-in-95 duration-200"
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
          className="pointer-events-none absolute right-5 top-6 z-[5] size-[4.25rem] sm:right-7 sm:top-7 sm:size-[4.75rem]"
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

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-7 sm:px-7">
          <OkiAiLogo size="sm" href={false} className="h-7" />

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
            {mode === "sign-in" ? "Welcome back" : "Join Oki-Ai"}
          </p>
          <h2
            id="auth-modal-title"
            className="mt-2 max-w-[14rem] text-xl font-semibold tracking-tight text-teal-950 sm:max-w-[15rem] sm:text-[1.35rem]"
          >
            {mode === "sign-in"
              ? "Sign in to keep reviewing"
              : "Create your free account"}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-teal-950/65">
            {mode === "sign-in"
              ? "Pick up where you left off — no guest limit, same calm review flow."
              : "A free account unlocks more reviews and keeps your workspace tied to you."}
          </p>

          <div
            role="tablist"
            aria-label="Account mode"
            className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-teal-900/8 bg-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          >
            {(
              [
                { id: "sign-in", label: "Sign in" },
                { id: "sign-up", label: "Sign up" },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setMode(tab.id)
                    setError(null)
                  }}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-teal-700 text-white shadow-[0_10px_24px_-14px_rgba(15,118,110,0.7)]"
                      : "text-teal-900/55 hover:bg-teal-900/[0.04] hover:text-teal-900"
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {mode === "sign-up" ? (
            <ul className="mt-4 space-y-2 rounded-2xl border border-teal-900/8 bg-white/55 px-3.5 py-3">
              {SIGN_UP_PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2 text-[13px] leading-snug text-teal-950/70"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-teal-600/12 text-teal-700">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="size-2.5"
                    />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          ) : null}

          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => void handleSubmit(e)}
          >
            {mode === "sign-up" ? (
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-800/60">
                  Name
                </span>
                <span className="relative block">
                  <HugeiconsIcon
                    icon={UserIcon}
                    strokeWidth={1.75}
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-teal-800/35"
                  />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-teal-900/10 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-teal-950 outline-none ring-teal-500/30 placeholder:text-teal-900/35 focus:ring-2"
                    placeholder="Your name"
                  />
                </span>
              </label>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-800/60">
                Email
              </span>
              <span className="relative block">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-teal-800/35"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-teal-900/10 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-teal-950 outline-none ring-teal-500/30 placeholder:text-teal-900/35 focus:ring-2"
                  placeholder="you@example.com"
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-800/60">
                Password
              </span>
              <span className="relative block">
                <HugeiconsIcon
                  icon={CircleLock01Icon}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-teal-800/35"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  className="w-full rounded-xl border border-teal-900/10 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-teal-950 outline-none ring-teal-500/30 placeholder:text-teal-900/35 focus:ring-2"
                  placeholder="At least 8 characters"
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full bg-teal-600 text-white shadow-[0_14px_28px_-16px_rgba(13,148,136,0.85)] hover:bg-teal-500"
            >
              {submitting
                ? "Please wait…"
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-teal-950/45">
            Email and password only for now — calm, local accounts for Oki-Ai.
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
