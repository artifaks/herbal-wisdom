import { Herb } from '@/types/herbs'
import Link from 'next/link'
import Image from '@/components/common/Image'

type HerbCardProps = {
  herb: Herb
}

export function HerbCard({ herb }: HerbCardProps) {
  return (
    <Link
      href={`/herbs/${herb.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image
          src={herb.image_url || '/placeholder-herb.jpg'}
          alt={`Image of ${herb.name}`}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-herb.jpg'
          }}
          fill
          className="object-cover"
        />
        {herb.is_premium && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            PREMIUM
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{herb.name}</h3>
        <p className="text-sm text-gray-600 italic mb-2">{herb.scientific_name}</p>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{herb.description}</p>
        
        {/* Show up to 3 illnesses this herb treats */}
        {herb.treats_illnesses?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {herb.treats_illnesses.slice(0, 3).map((illness, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs"
              >
                {illness}
              </span>
            ))}
            {herb.treats_illnesses?.length > 3 && (
              <span className="text-xs text-gray-500">
                +{herb.treats_illnesses.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {herb.category}
          </span>
        </div>
      </div>
    </Link>
  )
}
