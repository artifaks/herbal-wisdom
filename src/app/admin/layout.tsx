import { ensureStorageBucket } from '@/lib/services/storage'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Try to ensure storage bucket exists, but continue even if it fails
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    
    const response = await fetch(`${protocol}://${host}/api/storage/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to initialize storage bucket:', error)
    }
  } catch (error) {
    console.error('Failed to initialize storage bucket:', error)
    // Continue anyway, as the bucket might already exist or be managed elsewhere
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Herb Administration</h1>
      {children}
    </div>
  )
}
