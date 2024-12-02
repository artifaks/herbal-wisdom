'use client'

import { useState, useEffect } from 'react'
import { HerbForm } from '@/components/admin/HerbForm'
import { CSVUpload } from '@/components/admin/CSVUpload'
import { Herb } from '@/types/herbs'
import { getHerbs, deleteHerb } from '@/lib/services/admin'
import { ErrorAlert, SuccessAlert } from '@/components/common/Alerts'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ErrorBoundary>
        <AdminContent />
      </ErrorBoundary>
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [herbs, setHerbs] = useState<Herb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null)
  const [filters, setFilters] = useState<HerbFilters>({
    category: '',
    isPremium: undefined,
    searchQuery: '',
    illness: '',
  })

  const fetchHerbs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHerbs()
      setHerbs(data)
    } catch (err) {
      setError('Failed to fetch herbs')
      console.error('Error fetching herbs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHerbs()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this herb?')) return

    setError(null)
    try {
      await deleteHerb(id)
      setSuccess('Herb deleted successfully')
      fetchHerbs()
    } catch (err) {
      setError('Failed to delete herb')
      console.error('Error deleting herb:', err)
    }
  }

  const handleEdit = (herb: Herb) => {
    setSelectedHerb(herb)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedHerb(null)
    setSuccess('Herb saved successfully')
    fetchHerbs()
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    setSuccess('Herbs imported successfully')
    fetchHerbs()
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
        >
          Import CSV
        </button>
        <button
          onClick={() => {
            setSelectedHerb(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add New Herb
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search herbs..."
          value={filters.searchQuery || ''}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <input
          type="text"
          placeholder="Filter by illness..."
          value={filters.illness || ''}
          onChange={(e) => setFilters({ ...filters, illness: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={filters.category || ''}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All categories</option>
          <option value="medicinal">Medicinal</option>
          <option value="culinary">Culinary</option>
          <option value="ornamental">Ornamental</option>
        </select>

        <select
          value={filters.isPremium || ''}
          onChange={(e) => setFilters({ ...filters, isPremium: e.target.value === 'true' })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All herbs</option>
          <option value="true">Premium herbs</option>
          <option value="false">Non-premium herbs</option>
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {selectedHerb ? 'Edit Herb' : 'Add New Herb'}
            </h2>
            <HerbForm
              initialData={selectedHerb || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setSelectedHerb(null)
              }}
            />
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Import Herbs from CSV</h2>
            <CSVUpload
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div>Loading herbs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {herbs
            .filter((herb) => {
              const searchQuery = filters.searchQuery?.toLowerCase() || ''
              const illness = filters.illness?.toLowerCase() || ''
              const category = filters.category || ''
              const isPremium = filters.isPremium

              return (
                (searchQuery === '' || herb.name.toLowerCase().includes(searchQuery)) &&
                (illness === '' || herb.treats_illnesses?.some(i => i.toLowerCase().includes(illness)) || false) &&
                (category === '' || herb.category === category) &&
                (isPremium === undefined || herb.is_premium === isPremium)
              )
            })
            .map((herb) => (
              <div
                key={herb.id}
                className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={herb.image_url || '/placeholder-herb.jpg'}
                    alt={herb.name}
                    className="object-cover rounded-lg w-full h-48"
                  />
                </div>
                <h3 className="text-xl font-semibold">{herb.name}</h3>
                {herb.scientific_name && (
                  <p className="text-gray-600 italic">{herb.scientific_name}</p>
                )}
                <p className="text-gray-700 line-clamp-3">{herb.description}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(herb)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(herb.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
