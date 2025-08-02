'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface CategoryManagerProps {
  selectedCategoryId?: string | null
  onCategorySelect?: (categoryId: string | null) => void
  onCategoriesChange?: (categories: Category[]) => void
}

export function CategoryManager({ 
  selectedCategoryId, 
  onCategorySelect,
  onCategoriesChange 
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const hasInitialized = useRef(false) // 防止重复初始化

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
      
      if (error) throw error
      const categoriesData = data || []
      setCategories(categoriesData)
      
      // 通知父组件分类数据更新
      onCategoriesChange?.(categoriesData)
    } catch (err) {
      setError('获取分类失败')
    } finally {
      setLoading(false)
    }
  }, []) // 移除onCategoriesChange依赖，避免重复调用

  useEffect(() => {
    // 只在首次挂载时调用，避免重复请求
    if (!hasInitialized.current) {
      hasInitialized.current = true
      fetchCategories()
    }
  }, [fetchCategories])

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const icon = formData.get('icon') as string

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name,
          icon: icon || null,
          sort_order: categories.length + 1
        })

      if (error) throw error
      
      setShowAddForm(false)
      await fetchCategories()
      setError('')
    } catch (err) {
      setError('添加分类失败')
    }
  }

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const icon = formData.get('icon') as string

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name,
          icon: icon || null
        })
        .eq('id', id)

      if (error) throw error
      
      setEditingId(null)
      await fetchCategories()
      setError('')
    } catch (err) {
      setError('更新分类失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？这将同时删除该分类下的所有书签。')) {
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // 如果删除的是当前选中的分类，清除选中状态
      if (selectedCategoryId === id) {
        onCategorySelect?.(null)
      }
      
      await fetchCategories()
      setError('')
    } catch (err) {
      setError('删除分类失败')
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">分类管理</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加分类
        </Button>
      </div>

      {error && (
        <Alert className="border-destructive">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 全部分类选项 */}
      {onCategorySelect && (
        <Card>
          <CardContent className="p-4">
            <button
              onClick={() => onCategorySelect(null)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                !selectedCategoryId 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              📋 全部书签
            </button>
          </CardContent>
        </Card>
      )}

      {/* 添加表单 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>添加新分类</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Input
                  name="name"
                  placeholder="分类名称"
                  required
                />
              </div>
              <div>
                <Input
                  name="icon"
                  placeholder="图标 (emoji)"
                  maxLength={2}
                />
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

      {/* 分类列表 */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              {editingId === category.id ? (
                <form onSubmit={(e) => handleUpdate(category.id, e)} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      defaultValue={category.name}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="icon"
                      defaultValue={category.icon || ''}
                      placeholder="图标 (emoji)"
                      maxLength={2}
                    />
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
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onCategorySelect?.(category.id)}
                    className={`flex items-center gap-3 flex-1 text-left px-2 py-1 rounded transition-colors ${
                      selectedCategoryId === category.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    {category.icon && (
                      <span className="text-xl">{category.icon}</span>
                    )}
                    <span className="font-medium">{category.name}</span>
                  </button>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(category.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}