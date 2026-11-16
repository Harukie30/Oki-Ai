"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ReviewLoadingScreen } from "@/components/review/review-loading-screen"
import { cn } from "@/lib/utils"

const ENTRANCE_MS = 1100

/**
 * Brief branded splash when entering the review route,
 * so client navigations still feel intentional.
 */
export function ReviewEntrance({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion) {
      setVisible(false)
      return
    }

    const exitAt = window.setTimeout(() => setExiting(true), ENTRANCE_MS)
    const hideAt = window.setTimeout(() => setVisible(false), ENTRANCE_MS + 420)

    return () => {
      window.clearTimeout(exitAt)
      window.clearTimeout(hideAt)
    }
  }, [])

  return (
    <>
      {visible ? (
        <div
          className={cn(
            "fixed inset-0 z-50 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            exiting
              ? "pointer-events-none translate-y-1 scale-[1.01] opacity-0 blur-[2px]"
              : "opacity-100"
          )}
        >
          <ReviewLoadingScreen className="min-h-svh bg-[#f4fbfa]" />
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-h-full flex-1 flex-col transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible && !exiting
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        )}
      >
        {children}
      </div>
    </>
  )
}
