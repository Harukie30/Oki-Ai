"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  AuthLoadingScreen,
  type AuthTransitionKind,
} from "@/components/auth/auth-loading-screen"
import { authClient } from "@/lib/auth-client"

const MIN_TRANSITION_MS = 650

type OkiAuthValue = {
  isSignedIn: boolean
  isLoaded: boolean
  authTransition: AuthTransitionKind | null
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
  refresh: () => Promise<void>
  signOut: () => Promise<void>
  beginAuthTransition: (kind: AuthTransitionKind) => void
  endAuthTransition: () => Promise<void>
}

const OkiAuthContext = createContext<OkiAuthValue>({
  isSignedIn: false,
  isLoaded: false,
  authTransition: null,
  user: null,
  refresh: async () => undefined,
  signOut: async () => undefined,
  beginAuthTransition: () => undefined,
  endAuthTransition: async () => undefined,
})

export function useOkiAuth() {
  return useContext(OkiAuthContext)
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Session via better-auth's useSession (useSyncExternalStore) so we avoid
 * mount-time setState in the root layout — that remounts Suspense/loading
 * boundaries in a loop under Next.js Cache Components.
 */
export function OkiAuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession()
  const [authTransition, setAuthTransition] =
    useState<AuthTransitionKind | null>(null)
  const transitionStartedAtRef = useRef(0)

  const user = useMemo<OkiAuthValue["user"]>(() => {
    const next = data?.user
    if (!next) return null
    return {
      id: next.id,
      name: next.name,
      email: next.email,
      image: next.image,
    }
  }, [data?.user])

  const beginAuthTransition = useCallback((kind: AuthTransitionKind) => {
    transitionStartedAtRef.current = Date.now()
    setAuthTransition(kind)
  }, [])

  const endAuthTransition = useCallback(async () => {
    const elapsed = Date.now() - transitionStartedAtRef.current
    if (elapsed < MIN_TRANSITION_MS) {
      await wait(MIN_TRANSITION_MS - elapsed)
    }
    setAuthTransition(null)
    transitionStartedAtRef.current = 0
  }, [])

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const signOut = useCallback(async () => {
    beginAuthTransition("signing-out")
    try {
      await authClient.signOut()
      await refetch()
    } finally {
      await endAuthTransition()
    }
  }, [beginAuthTransition, endAuthTransition, refetch])

  const value = useMemo<OkiAuthValue>(
    () => ({
      isSignedIn: Boolean(user),
      isLoaded: !isPending,
      authTransition,
      user,
      refresh,
      signOut,
      beginAuthTransition,
      endAuthTransition,
    }),
    [
      isPending,
      authTransition,
      user,
      refresh,
      signOut,
      beginAuthTransition,
      endAuthTransition,
    ]
  )

  return (
    <OkiAuthContext.Provider value={value}>
      {children}
      {authTransition ? <AuthLoadingScreen kind={authTransition} /> : null}
    </OkiAuthContext.Provider>
  )
}
