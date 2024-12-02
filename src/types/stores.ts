export type HerbalStore = {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  latitude: number
  longitude: number
  phone: string
  website?: string
  hours_of_operation: string
  specialties: string[]
  rating: number
  created_at: string
}

export type StoreFilters = {
  searchQuery?: string
  city?: string
  state?: string
  specialty?: string
  radius?: number // in kilometers
  currentLocation?: {
    latitude: number
    longitude: number
  }
  sortBy?: 'rating' | 'distance' | 'name'
}
