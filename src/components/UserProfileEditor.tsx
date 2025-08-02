'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { profileService } from '@/lib/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Save, X, User, Mail } from 'lucide-react'
import { Portal } from '@/components/Portal'

interface UserProfileEditorProps {
  onClose?: () => void
}

export function UserProfileEditor({ onClose }: UserProfileEditorProps) {
  const { user, profile, profileLoading, updateProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const updates = {
        display_name: formData.get('display_name') as string || '',
        username: formData.get('username') as string || '',
        bio: formData.get('bio') as string || '',
        website: formData.get('website') as string || '',
        location: formData.get('location') as string || ''
      }

      await updateProfile(updates)
      onClose?.()
    } catch (err) {
      setError('保存失败，请重试')
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('图片大小不能超过2MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const avatarUrl = await profileService.uploadAvatar(file)
      await updateProfile({ avatar_url: avatarUrl })
    } catch (err) {
      setError('头像上传失败')
      console.error('Error uploading avatar:', err)
    } finally {
      setUploading(false)
    }
  }

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name
    if (user?.email) return user.email
    return '用户'
  }

  const getAvatarFallback = () => {
    const name = getDisplayName()
    return name.charAt(0).toUpperCase()
  }

  const ModalContainer = ({ children }: { children: React.ReactNode }) => (
    <Portal>
      <div
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/5"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose?.()
          }
        }}
      >
        {children}
      </div>
    </Portal>
  )

  if (profileLoading) {
    return (
      <ModalContainer>
        <Card className="w-full max-w-md p-8 text-center shadow-2xl">
          <div className="text-lg">加载中...</div>
        </Card>
      </ModalContainer>
    )
  }

  if (!profile) {
    return (
      <ModalContainer>
        <Card className="w-full max-w-md p-8 text-center shadow-2xl">
          <div className="text-lg">无法加载用户资料</div>
          <Button onClick={onClose} className="mt-4">关闭</Button>
        </Card>
      </ModalContainer>
    )
  }

  return (
    <ModalContainer>
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>编辑个人资料</CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-destructive">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              点击相机图标更换头像
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">显示名称</label>
              <Input
                name="display_name"
                placeholder="设置你的显示名称"
                defaultValue={profile?.display_name || ''}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">用户名</label>
              <Input
                name="username"
                placeholder="设置用户名（可选）"
                defaultValue={profile?.username || ''}
              />
            </div>

            <div>
              <label className="text-sm font-medium">个人简介</label>
              <Textarea
                name="bio"
                placeholder="介绍一下自己（可选）"
                defaultValue={profile?.bio || ''}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">个人网站</label>
              <Input
                name="website"
                type="url"
                placeholder="https://..."
                defaultValue={profile?.website || ''}
              />
            </div>

            <div>
              <label className="text-sm font-medium">所在地</label>
              <Input
                name="location"
                placeholder="城市/地区（可选）"
                defaultValue={profile?.location || ''}
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">账户信息</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">邮箱:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">注册时间:</span>
                  <span>{new Date(profile?.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Save className="w-4 h-4 mr-2 animate-spin" />}
                保存更改
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  取消
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </ModalContainer>
  )
}
