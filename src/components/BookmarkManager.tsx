'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Bookmark, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react'

interface BookmarkManagerProps {
  selectedCategoryId?: string | null
  categories: Category[]
}

export function BookmarkManager({ selectedCategoryId, categories }: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const hasInitialized = useRef(false) // 防止重复初始化

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          category:categories(*)
        `)
        .order('sort_order')

      if (error) throw error
      setBookmarks(data || [])
    } catch (err) {
      setError('获取书签失败')
    } finally {
      setLoading(false)
    }
  }, []) // 移除依赖，避免重复调用

  useEffect(() => {
    // 只在首次挂载时调用，避免重复请求
    if (!hasInitialized.current) {
      hasInitialized.current = true
      fetchBookmarks()
    }
  }, [fetchBookmarks])

  // 根据选中的分类过滤书签
  const filteredBookmarks = useMemo(() => {
    if (!selectedCategoryId) {
      return bookmarks
    }
    return bookmarks.filter(bookmark => bookmark.category_id === selectedCategoryId)
  }, [bookmarks, selectedCategoryId])

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`
    } catch {
      return null
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('category_id') as string

    try {
      const faviconUrl = getFaviconUrl(url)
      
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          title,
          url,
          description: description || null,
          category_id: categoryId,
          favicon_url: faviconUrl,
          sort_order: bookmarks.length + 1
        })

      if (error) throw error
      
      setShowAddForm(false)
      await fetchBookmarks()
      setError('')
    } catch (err) {
      setError('添加书签失败')
    }
  }

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('category_id') as string

    try {
      const faviconUrl = getFaviconUrl(url)
      
      const { error } = await supabase
        .from('bookmarks')
        .update({
          title,
          url,
          description: description || null,
          category_id: categoryId,
          favicon_url: faviconUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      setEditingId(null)
      await fetchBookmarks()
      setError('')
    } catch (err) {
      setError('更新书签失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个书签吗？')) {
      return
    }

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchBookmarks()
      setError('')
    } catch (err) {
      setError('删除书签失败')
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">书签管理</h2>
          {selectedCategory ? (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCategory.icon} {selectedCategory.name} - {filteredBookmarks.length} 个书签
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              全部书签 - {bookmarks.length} 个
            </p>
          )}
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加书签
        </Button>
      </div>

      {error && (
        <Alert className="border-destructive">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 添加表单 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>添加新书签</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Input
                  name="title"
                  placeholder="书签标题"
                  required
                />
              </div>
              <div>
                <Input
                  name="url"
                  type="url"
                  placeholder="网址 (https://...)"
                  required
                />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="描述 (可选)"
                  rows={3}
                />
              </div>
              <div>
                <Select 
                  name="category_id" 
                  required
                  defaultValue={selectedCategoryId || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 书签列表 */}
      <div className="space-y-4">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.id}>
            <CardContent className="p-4">
              {editingId === bookmark.id ? (
                <form onSubmit={(e) => handleUpdate(bookmark.id, e)} className="space-y-4">
                  <div>
                    <Input
                      name="title"
                      defaultValue={bookmark.title}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="url"
                      type="url"
                      defaultValue={bookmark.url}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      name="description"
                      defaultValue={bookmark.description || ''}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Select name="category_id" defaultValue={bookmark.category_id}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      取消
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {bookmark.favicon_url && (
                        <img
                          src={bookmark.favicon_url}
                          alt=""
                          className="w-5 h-5 mt-0.5"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{bookmark.title}</h3>
                        {bookmark.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {bookmark.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {new URL(bookmark.url).hostname}
                          </a>
                          {bookmark.category && (
                            <span className="text-sm text-muted-foreground">
                              {bookmark.category.icon} {bookmark.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(bookmark.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(bookmark.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `${selectedCategory.name} 分类下还没有书签，点击上方按钮添加第一个书签吧！`
                : '还没有任何书签，点击上方按钮添加第一个书签吧！'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}