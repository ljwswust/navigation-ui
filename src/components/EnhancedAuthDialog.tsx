/**
 * 增强版认证对话框
 * 支持密码强度验证和加密选项
 */
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/EnhancedAuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Loader2, Mail, Lock, X, Eye, EyeOff, 
  Shield, ShieldCheck, AlertTriangle 
} from 'lucide-react'

interface EnhancedAuthDialogProps {
  onClose: () => void
}

export function EnhancedAuthDialog({ onClose }: EnhancedAuthDialogProps) {
  const { signIn, signUp, validatePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // 密码可见性控制
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // 密码强度状态
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false
    }
  })
  
  // 安全选项 (默认关闭客户端加密以保持 Supabase 兼容)
  const [useEncryption, setUseEncryption] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // 密码确认
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handlePasswordChange = (password: string) => {
    if (password) {
      setPasswordStrength(validatePassword(password))
    } else {
      setPasswordStrength({
        isValid: false,
        score: 0,
        requirements: {
          length: false,
          uppercase: false,
          lowercase: false,
          numbers: false,
          symbols: false
        }
      })
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    setPasswordsMatch(value === '' || value === (document.querySelector('input[name="password"]') as HTMLInputElement)?.value)
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await signIn(email, password, useEncryption)
      if (error) {
        setError('登录失败：' + error.message)
      } else {
        onClose()
      }
    } catch (err: any) {
      setError('登录失败：' + (err.message || '请重试'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 验证密码强度
    if (!passwordStrength.isValid) {
      setError('密码强度不足，请满足所有安全要求')
      setLoading(false)
      return
    }

    // 验证密码确认
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, useEncryption)
      if (error) {
        setError('注册失败：' + error.message)
      } else {
        setSuccess('注册成功！请检查邮箱验证链接')
      }
    } catch (err: any) {
      setError('注册失败：' + (err.message || '请重试'))
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0: return { text: '无', color: 'text-red-500' }
      case 1: return { text: '很弱', color: 'text-red-500' }
      case 2: return { text: '弱', color: 'text-orange-500' }
      case 3: return { text: '中等', color: 'text-yellow-500' }
      case 4: return { text: '强', color: 'text-blue-500' }
      case 5: return { text: '很强', color: 'text-green-500' }
      default: return { text: '未知', color: 'text-gray-500' }
    }
  }

  const strengthInfo = getPasswordStrengthText()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]">
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <CardTitle>安全认证</CardTitle>
                <CardDescription>
                  {useEncryption ? '🔐 已启用加密传输' : '⚠️ 普通模式'}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* 安全选项 */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="encryption"
                checked={useEncryption}
                onCheckedChange={(checked) => setUseEncryption(!!checked)}
              />
              <label htmlFor="encryption" className="text-sm font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                启用客户端加密
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              ⚠️ 注意：启用后可能与 Supabase Auth 不兼容，建议关闭
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="邮箱"
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="密码"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="remember" className="text-sm">
                    记住登录状态
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {useEncryption && <Shield className="mr-2 h-4 w-4" />}
                  安全登录
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="邮箱"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="密码"
                      className="pl-10 pr-10"
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="确认密码"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* 密码强度指示器 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>密码强度：</span>
                      <span className={strengthInfo.color}>
                        {strengthInfo.text}
                      </span>
                    </div>
                    <Progress value={(passwordStrength.score / 5) * 100} className="h-2" />
                    
                    {/* 密码要求检查列表 */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={passwordStrength.requirements.length ? 'text-green-500' : 'text-gray-400'}>
                        ✓ 至少8位
                      </div>
                      <div className={passwordStrength.requirements.uppercase ? 'text-green-500' : 'text-gray-400'}>
                        ✓ 大写字母
                      </div>
                      <div className={passwordStrength.requirements.lowercase ? 'text-green-500' : 'text-gray-400'}>
                        ✓ 小写字母
                      </div>
                      <div className={passwordStrength.requirements.numbers ? 'text-green-500' : 'text-gray-400'}>
                        ✓ 数字
                      </div>
                      <div className={passwordStrength.requirements.symbols ? 'text-green-500' : 'text-gray-400'}>
                        ✓ 特殊字符
                      </div>
                      <div className={passwordsMatch ? 'text-green-500' : 'text-red-500'}>
                        ✓ 密码匹配
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !passwordStrength.isValid || !passwordsMatch}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {useEncryption && <Shield className="mr-2 h-4 w-4" />}
                  安全注册
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-500">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}