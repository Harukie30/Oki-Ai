"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { AuthModal } from "@/components/auth/auth-modal"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { Button } from "@/components/ui/button"
import { GUEST_REVIEW_LIMIT } from "@/lib/guest-usage"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

interface ReviewRegisterModalProps {
  open: boolean
  onClose: () => void
}

export function ReviewRegisterModal({
  open,
  onClose,
}: ReviewRegisterModalProps) {
  const [mounted, setMounted] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-up")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      setAuthOpen(false)
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !authOpen) onClose()
    }

    window.addEventListener("keydown", onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previous
    }
  }, [open, onClose, authOpen])

  if (!mounted || !open) return null

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-teal-950/40 backdrop-blur-[3px]"
            onClick={onClose}
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
            aria-describedby="register-modal-detail"
            className={cn(
              "relative w-full max-w-[26rem] overflow-hidden rounded-[1.75rem]",
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
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={1.75}
                className="size-4"
              />
            </button>

            <div className="relative px-6 pb-6 pt-7 sm:px-7">
              <OkiAiLogo size="sm" href={false} className="h-7" />

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
                Free limit reached
              </p>
              <h2
                id="register-modal-title"
                className="mt-2 max-w-[15rem] text-xl font-semibold tracking-tight text-teal-950"
              >
                Register for more reviews
              </h2>
              <p
                id="register-modal-detail"
                className="mt-2 max-w-sm text-sm leading-relaxed text-teal-950/65"
              >
                Guests get{" "}
                <span className="font-semibold text-teal-950">
                  {GUEST_REVIEW_LIMIT} free reviews
                </span>{" "}
                on this browser. Create a free Oki-Ai account to keep going.
              </p>

              <ul className="mt-4 space-y-2 rounded-2xl border border-teal-900/8 bg-white/55 px-3.5 py-3">
                {[
                  "Keep reviewing without the guest cap",
                  "Same soft review UI you already know",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-[13px] leading-snug text-teal-950/70"
                  >
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-teal-600/12 text-teal-700">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2}
                        className="size-2.5"
                      />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={onClose}
                >
                  Not now
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-teal-700/20 text-teal-900 sm:w-auto"
                  onClick={() => {
                    setAuthMode("sign-in")
                    setAuthOpen(true)
                  }}
                >
                  Sign in
                </Button>
                <Button
                  className="w-full bg-teal-600 text-white shadow-[0_14px_28px_-16px_rgba(13,148,136,0.85)] hover:bg-teal-500 sm:w-auto"
                  onClick={() => {
                    setAuthMode("sign-up")
                    setAuthOpen(true)
                  }}
                >
                  Create account
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={onClose}
      />
    </>
  )
}
