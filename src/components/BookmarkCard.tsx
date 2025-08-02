import { Bookmark } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-colors duration-200 hover:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {bookmark.favicon_url ? (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
              <img
                src={bookmark.favicon_url}
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-5 h-5 text-white/80 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </div>
                    `
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
              <ExternalLink className="w-4 h-4 text-white/80" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors text-sm leading-tight">
            {bookmark.title}
          </h3>
          {bookmark.description && (
            <p className="text-xs text-white/70 mt-1 line-clamp-2 leading-relaxed">
              {bookmark.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <p className="text-xs text-white/60">
              {new URL(bookmark.url).hostname}
            </p>
          </div>
        </div>
      </div>
    </a>
  )
}