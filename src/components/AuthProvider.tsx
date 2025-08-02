'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { profileService, UserProfile } from '@/lib/profile'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true) // Start as true for initial load

  const loadProfile = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setProfileLoading(true)
    }
    try {
      const userProfile = await profileService.getCurrentUserProfile()
      setProfile(userProfile)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfile(null)
    } finally {
      if (!isBackgroundRefresh) {
        setProfileLoading(false)
      }
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(false)
      } else {
        setProfileLoading(false)
      }
      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (event === 'SIGNED_IN') {
          await loadProfile(false)
        } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await loadProfile(true) // Perform a silent refresh
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      return await supabase.auth.signInWithPassword({ email, password })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      return await supabase.auth.signUp({ email, password })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      return await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const updatedProfile = await profileService.updateProfile(updates)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const refreshProfile = async () => {
    await loadProfile(false)
  }

  const value = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
