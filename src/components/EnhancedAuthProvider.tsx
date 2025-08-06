/**
 * 增强版认证 Provider
 * 支持客户端密码加密
 */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { encryptPassword, hashPasswordWithSalt, validatePasswordStrength } from '@/lib/crypto'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string, useEncryption?: boolean) => Promise<any>
  signUp: (email: string, password: string, useEncryption?: boolean) => Promise<any>
  signOut: () => Promise<any>
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>
  validatePassword: (password: string) => { isValid: boolean; score: number; requirements: any }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 初始会话检查
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * 增强版登录函数（兼容 Supabase）
   * @param email 邮箱
   * @param password 密码
   * @param useEncryption 是否启用客户端加密 (建议关闭以兼容Supabase)
   */
  const signIn = async (email: string, password: string, useEncryption: boolean = false) => {
    try {
      let processedPassword = password

      // 注意：Supabase Auth 有自己的密码处理流程
      // 启用客户端加密会导致 Supabase 无法验证密码
      if (useEncryption) {
        console.warn('⚠️ 客户端加密模式可能与 Supabase Auth 不兼容')
        
        // 选择加密方案（可根据需要切换）
        switch (process.env.NEXT_PUBLIC_ENCRYPTION_MODE) {
          case 'hash':
            processedPassword = hashPasswordWithSalt(password, email)
            break
          case 'encrypt':
            processedPassword = encryptPassword(password)
            break
          default:
            // 默认不加密，保持 Supabase 兼容性
            processedPassword = password
        }
      }

      const result = await supabase.auth.signInWithPassword({ 
        email, 
        password: processedPassword 
      })

      // 安全清除原始密码变量
      password = ''
      
      return result
    } catch (error) {
      console.error('Enhanced sign in error:', error)
      throw error
    }
  }

  /**
   * 增强版注册函数（兼容 Supabase）
   */
  const signUp = async (email: string, password: string, useEncryption: boolean = false) => {
    try {
      // 验证密码强度
      const validation = validatePasswordStrength(password)
      if (!validation.isValid) {
        throw new Error('密码强度不足，请包含大小写字母、数字和特殊字符')
      }

      let processedPassword = password

      // 注意：Supabase Auth 有自己的密码处理流程
      if (useEncryption) {
        console.warn('⚠️ 客户端加密模式可能与 Supabase Auth 不兼容')
        
        switch (process.env.NEXT_PUBLIC_ENCRYPTION_MODE) {
          case 'hash':
            processedPassword = hashPasswordWithSalt(password, email)
            break
          case 'encrypt':
            processedPassword = encryptPassword(password)
            break
          default:
            // 默认不加密，保持 Supabase 兼容性
            processedPassword = password
        }
      }

      const result = await supabase.auth.signUp({ 
        email, 
        password: processedPassword 
      })

      // 安全清除原始密码变量
      password = ''
      
      return result
    } catch (error) {
      console.error('Enhanced sign up error:', error)
      throw error
    }
  }

  /**
   * 密码修改功能
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // 验证新密码强度
      const validation = validatePasswordStrength(newPassword)
      if (!validation.isValid) {
        throw new Error('新密码强度不足')
      }

      let processedNewPassword = newPassword
      
      if (process.env.NEXT_PUBLIC_ENCRYPTION_MODE !== 'none') {
        processedNewPassword = hashPasswordWithSalt(newPassword, user?.email || '')
      }

      const result = await supabase.auth.updateUser({ 
        password: processedNewPassword 
      })

      // 安全清除密码变量
      currentPassword = ''
      newPassword = ''
      
      return result
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  const signOut = () => {
    return supabase.auth.signOut()
  }

  const validatePassword = (password: string) => {
    return validatePasswordStrength(password)
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    changePassword,
    validatePassword,
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
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider')
  }
  return context
}