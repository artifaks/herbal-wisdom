import { supabase } from '@/lib/supabase'
import { Herb, HerbFilters, PaginationParams } from '@/types/herbs'

export async function getHerbs(
  filters: HerbFilters,
  pagination: PaginationParams
): Promise<{ data: Herb[]; count: number }> {
  const { page, pageSize } = pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const client = supabase()
  if (!client) throw new Error('Supabase client not initialized')

  let query = client
    .from('herbs')
    .select('*', { count: 'exact' })

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.isPremium !== undefined) {
    query = query.eq('is_premium', filters.isPremium)
  }
  if (filters.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,scientific_name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
  }
  if (filters.illness) {
    query = query.contains('treats_illnesses', [filters.illness])
  }

  // Apply pagination
  query = query.range(start, end)

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  return {
    data: data as Herb[],
    count: count || 0,
  }
}

export async function getHerbCategories(): Promise<string[]> {
  const client = supabase()
  if (!client) throw new Error('Supabase client not initialized')

  const { data, error } = await client
    .from('herbs')
    .select('category')
    .not('category', 'is', null)

  if (error) {
    throw error
  }

  // Filter unique categories and remove any null/empty values
  const categories = [...new Set(data.map(item => item.category))]
    .filter(category => category && category.trim() !== '')
    .sort()

  return categories
}

export async function getHerbById(id: number): Promise<Herb | null> {
  const client = supabase()
  if (!client) throw new Error('Supabase client not initialized')

  const { data, error } = await client
    .from('herbs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null
    }
    throw error
  }

  return data as Herb
}
