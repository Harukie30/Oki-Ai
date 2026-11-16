"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealVariant = "up" | "fade" | "left" | "right" | "scale"
type RevealPhase = "hidden-below" | "hidden-above" | "visible"

interface RevealProps {
  children: ReactNode
  className?: string
  variant?: RevealVariant
  delayMs?: number
  /** Animate only the first time it enters view */
  once?: boolean
}

const enterFrom: Record<RevealVariant, Record<"below" | "above", string>> = {
  up: {
    below: "translate-y-6 opacity-0 blur-[2px] sm:translate-y-10 sm:blur-sm",
    above: "-translate-y-5 opacity-0 blur-[2px] sm:-translate-y-8 sm:blur-sm",
  },
  fade: {
    below: "opacity-0 blur-sm sm:blur-md",
    above: "opacity-0 blur-sm sm:blur-md",
  },
  left: {
    below:
      "-translate-x-4 translate-y-3 opacity-0 blur-[2px] sm:-translate-x-8 sm:translate-y-4 sm:blur-sm",
    above:
      "-translate-x-3 -translate-y-2 opacity-0 blur-[2px] sm:-translate-x-6 sm:-translate-y-3 sm:blur-sm",
  },
  right: {
    below:
      "translate-x-4 translate-y-3 opacity-0 blur-[2px] sm:translate-x-8 sm:translate-y-4 sm:blur-sm",
    above:
      "translate-x-3 -translate-y-2 opacity-0 blur-[2px] sm:translate-x-6 sm:-translate-y-3 sm:blur-sm",
  },
  scale: {
    below:
      "translate-y-4 scale-[0.96] opacity-0 blur-[2px] sm:translate-y-6 sm:scale-[0.94] sm:blur-sm",
    above:
      "-translate-y-3 scale-[0.97] opacity-0 blur-[2px] sm:-translate-y-5 sm:scale-[0.96] sm:blur-sm",
  },
}

export function Reveal({
  children,
  className,
  variant = "up",
  delayMs = 0,
  once = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<RevealPhase>("hidden-below")
  const hasShown = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      setPhase("visible")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasShown.current = true
          setPhase("visible")
          if (once) observer.unobserve(node)
          return
        }

        if (once && hasShown.current) return

        const next: RevealPhase =
          entry.boundingClientRect.top < 0 ? "hidden-above" : "hidden-below"
        setPhase(next)
      },
      {
        threshold: [0, 0.12, 0.28],
        rootMargin: "0px 0px -8% 0px",
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const hiddenClass =
    phase === "hidden-above"
      ? enterFrom[variant].above
      : enterFrom[variant].below

  return (
    <div
      ref={ref}
      data-reveal={phase}
      className={cn(
        "will-change-[opacity,transform,filter]",
        phase === "visible"
          ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:duration-1000"
          : cn(
              hiddenClass,
              "transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            ),
        className
      )}
      style={{
        transitionDelay: phase === "visible" ? `${delayMs}ms` : "0ms",
      }}
    >
      {children}
    </div>
  )
}
