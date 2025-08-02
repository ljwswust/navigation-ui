import { supabase } from './supabase'

export interface UserProfile {
  id: string
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  website?: string
  location?: string
  theme: string
  language: string
  timezone: string
  notifications_enabled: boolean
  layout_preference: string
  show_descriptions: boolean
  created_at: string
  updated_at: string
}

export const profileService = {
  // 获取当前用户的资料
  getCurrentUserProfile: async (): Promise<UserProfile | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user:', userError)
        return null
      }
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      // 如果没有找到 profile，自动创建一个
      if (!data) {
        try {
          console.log('No profile found, creating new profile for user:', user.id)
          const newProfile = await profileService.createProfile({
            display_name: user.email
          })
          return newProfile
        } catch (createError) {
          console.error('Error creating profile:', createError)
          // 即使创建失败，也返回 null 而不是抛出错误
          return null
        }
      }

      return data
    } catch (err) {
      console.error('Unexpected error in getCurrentUserProfile:', err)
      return null
    }
  },

  // 更新用户资料
  updateProfile: async (updates: Partial<UserProfile>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    // 先确保 profile 存在
    await profileService.ensureProfile()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }
    return data
  },

  // 创建用户资料（如果不存在）
  createProfile: async (profileData: Partial<UserProfile>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user for profile creation:', userError)
        throw userError
      }
      if (!user) throw new Error('No user found')

      console.log('Creating profile for user:', user.id, 'with data:', profileData)

      const profileToInsert = {
        id: user.id,
        display_name: profileData.display_name || user.email || 'User',
        username: profileData.username || null,
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || null,
        website: profileData.website || null,
        location: profileData.location || null,
        theme: profileData.theme || 'system',
        language: profileData.language || 'zh-CN',
        timezone: profileData.timezone || 'Asia/Shanghai',
        notifications_enabled: profileData.notifications_enabled ?? true,
        layout_preference: profileData.layout_preference || 'grid',
        show_descriptions: profileData.show_descriptions ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileToInsert)
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating profile:', error)
        throw error
      }

      console.log('Profile created successfully:', data)
      return data
    } catch (err) {
      console.error('Error in createProfile:', err)
      throw err
    }
  },

  // 确保用户资料存在
  ensureProfile: async (): Promise<UserProfile> => {
    try {
      // 先尝试获取现有资料
      const existingProfile = await profileService.getCurrentUserProfile()
      if (existingProfile) {
        return existingProfile
      }
      
      // 如果没有资料，创建一个
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')
      
      return await profileService.createProfile({
        display_name: user.email || 'User'
      })
    } catch (err) {
      console.error('Error in ensureProfile:', err)
      throw err
    }
  },

  // 上传头像
  uploadAvatar: async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        throw uploadError
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (err) {
      console.error('Error in uploadAvatar:', err)
      throw err
    }
  },

  // 删除头像
  deleteAvatar: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    try {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar`])

      if (error) {
        console.error('Error deleting avatar:', error)
        throw error
      }
    } catch (err) {
      console.error('Error in deleteAvatar:', err)
      throw err
    }
  }
}