import { supabaseClient } from '@/lib/supabase'
import { HerbalStore, StoreFilters } from '@/types/stores'

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function getStores(filters: StoreFilters = {}): Promise<HerbalStore[]> {
  let query = supabaseClient
    .from('herbal_stores')
   
    .select('*')

  if (filters.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
  }

  if (filters.city) {
    query = query.eq('city', filters.city)
  }

  if (filters.state) {
    query = query.eq('state', filters.state)
  }

  if (filters.specialty) {
    query = query.contains('specialties', [filters.specialty])
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  let stores = data as HerbalStore[]

  // Apply distance filtering if current location and radius are provided
  if (filters.currentLocation && filters.radius) {
    const { latitude, longitude } = filters.currentLocation
    stores = stores.filter(store => {
      const distance = calculateDistance(
        latitude,
        longitude,
        store.latitude,
        store.longitude
      )
      return distance <= filters.radius!
    })

    // Add distance to each store
    stores = stores.map(store => ({
      ...store,
      distance: calculateDistance(
        latitude,
        longitude,
        store.latitude,
        store.longitude
      )
    }))

    // Sort by distance
    stores.sort((a: any, b: any) => a.distance - b.distance)
  }

  // Sort stores based on the sortBy filter
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'rating':
        stores.sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        if (filters.currentLocation) {
          // Stores are already sorted by distance when location is used
          break
        }
        // Fall through to name sorting if no location
      case 'name':
        stores.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
  }

  return stores
}

export async function getStoreLocations(): Promise<{ city: string; state: string }[]> {
  const { data, error } = await supabase
    .from('herbal_stores')
    .select('city, state')
    .order('state')
    .order('city')

  if (error) {
    throw error
  }

  // Remove duplicates
  return Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse)
}

export async function getStoreSpecialties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('herbal_stores')
    .select('specialties')

  if (error) {
    throw error
  }

  // Flatten and get unique specialties
  const allSpecialties = data.flatMap(store => store.specialties)
  return Array.from(new Set(allSpecialties)).sort()
}
