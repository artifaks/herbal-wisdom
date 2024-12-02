import { HerbFilters } from '@/types/herbs'
import { useEffect, useState, useCallback } from 'react'
import { getHerbCategories } from '@/lib/services/herbs'
import { useDebounce } from '@/hooks/useDebounce'

type HerbFiltersProps = {
  onFiltersChange: (filters: HerbFilters) => void
}

export function HerbFilters({ onFiltersChange }: HerbFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined)
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Fetch categories only once on mount
  useEffect(() => {
    let mounted = true
    getHerbCategories().then(cats => {
      if (mounted) {
        setCategories(cats)
      }
    })
    return () => { mounted = false }
  }, [])

  // Memoize the filters update
  const updateFilters = useCallback(() => {
    onFiltersChange({
      searchQuery: debouncedSearch,
      category,
      isPremium,
    })
  }, [debouncedSearch, category, isPremium])

  // Apply filters when they change
  useEffect(() => {
    updateFilters()
  }, [updateFilters])

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow mb-6">
      <div>
        <input
          type="text"
          placeholder="Search herbs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={isPremium === undefined ? '' : String(isPremium)}
          onChange={(e) => {
            const value = e.target.value
            setIsPremium(value === '' ? undefined : value === 'true')
          }}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Access</option>
          <option value="false">Free Only</option>
          <option value="true">Premium Only</option>
        </select>
      </div>
    </div>
  )
}
