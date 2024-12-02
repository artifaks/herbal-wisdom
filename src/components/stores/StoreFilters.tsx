import { useState, useEffect } from 'react'
import { StoreFilters } from '@/types/stores'
import { getStoreLocations, getStoreSpecialties } from '@/lib/services/stores'
import { useDebounce } from '@/hooks/useDebounce'

type StoreFiltersProps = {
  onFiltersChange: (filters: StoreFilters) => void
}

export function StoreFilters({ onFiltersChange }: StoreFiltersProps) {
  const [locations, setLocations] = useState<{ city: string; state: string }[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [radius, setRadius] = useState<number>(10)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name'>('rating')

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    Promise.all([
      getStoreLocations(),
      getStoreSpecialties(),
    ]).then(([locationsData, specialtiesData]) => {
      setLocations(locationsData)
      setSpecialties(specialtiesData)
    })
  }, [])

  useEffect(() => {
    if (useCurrentLocation && !currentLocation) {
      setIsLocating(true)
      setLocationError(null)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setIsLocating(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Could not detect your location. Please try again or enter it manually.')
          setUseCurrentLocation(false)
          setIsLocating(false)
        }
      )
    }
  }, [useCurrentLocation])

  useEffect(() => {
    onFiltersChange({
      searchQuery: debouncedSearch,
      city: selectedCity,
      state: selectedState,
      specialty: selectedSpecialty,
      radius: useCurrentLocation ? radius : undefined,
      currentLocation: useCurrentLocation ? currentLocation || undefined : undefined,
      sortBy,
    })
  }, [
    debouncedSearch,
    selectedCity,
    selectedState,
    selectedSpecialty,
    radius,
    useCurrentLocation,
    currentLocation,
    sortBy,
    onFiltersChange,
  ])

  const states = Array.from(new Set(locations.map(l => l.state))).sort()
  const cities = locations
    .filter(l => !selectedState || l.state === selectedState)
    .map(l => l.city)
    .sort()

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <input
          type="text"
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value)
            setSelectedCity('') // Reset city when state changes
          }}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'name')}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="rating">Sort by Rating</option>
          <option value="distance">Sort by Distance</option>
          <option value="name">Sort by Name</option>
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useLocation"
            checked={useCurrentLocation}
            onChange={(e) => setUseCurrentLocation(e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="useLocation" className="text-sm text-gray-700">
            Use my location
          </label>
        </div>
      </div>

      {locationError && (
        <div className="mt-4 text-sm text-red-600">
          {locationError}
        </div>
      )}

      {useCurrentLocation && (
        <div className="mt-4">
          {isLocating ? (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              <span>Detecting your location...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">
                Radius: {radius} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
