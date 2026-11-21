"use client"

import { useState } from "react"
import { AuthModal } from "@/components/auth/auth-modal"
import { useOkiAuth } from "@/components/auth/oki-auth-provider"
import { Button } from "@/components/ui/button"

export function AccountControls() {
  const { isSignedIn, isLoaded, user, signOut } = useOkiAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")

  if (!isLoaded) {
    return (
      <div
        aria-hidden
        className="size-8 animate-pulse rounded-full bg-teal-900/10"
      />
    )
  }

  if (isSignedIn && user) {
    const initial = (user.name || user.email || "U").slice(0, 1).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="grid size-8 place-items-center rounded-full bg-teal-700 text-[11px] font-semibold text-white"
          title={user.email}
        >
          {initial}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void signOut()
          }}
        >
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAuthMode("sign-in")
            setAuthOpen(true)
          }}
        >
          Sign in
        </Button>
        <Button
          size="sm"
          className="hidden bg-teal-600 text-white hover:bg-teal-500 sm:inline-flex"
          onClick={() => {
            setAuthMode("sign-up")
            setAuthOpen(true)
          }}
        >
          Sign up
        </Button>
      </div>
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </>
  )
}
