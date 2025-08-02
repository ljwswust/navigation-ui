import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

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
  getProfile: async (user: User): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching profile:', error)
        throw error
      }

      if (!data) {
        return profileService.createProfile(user, { display_name: user.email })
      }

      return data
    } catch (err) {
      console.error('Unexpected error in getProfile:', err)
      return null
    }
  },

  updateProfile: async (user: User, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
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

  createProfile: async (user: User, profileData: Partial<UserProfile>) => {
    const profileToInsert = {
      id: user.id,
      display_name: profileData.display_name || user.email || 'User',
      ...profileData,
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileToInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }
    return data
  },

  uploadAvatar: async (user: User, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

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
  },
}
