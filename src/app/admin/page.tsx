'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { CategoryManager } from '@/components/CategoryManager'
import { BookmarkManager } from '@/components/BookmarkManager'
import { Button } from '@/components/ui/button'
import { Category } from '@/lib/types'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const hasRedirected = useRef(false)

  // 只在确定没有用户时重定向一次
  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true
      redirect('/')
    }
  }, [loading, user])

  // 在loading时显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  // 在没有用户时不渲染任何内容
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">管理后台</h1>
              <p className="text-muted-foreground mt-1">
                管理你的导航书签和分类 - {user.email}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 分类管理 */}
          <div>
            <CategoryManager 
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={setSelectedCategoryId}
              onCategoriesChange={setCategories}
            />
          </div>

          {/* 书签管理 */}
          <div>
            <BookmarkManager 
              selectedCategoryId={selectedCategoryId}
              categories={categories}
            />
          </div>
        </div>
      </main>
    </div>
  )
}