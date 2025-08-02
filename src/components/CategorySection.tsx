import { Category, Bookmark } from '@/lib/types'
import { BookmarkCard } from './BookmarkCard'

interface CategorySectionProps {
  category: Category
  bookmarks: Bookmark[]
}

export function CategorySection({ category, bookmarks }: CategorySectionProps) {
  if (bookmarks.length === 0) return null

  return (
    <section className="bg-white/10 rounded-3xl p-6 shadow-xl border border-white/20 transition-colors duration-200 hover:bg-white/15">
      <div className="flex items-center gap-3 mb-6">
        {category.icon && (
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
            <span className="text-2xl">{category.icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{category.name}</h2>
          <p className="text-white/70 text-sm">
            {bookmarks.length} 个网站
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </section>
  )
}