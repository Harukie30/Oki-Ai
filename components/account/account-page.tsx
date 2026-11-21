"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AccountControls } from "@/components/auth/account-controls"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AutoHideHeader } from "@/components/layout/auto-hide-header"
import { Button } from "@/components/ui/button"
import {
  deleteSavedReview,
  fetchSavedReviews,
} from "@/lib/saved-reviews-client"
import type { SavedReviewListItem } from "@/lib/saved-review-types"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Delete02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

function relativeTime(iso: string) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const delta = Date.now() - then
  const minutes = Math.round(delta / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 14) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function SavedReviewsPanel() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useOkiAuth()
  const [reviews, setReviews] = useState<SavedReviewListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchSavedReviews()
      setReviews(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load reviews")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setLoading(false)
      setReviews([])
      return
    }
    void loadReviews()
  }, [isLoaded, isSignedIn, loadReviews])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteSavedReview(id)
      setReviews((current) => current.filter((review) => review.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete review")
    } finally {
      setDeletingId(null)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 text-sm text-teal-900/50">
        <HugeiconsIcon
          icon={Loading03Icon}
          strokeWidth={1.75}
          className="size-4 animate-spin"
        />
        Loading saved reviews…
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-[1.5rem] border border-teal-900/10 bg-white/70 px-5 py-8 text-center shadow-[0_20px_50px_-36px_rgba(8,60,70,0.45)]">
        <p className="text-sm text-teal-950/70">
          Sign in to see reviews saved to your account.
        </p>
        <div className="mt-5 flex justify-center">
          <AccountControls />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700/55">
            Saved
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-teal-950 sm:text-3xl">
            Recent reviews
          </h1>
          <p className="mt-2 text-sm text-teal-950/60">
            Open a review to continue in the workspace, or delete one you don’t
            need.
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0 bg-teal-600 text-white hover:bg-teal-500"
          nativeButton={false}
          render={<Link href="/review" />}
        >
          New review
        </Button>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-teal-900/50">
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={1.75}
            className="size-4 animate-spin"
          />
          Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-teal-900/15 bg-white/55 px-5 py-10 text-center">
          <p className="text-sm text-teal-950/65">
            No saved reviews yet. Run one and we’ll keep it here automatically.
          </p>
          <Button
            className="mt-5 bg-teal-600 text-white hover:bg-teal-500"
            nativeButton={false}
            render={<Link href="/review" />}
          >
            Start a review
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className={cn(
                "group flex flex-col gap-3 rounded-2xl border border-teal-900/10 bg-white/80 px-4 py-4",
                "shadow-[0_16px_40px_-34px_rgba(8,60,70,0.5)] sm:flex-row sm:items-center sm:justify-between"
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-teal-950">
                  {review.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-teal-950/55">
                  {review.summary}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-teal-800/50">
                  <span>{review.language}</span>
                  <span aria-hidden>·</span>
                  <span>score {review.score}</span>
                  <span aria-hidden>·</span>
                  <span>{review.provider}</span>
                  <span aria-hidden>·</span>
                  <span className="normal-case tracking-normal">
                    {relativeTime(review.createdAt)}
                  </span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  className="bg-teal-600 text-white hover:bg-teal-500"
                  onClick={() => router.push(`/review?id=${review.id}`)}
                >
                  Open
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={1.75}
                    className="size-3.5"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deletingId === review.id}
                  onClick={() => void handleDelete(review.id)}
                  aria-label={`Delete ${review.title}`}
                >
                  {deletingId === review.id ? (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      strokeWidth={1.75}
                      className="size-3.5 animate-spin"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      strokeWidth={1.75}
                      className="size-3.5"
                    />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function AccountPage() {
  const { isSignedIn, isLoaded } = useOkiAuth()

  if (!isLoaded) {
    return (
      <div className="relative flex h-svh min-h-0 flex-1 items-center justify-center bg-[#f4fbfa] text-sm text-teal-950/50">
        Loading…
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <DashboardShell
        section="account"
        className="px-4 py-6 sm:px-8 sm:py-8"
      >
        <SavedReviewsPanel />
      </DashboardShell>
    )
  }

  return (
    <div className="relative flex min-h-svh min-w-0 flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(45,212,191,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,116,144,0.14),_transparent_50%),linear-gradient(180deg,#f4fbfa_0%,#eef6f5_45%,#f7faf9_100%)]"
      />
      <AutoHideHeader>
        <OkiAiLogo size="sm" className="sm:h-8" />
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <AccountControls />
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/review" />}
          >
            Review
          </Button>
        </div>
      </AutoHideHeader>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pb-16 pt-28 sm:px-8 sm:pt-32">
        <SavedReviewsPanel />
      </main>
    </div>
  )
}
