export interface Category {
  id: string
  name: string
  icon?: string
  sort_order: number
  created_at: string
}

export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  favicon_url?: string
  category_id: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface UserSettings {
  id: string
  theme: 'light' | 'dark'
  layout: 'grid' | 'list'
  show_descriptions: boolean
}