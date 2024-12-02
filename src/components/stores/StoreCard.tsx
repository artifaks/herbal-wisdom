import { HerbalStore } from '@/types/stores'
import { StarIcon } from '@heroicons/react/20/solid'

type StoreCardProps = {
  store: HerbalStore & { distance?: number }
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{store.description}</p>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {store.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-600">
            {store.city}, {store.state} {store.postal_code}
          </p>
          {store.distance !== undefined && (
            <p className="text-sm text-green-600 mt-1">
              {store.distance.toFixed(1)} km away
            </p>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Hours</h4>
          <p className="text-sm text-gray-600">{store.hours_of_operation}</p>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Specialties</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {store.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <a
            href={`tel:${store.phone}`}
            className="text-sm text-green-600 hover:text-green-700"
          >
            {store.phone}
          </a>
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
