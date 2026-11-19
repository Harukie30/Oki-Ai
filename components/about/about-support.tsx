"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/about/donate-modal"
import { SupportModal } from "@/components/about/support-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon, Money01Icon } from "@hugeicons/core-free-icons"

export function AboutSupport() {
  const [supportOpen, setSupportOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
          Community
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
          Want to help or support Oki-Ai?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
          Share the project, leave a star, say hi  or send an optional tip via
          QR, GCash, or Maya Bank.
        </p>

        <div className="mt-7 inline-flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
            onClick={() => setSupportOpen(true)}
          >
            <HugeiconsIcon
              icon={FavouriteIcon}
              strokeWidth={1.75}
              data-icon="inline-start"
            />
            Ways to support
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-teal-900/15 bg-white/80 text-teal-900 hover:border-teal-500/35 hover:bg-teal-50 sm:w-auto"
            onClick={() => setDonateOpen(true)}
          >
            <HugeiconsIcon
              icon={Money01Icon}
              strokeWidth={1.75}
              data-icon="inline-start"
            />
            Donate
          </Button>
        </div>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  )
}
