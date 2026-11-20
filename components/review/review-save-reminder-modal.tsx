"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Copy01Icon } from "@hugeicons/core-free-icons"

interface ReviewSaveReminderModalProps {
  open: boolean
  onClose: () => void
}

export function ReviewSaveReminderModal({
  open,
  onClose,
}: ReviewSaveReminderModalProps) {
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-teal-950/35 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="save-reminder-title"
        aria-describedby="save-reminder-detail"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-900/10 bg-[#f7fffe] shadow-[0_30px_80px_-28px_rgba(8,60,70,0.55)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.28),transparent_70%)]"
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full text-teal-900/50 transition-colors hover:bg-teal-900/5 hover:text-teal-900"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.75} className="size-4" />
        </button>

        <div className="relative px-6 pb-6 pt-7 sm:px-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10">
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={1.75} className="size-6" />
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/55">
            Before you leave
          </p>
          <h2
            id="save-reminder-title"
            className="mt-2 text-xl font-semibold tracking-tight text-teal-950"
          >
            Save or copy your code
          </h2>
          <p
            id="save-reminder-detail"
            className="mt-2 text-sm leading-relaxed text-teal-950/65"
          >
            Oki-Ai doesn’t store your snippet. If you refresh, leave this page,
            switch language, or run a new review without saving, your editor
            text and SuggestedCode can be replaced or lost. Use{" "}
            <span className="font-semibold text-teal-950">Copy</span>,{" "}
            <span className="font-semibold text-teal-950">Download</span>, or{" "}
            <span className="font-semibold text-teal-950">Apply</span> while
            it’s here.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
              onClick={onClose}
            >
              I’ll save it
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
