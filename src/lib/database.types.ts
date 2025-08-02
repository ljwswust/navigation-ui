export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          title: string
          url: string
          description: string | null
          favicon_url: string | null
          category_id: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          description?: string | null
          favicon_url?: string | null
          category_id: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          description?: string | null
          favicon_url?: string | null
          category_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          theme: string
          layout: string
          show_descriptions: boolean
        }
        Insert: {
          id?: string
          theme?: string
          layout?: string
          show_descriptions?: boolean
        }
        Update: {
          id?: string
          theme?: string
          layout?: string
          show_descriptions?: boolean
        }
      }
    }
  }
}