"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { authClient } from "@/lib/auth-client"

type OkiAuthValue = {
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const OkiAuthContext = createContext<OkiAuthValue>({
  isSignedIn: false,
  isLoaded: false,
  user: null,
  refresh: async () => undefined,
  signOut: async () => undefined,
})

export function useOkiAuth() {
  return useContext(OkiAuthContext)
}

/**
 * Session via better-auth's useSession (useSyncExternalStore) so we avoid
 * mount-time setState in the root layout — that remounts Suspense/loading
 * boundaries in a loop under Next.js Cache Components.
 */
export function OkiAuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession()

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

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const signOut = useCallback(async () => {
    await authClient.signOut()
    await refetch()
  }, [refetch])

  const value = useMemo<OkiAuthValue>(
    () => ({
      isSignedIn: Boolean(user),
      isLoaded: !isPending,
      user,
      refresh,
      signOut,
    }),
    [isPending, user, refresh, signOut]
  )

  return (
    <OkiAuthContext.Provider value={value}>{children}</OkiAuthContext.Provider>
  )
}
