'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/EnhancedAuthProvider'
import { Bookmark, Category } from '@/lib/types'
import { UserProfile, profileService } from '@/lib/profile'
import { CategorySection } from '@/components/CategorySection'
import { SearchBar } from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { EnhancedAuthDialog } from '@/components/EnhancedAuthDialog'
import { UserInfo } from '@/components/UserInfo'
import { UserProfileEditor } from '@/components/UserProfileEditor'
import { Button } from '@/components/ui/button'
import { Plus, LogIn, LogOut, Settings } from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      const fetchAllData = async () => {
        try {
          const [profileData, categoriesData, bookmarksData] = await Promise.all([
            profileService.getProfile(user),
            supabase.from('categories').select('*').order('sort_order'),
            supabase.from('bookmarks').select('*, category:categories(*)').eq('is_active', true).order('sort_order')
          ])
          setProfile(profileData)
          setCategories(categoriesData.data || [])
          setBookmarks(bookmarksData.data || [])
        } catch (error) {
          console.error('Error fetching page data:', error)
        }
      }
      fetchAllData()
    } else if (!authLoading && !user) {
      // Clear all data when user logs out
      setProfile(null)
      setCategories([])
      setBookmarks([])
    }
  }, [user, authLoading])

  const handleSignOut = async () => {
    await signOut()
  }

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
        <div className="bg-white/20 rounded-2xl p-8 shadow-xl border border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="text-white text-lg font-medium">加载中...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full"></div>
      </div>

      <header className="relative z-10 bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">我的导航</h1>
                <p className="text-white/70 text-sm">发现精彩世界</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-xl p-1 border border-white/20">
                <ThemeToggle />
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-xl p-2 border border-white/20">
                    <UserInfo onEdit={() => setShowProfileEditor(true)} profile={profile} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl transition-colors duration-200"
                    onClick={() => window.location.href = '/admin'}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    管理
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl transition-colors duration-200"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  size="sm"
                  className="bg-white/20 text-white hover:bg-white/30 border border-white/30 rounded-xl transition-colors duration-200 shadow-lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  登录
                </Button>
              )}
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-1 border border-white/20">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {categories.length === 0 && !authLoading ? (
          <div className="text-center py-20">
            <div className="bg-white/10 rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <p className="text-white/90 text-lg mb-6 font-medium">还没有任何分类</p>
              <p className="text-white/70 mb-8">开始添加你的第一个书签吧！</p>
              {user && (
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl transition-colors duration-200 shadow-lg px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  添加书签
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryBookmarks = filteredBookmarks.filter(
                bookmark => bookmark.category_id === category.id
              )
              
              if (categoryBookmarks.length === 0 && searchTerm) return null

              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  bookmarks={categoryBookmarks}
                />
              )
            })}
          </div>
        )}
      </main>

      {showAuthDialog && (
        <EnhancedAuthDialog onClose={() => setShowAuthDialog(false)} />
      )}

      {showProfileEditor && (
        <UserProfileEditor 
          onClose={() => setShowProfileEditor(false)} 
          onProfileUpdate={setProfile}
        />
      )}
    </div>
  )
}