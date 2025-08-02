import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
      <input
        type="text"
        placeholder="搜索你的导航书签..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-colors duration-200 text-lg"
      />
    </div>
  )
}