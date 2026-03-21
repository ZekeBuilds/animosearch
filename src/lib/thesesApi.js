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
  const { data, error } = await supabase
    .from('theses')
    .select('id,slug,title,author,year,college,college_name,department,degree_level,abstract,keywords,animo_url,featured')
    .order('year', { ascending: false })

  if (error) throw error
  return data.map(normalize)
}

export async function fetchThesisBySlug(slug) {
  const { data, error } = await supabase
    .from('theses')
    .select('id,slug,title,author,year,college,college_name,department,degree_level,abstract,keywords,animo_url,featured')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // row not found
    throw error
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

  if (error) throw error
  return data
}
