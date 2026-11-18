"use client"

import Image from "next/image"
import { Reveal } from "@/components/landing/reveal"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  LanguageCircleIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const STEPS: {
  step: string
  title: string
  detail: string
  cue: string
  icon: IconSvgElement
  hoverSrc: string
  hoverAlt: string
  /** Image fit inside the pop-up tile */
  hoverFit: "contain" | "cover"
  /** Extra frame treatment for the asset */
  hoverFrame: "rounded" | "circle" | "window"
}[] = [
  {
    step: "01",
    title: "Choose your language",
    detail:
      "Pick web, backend, or systems — so the review matches the kind of code you’re shipping.",
    icon: LanguageCircleIcon,
    cue: "web · backend · systems",
    hoverSrc: "/coding-language.png",
    hoverAlt: "Programming languages",
    hoverFit: "contain",
    hoverFrame: "rounded",
  },
  {
    step: "02",
    title: "Paste your code",
    detail:
      "Drop in a snippet in the editor. No setup, no repo sync required.",
    icon: SourceCodeIcon,
    cue: "paste → review",
    hoverSrc: "/paper.png",
    hoverAlt: "Paste and exchange code",
    hoverFit: "cover",
    hoverFrame: "circle",
  },
  {
    step: "03",
    title: "Fix with confidence",
    detail:
      "Get a score, ranked findings, and clear suggestions you can apply right away.",
    icon: CheckmarkCircle02Icon,
    cue: "score · findings · fixes",
    hoverSrc: "/browser.png",
    hoverAlt: "Review and fix in the editor",
    hoverFit: "cover",
    hoverFrame: "window",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden scroll-mt-16 border-t border-teal-900/8 sm:scroll-mt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(45,212,191,0.18),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(240,253,250,0.4)_48%,rgba(236,253,245,0.2)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-[280px] rounded-full bg-teal-300/25 blur-3xl animate-[pulse_8s_ease-in-out_infinite] sm:-left-16 sm:size-[360px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 size-[260px] rounded-full bg-cyan-300/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite] sm:-right-10 sm:size-[340px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-[42%] rounded-full border border-teal-500/10 sm:size-[640px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-[38%] rounded-full border border-dashed border-teal-600/15 sm:size-[420px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[18%] hidden size-24 rounded-full border border-teal-500/15 sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] bottom-[22%] hidden size-16 rotate-12 rounded-2xl border border-cyan-500/15 sm:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
        <Reveal variant="up" delayMs={40}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
              From language to clarity
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
              Choose the language, paste a snippet, then get actionable findings
              built for speed while you prototype.
            </p>
          </div>
        </Reveal>

        <ol className="relative mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16%] right-[16%] top-[calc(6.5rem+1.75rem)] hidden h-px sm:block"
          >
            <div className="h-full w-full bg-gradient-to-r from-teal-500/0 via-teal-600/35 to-teal-500/0" />
            <div className="absolute inset-y-0 left-0 w-1/3 animate-[pulse_3.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent blur-[1px]" />
          </div>

          {STEPS.map((item, index) => (
            <li key={item.step} className="group/step relative">
              <Reveal variant="up" delayMs={160 + index * 150}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 pt-[5.75rem] sm:pt-[6.5rem]">
                    {/* Hover pop-up: overshoot settle → float, stem draws in */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
                    >
                      <div className="oki-step-hover-pop relative will-change-transform">
                        <div
                          aria-hidden
                          className="oki-step-hover-glow absolute inset-0 translate-y-2 rounded-full bg-teal-400/30 blur-xl"
                        />
                        <div
                          className={cn(
                            "relative overflow-hidden border border-white/90 bg-white",
                            "shadow-[0_22px_48px_-18px_rgba(8,60,70,0.55)] ring-1 ring-teal-900/8",
                            item.hoverFrame === "circle"
                              ? "size-[5.75rem] rounded-full sm:size-[6.5rem]"
                              : item.hoverFrame === "window"
                                ? "h-[5rem] w-[7rem] rounded-2xl sm:h-[5.5rem] sm:w-[7.75rem]"
                                : "size-[5.75rem] rounded-2xl sm:size-[6.5rem]"
                          )}
                        >
                          <Image
                            src={item.hoverSrc}
                            alt=""
                            fill
                            sizes="120px"
                            className={cn(
                              item.hoverFit === "cover"
                                ? "object-cover"
                                : "object-contain p-2.5 sm:p-3",
                              item.hoverFrame === "rounded" && "bg-teal-950"
                            )}
                          />
                        </div>
                        <div className="oki-step-hover-stem mx-auto mt-1.5 h-3.5 w-px bg-gradient-to-b from-teal-500/45 via-teal-500/25 to-transparent" />
                      </div>
                    </div>

                    <div
                      className={cn(
                        "relative flex size-14 items-center justify-center rounded-full bg-teal-600 text-white",
                        "shadow-[0_16px_40px_-16px_rgba(13,148,136,0.75)] ring-4 ring-white/80",
                        "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "group-hover/step:scale-105 group-hover/step:shadow-[0_20px_48px_-14px_rgba(13,148,136,0.85)]"
                      )}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={1.75}
                        className="size-5"
                      />
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full",
                          "bg-teal-950 font-mono text-[10px] font-semibold text-teal-50",
                          "ring-2 ring-white/80 transition-transform duration-500",
                          "group-hover/step:scale-110"
                        )}
                      >
                        {item.step}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-teal-950 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-teal-950/65">
                    {item.detail}
                  </p>
                  <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-teal-700/55">
                    {item.cue}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
