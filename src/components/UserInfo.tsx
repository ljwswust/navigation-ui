'use client'

import { useAuth } from '@/components/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface UserInfoProps {
  onEdit: () => void
}

export function UserInfo({ onEdit }: UserInfoProps) {
  const { user, profile } = useAuth()

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name
    if (user?.email) return user.email
    return '用户'
  }

  const getAvatarFallback = () => {
    const name = getDisplayName()
    return name.charAt(0).toUpperCase()
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={profile?.avatar_url} />
        <AvatarFallback className="text-sm">
          {getAvatarFallback()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {getDisplayName()}
        </span>
        {profile?.username && (
          <span className="text-xs text-muted-foreground">
            @{profile.username}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="ml-auto"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  )
}
