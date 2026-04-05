import { supabase } from './supabaseClient'

// Maps DB snake_case columns to the camelCase shape used in components
function normalize(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    year: row.year,
    college: row.college,
    collegeName: row.college_name,
    department: row.department,
    degreeLevel: row.degree_level,
    abstract: row.abstract,
    keywords: row.keywords ?? [],
    animoUrl: row.animo_url,
    featured: row.featured,
  }
}

export async function fetchAllTheses() {
  const BATCH = 1000
  let all = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('theses')
      .select('id,slug,title,author,year,college,college_name,department,degree_level,abstract,keywords,animo_url,featured')
      .order('year', { ascending: false })
      .range(from, from + BATCH - 1)

    if (error) {
      console.error('fetchAllTheses error:', error.message)
      throw new Error('Failed to load theses. Please try again.')
    }
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < BATCH) break
    from += BATCH
  }

  return all.map(normalize)
}

export async function fetchThesisBySlug(slug) {
  const { data, error } = await supabase
    .from('theses')
    .select('id,slug,title,author,year,college,college_name,department,degree_level,abstract,keywords,animo_url,featured')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // row not found
    console.error('fetchThesisBySlug error:', error.message)
    throw new Error('Failed to load thesis. Please try again.')
  }
  return normalize(data)
}

export async function fetchRelatedTheses(college, excludeSlug, limit = 4) {
  const { data, error } = await supabase
    .from('theses')
    .select('id,slug,title,author,year,college')
    .eq('college', college)
    .neq('slug', excludeSlug)
    .limit(limit)

  if (error) {
    console.error('fetchRelatedTheses error:', error.message)
    throw new Error('Failed to load related theses.')
  }
  return data
}
