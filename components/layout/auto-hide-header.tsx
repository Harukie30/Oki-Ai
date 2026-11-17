"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const TOP_REVEAL_PX = 80
const HIDE_DELAY_MS = 180
const MOTION = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"

interface AutoHideHeaderProps {
  children: ReactNode
  className?: string
  barClassName?: string
  /** When true, sets --oki-nav-shift so review content can pad down without page scrollbar. */
  pushContent?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Header stays hidden until the pointer nears the top of the viewport
 * (or focuses inside the nav). Always visible on touch / coarse pointers.
 *
 * The slide is clipped inside a fixed overflow shell so transform never
 * expands document scroll overflow (which caused a scrollbar flash).
 */
export function AutoHideHeader({
  children,
  className,
  barClassName,
  pushContent = false,
  onOpenChange,
}: AutoHideHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const hideTimerRef = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [forceVisible, setForceVisible] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(72)

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    function syncForce() {
      setForceVisible(coarse.matches || reduceMotion.matches)
    }

    syncForce()
    coarse.addEventListener("change", syncForce)
    reduceMotion.addEventListener("change", syncForce)

    return () => {
      coarse.removeEventListener("change", syncForce)
      reduceMotion.removeEventListener("change", syncForce)
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    function measure() {
      if (!headerRef.current) return
      setHeaderHeight(headerRef.current.offsetHeight)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (forceVisible) {
      setVisible(true)
      return
    }

    function clearHideTimer() {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }

    function show() {
      clearHideTimer()
      setVisible(true)
    }

    function scheduleHide() {
      clearHideTimer()
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false)
        hideTimerRef.current = null
      }, HIDE_DELAY_MS)
    }

    function updateVisibility(clientX: number, clientY: number) {
      if (clientY <= TOP_REVEAL_PX) {
        show()
        return
      }

      const header = headerRef.current
      if (!header) {
        scheduleHide()
        return
      }

      const el = document.elementFromPoint(clientX, clientY)
      if (el && header.contains(el)) {
        show()
        return
      }

      scheduleHide()
    }

    function onMove(event: MouseEvent) {
      updateVisibility(event.clientX, event.clientY)
    }

    function onLeave() {
      scheduleHide()
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)

    return () => {
      clearHideTimer()
      window.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [forceVisible])

  const shown = forceVisible || visible

  useEffect(() => {
    onOpenChange?.(shown)
  }, [shown, onOpenChange])

  useEffect(() => {
    if (!pushContent) return

    document.documentElement.style.setProperty(
      "--oki-nav-shift",
      shown ? `${headerHeight}px` : "0px"
    )

    return () => {
      document.documentElement.style.setProperty("--oki-nav-shift", "0px")
    }
  }, [pushContent, shown, headerHeight])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 overflow-hidden"
      style={{ height: headerHeight }}
    >
      <header
        ref={headerRef}
        onFocusCapture={() => setVisible(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setVisible(forceVisible)
          }
        }}
        className={cn(
          "pointer-events-auto w-full will-change-transform",
          "border-b border-teal-900/8 bg-[#f4fbfa]/90 shadow-[0_16px_48px_-28px_rgba(8,60,70,0.4)] backdrop-blur-md",
          forceVisible
            ? "translate-y-0"
            : cn(
                "transition-transform",
                MOTION,
                shown
                  ? "translate-y-0"
                  : "pointer-events-none -translate-y-full"
              ),
          className
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5",
            !forceVisible && cn("transition-opacity", MOTION),
            !forceVisible && (shown ? "opacity-100" : "opacity-0"),
            barClassName
          )}
        >
          {children}
        </div>
      </header>
    </div>
  )
}
