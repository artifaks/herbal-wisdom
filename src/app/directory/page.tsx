'use client'

import { useState, useEffect } from 'react'
import { StoreCard } from '@/components/stores/StoreCard'
import { StoreFilters } from '@/components/stores/StoreFilters'
import { getStores } from '@/lib/services/stores'
import { HerbalStore, StoreFilters as StoreFiltersType } from '@/types/stores'
import { MapPinIcon } from '@heroicons/react/24/outline'

export default function Directory() {
  const [stores, setStores] = useState<HerbalStore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleFiltersChange = async (filters: StoreFiltersType) => {
    setIsLoading(true)
    setError(null)
    try {
      const storesData = await getStores(filters)
      setStores(storesData)
    } catch (err) {
      console.error('Error fetching stores:', err)
      setError('Error loading stores. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    handleFiltersChange({})
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <MapPinIcon className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Herbal Store Directory</h1>
      </div>

      <StoreFilters onFiltersChange={handleFiltersChange} />

      {error && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : stores.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  )
}
