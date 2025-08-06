'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/EnhancedAuthProvider'

export function SessionChecker({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  useEffect(() => {
    // 在开发环境下打印会话状态用于调试
    if (process.env.NODE_ENV === 'development') {
      console.log('Session status:', {
        hasSession: !!session,
        loading,
        userEmail: session?.user?.email
      })
    }
  }, [session, loading])

  return <>{children}</>
}