"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function CtaBand() {
  const [hovered, setHovered] = useState(false)

  return (
    <section
      id="start-review"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-teal-900/8 bg-teal-950 text-teal-50 sm:scroll-mt-20"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_0%_50%,rgba(45,212,191,0.22),transparent_55%)] transition-opacity duration-700 ease-out",
          hovered ? "opacity-100" : "opacity-40"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-teal-700/80 via-teal-500/35 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hovered ? "translate-x-0" : "-translate-x-[108%]"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-[-20%] left-0 w-[42%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-teal-200/30 to-transparent blur-md transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hovered
            ? "translate-x-[220%] opacity-100"
            : "-translate-x-[130%] opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700 [background-image:linear-gradient(rgba(153,246,228,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(153,246,228,0.14)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,black_0%,transparent_75%)]",
          hovered ? "opacity-[0.22]" : "opacity-0"
        )}
      />

      {/* Logo on the left — size/position scale with the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1 z-[1] flex w-[min(62%,22rem)] items-center sm:left-2 sm:w-[min(54%,28rem)] md:left-4 md:w-[min(48%,32rem)] lg:left-6 lg:w-[min(44%,36rem)]"
      >
        <Image
          src="/brand/oki-ai-logo.png"
          alt=""
          width={520}
          height={616}
          sizes="(max-width: 640px) 22rem, (max-width: 768px) 28rem, (max-width: 1024px) 32rem, 36rem"
          className={cn(
            "h-auto max-h-[min(95%,32rem)] w-full object-contain object-left opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hovered && "opacity-70"
          )}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-stretch gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-20">
        <Reveal variant="up" className="max-w-lg" delayMs={60}>
          <h2
            className={cn(
              "text-2xl font-semibold tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl",
              hovered && "translate-x-1"
            )}
          >
            Ready to review a snippet?
          </h2>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed transition-colors duration-700 sm:text-base",
              hovered ? "text-teal-50/85" : "text-teal-100/70"
            )}
          >
            Open the workspace, paste code, and see findings in seconds.
          </p>
        </Reveal>
        <Reveal variant="scale" delayMs={220} className="w-full sm:w-auto">
          <div
            className="w-full sm:w-auto"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setHovered(false)
              }
            }}
          >
            <Button
              size="lg"
              className={cn(
                "group/cta-btn relative z-10 w-full overflow-hidden bg-teal-400 text-teal-950 sm:w-auto",
                "shadow-[0_0_0_0_rgba(45,212,191,0)] transition-[background-color,box-shadow,transform] duration-500",
                "hover:bg-teal-300 hover:shadow-[0_0_36px_-4px_rgba(45,212,191,0.65)]",
                hovered &&
                  "bg-teal-300 shadow-[0_0_36px_-4px_rgba(45,212,191,0.65)]"
              )}
              nativeButton={false}
              render={<Link href="/review" data-cta="" />}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta-btn:translate-x-full"
              />
              <span className="relative">Start reviewing</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                data-icon="inline-end"
                className="relative transition-transform duration-300 group-hover/cta-btn:translate-x-0.5"
              />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
