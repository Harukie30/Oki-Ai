"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SupportModal } from "@/components/about/support-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"

export function AboutSupport() {
  const [open, setOpen] = useState(false)

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
          If the kinder-review vibe resonates, there are a few gentle ways to
          help the project grow — share it, star it, or say hi.
        </p>
        <Button
          size="lg"
          className="mt-7 bg-teal-600 text-white hover:bg-teal-500"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            strokeWidth={1.75}
            data-icon="inline-start"
          />
          Ways to support
        </Button>
      </div>

      <SupportModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
