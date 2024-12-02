import { NextApiRequest, NextApiResponse } from 'next'
import { getHerbById } from '@/lib/services/herbs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid herb ID' })
  }

  try {
    const herbId = parseInt(id, 10)
    if (isNaN(herbId)) {
      return res.status(400).json({ error: 'Invalid herb ID format' })
    }

    const herb = await getHerbById(herbId)
    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' })
    }

    return res.status(200).json(herb)
  } catch (error) {
    console.error('Error fetching herb:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
