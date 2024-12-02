export type Herb = {
  id: number
  name: string
  scientific_name: string
  description: string
  benefits: string[]
  category: string
  preparation_methods: string[]
  treats_illnesses: string[]  // Array of illnesses this herb can treat
  image_url: string
  is_premium: boolean
  created_at: string
}

export type HerbFilters = {
  category?: string
  isPremium?: boolean
  searchQuery?: string
  illness?: string  // Add filter by illness
}

export type PaginationParams = {
  page: number
  pageSize: number
}
