import { getHerbById } from '@/lib/services/herbs'
import { HerbImage } from '@/components/common/HerbImage'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params.id is properly awaited
  const id = await Promise.resolve(params.id)
  const herbId = parseInt(id, 10)
  
  if (isNaN(herbId)) {
    return {
      title: 'Herb Not Found - Herbal Wisdom',
    }
  }

  const herb = await getHerbById(herbId)
  if (!herb) {
    return {
      title: 'Herb Not Found - Herbal Wisdom',
    }
  }

  const parentMetadata = await parent

  return {
    title: `${herb.name} - Herbal Wisdom`,
    description: herb.description,
    openGraph: {
      title: `${herb.name} - Herbal Wisdom`,
      description: herb.description,
      images: herb.image_url ? [herb.image_url] : undefined,
    },
    ...parentMetadata,
  }
}

export default async function HerbPage({ params }: Props) {
  // Ensure params.id is properly awaited
  const id = await Promise.resolve(params.id)
  const herbId = parseInt(id, 10)
  
  if (isNaN(herbId)) {
    notFound()
  }

  const herb = await getHerbById(herbId)
  if (!herb) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-96">
          <HerbImage
            src={herb.image_url || '/placeholder-herb.jpg'}
            alt={`Image of ${herb.name}`}
            className="object-cover"
          />
          {herb.is_premium && (
            <span className="absolute top-4 right-4 bg-yellow-400 text-sm font-bold px-3 py-1 rounded-full">
              PREMIUM
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{herb.name}</h1>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {herb.category}
            </span>
          </div>
          <p className="text-lg text-gray-600 italic mb-4">{herb.scientific_name}</p>
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 mb-6">{herb.description}</p>
            {herb.uses && (
              <>
                <h2 className="text-xl font-semibold mb-2">Traditional Uses</h2>
                <p className="text-gray-700 mb-6">{herb.uses}</p>
              </>
            )}
            {herb.precautions && (
              <>
                <h2 className="text-xl font-semibold mb-2 text-red-600">Precautions</h2>
                <p className="text-gray-700">{herb.precautions}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
        <ul className="list-disc list-inside space-y-2">
          {herb.benefits?.map((benefit, index) => (
            <li key={index} className="text-gray-700">{benefit}</li>
          ))}
        </ul>
      </div>

      {herb.treats_illnesses?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Treats Illnesses</h2>
          <div className="flex flex-wrap gap-2">
            {herb.treats_illnesses.map((illness, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {illness}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Preparation Methods</h2>
        <ul className="list-disc list-inside space-y-2">
          {herb.preparation_methods?.map((method, index) => (
            <li key={index} className="text-gray-700">{method}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
