"use client"

import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Soft fade-in when entering the landing page — no splash/loader.
 */
export function HomeEntrance({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      setReady(true)
      return
    }
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className={cn(
        "flex min-h-full flex-1 flex-col transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        ready ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
    >
      {children}
    </div>
  )
}
