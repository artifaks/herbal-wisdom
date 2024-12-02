'use client';

import { useState } from 'react'
import { Herb } from '@/types/herbs'
import { createHerb, updateHerb } from '@/lib/services/admin'
import ImageUpload from '@/components/common/ImageUpload'

type HerbFormProps = {
  initialData?: Herb
  onSuccess: () => void
  onCancel: () => void
}

export function HerbForm({ initialData, onSuccess, onCancel }: HerbFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Herb>>({
    name: initialData?.name || '',
    scientific_name: initialData?.scientific_name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'medicinal',
    benefits: initialData?.benefits || [],
    preparation_methods: initialData?.preparation_methods || [],
    treats_illnesses: initialData?.treats_illnesses || [],
    is_premium: initialData?.is_premium || false,
    image_url: initialData?.image_url || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (initialData) {
        await updateHerb(initialData.id, formData)
      } else {
        await createHerb(formData as Omit<Herb, 'id' | 'created_at'>)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving herb:', error)
      alert('Error saving herb. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'benefits' | 'preparation_methods'
  ) => {
    const values = e.target.value.split(',').map(v => v.trim())
    setFormData(prev => ({ ...prev, [field]: values }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Herb Image
        </label>
        <ImageUpload
          onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
          defaultImage={formData.image_url || '/placeholder-herb.jpg'}
          currentImagePath={initialData?.image_url}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label htmlFor="scientific_name" className="block text-sm font-medium text-gray-700">
          Scientific Name
        </label>
        <input
          type="text"
          id="scientific_name"
          value={formData.scientific_name}
          onChange={e => setFormData(prev => ({ ...prev, scientific_name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
          Benefits (comma-separated)
        </label>
        <input
          type="text"
          id="benefits"
          value={formData.benefits?.join(', ')}
          onChange={e => handleArrayInputChange(e, 'benefits')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="preparation_methods" className="block text-sm font-medium text-gray-700">
          Preparation Methods (comma-separated)
        </label>
        <input
          type="text"
          id="preparation_methods"
          value={formData.preparation_methods?.join(', ')}
          onChange={e => handleArrayInputChange(e, 'preparation_methods')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Illnesses Treated (one per line)
        </label>
        <textarea
          value={formData.treats_illnesses?.join('\n') || ''}
          onChange={(e) => {
            const illnesses = e.target.value
              .split('\n')
              .map(item => item.trim())
              .filter(item => item !== '')
            setFormData({ ...formData, treats_illnesses: illnesses })
          }}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter illnesses this herb treats (one per line)"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_premium"
          checked={formData.is_premium}
          onChange={e => setFormData(prev => ({ ...prev, is_premium: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="is_premium" className="ml-2 block text-sm text-gray-700">
          Premium Content
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Herb' : 'Create Herb'}
        </button>
      </div>
    </form>
  )
}
