'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { profileService, UserProfile } from '@/lib/profile'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean // Single authoritative loading state
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        try {
          // Fetch profile when user is available
          const userProfile = await profileService.getCurrentUserProfile()
          setProfile(userProfile)
        } catch (err) {
          console.error('Failed to load profile:', err)
          setProfile(null)
        }
      } else {
        // Clear profile when user is logged out
        setProfile(null)
      }
      // The initial auth check is complete once the first event is handled.
      // This is the single source of truth for the loading state.
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password })
  }

  const signOut = () => {
    return supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const updatedProfile = await profileService.updateProfile(updates)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const refreshProfile = async () => {
    if (user) {
        try {
            const userProfile = await profileService.getCurrentUserProfile()
            setProfile(userProfile)
        } catch (err) {
            console.error('Failed to refresh profile:', err)
        }
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
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