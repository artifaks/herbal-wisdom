'use client'

import { useState } from 'react'
import { HerbCard } from '@/components/herbs/HerbCard'
import { HerbFilters } from '@/components/herbs/HerbFilters'
import { getHerbs } from '@/lib/services/herbs'
import { Herb, HerbFilters as HerbFiltersType } from '@/types/herbs'
import { useEffect } from 'react'

const PAGE_SIZE = 12

export default function HerbalExplorer() {
  const [herbs, setHerbs] = useState<Herb[]>([])
  const [totalHerbs, setTotalHerbs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<HerbFiltersType>({})
  const [isLoading, setIsLoading] = useState(true)

  const totalPages = Math.ceil(totalHerbs / PAGE_SIZE)

  useEffect(() => {
    async function fetchHerbs() {
      setIsLoading(true)
      try {
        const { data, count } = await getHerbs(filters, {
          page: currentPage,
          pageSize: PAGE_SIZE,
        })
        setHerbs(data)
        setTotalHerbs(count)
      } catch (error) {
        console.error('Error fetching herbs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHerbs()
  }, [filters, currentPage])

  const handleFiltersChange = (newFilters: HerbFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Herbal Explorer</h1>
      
      <HerbFilters onFiltersChange={handleFiltersChange} />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {herbs.map((herb) => (
              <HerbCard key={herb.id} herb={herb} />
            ))}
          </div>

          {herbs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No herbs found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
