/**
 * Lists Service
 * 
 * Handles all list-related database operations
 */

import { supabase } from '../lib/supabase.js'

/**
 * Get all published lists
 * @param {number} limit - Number of lists to fetch
 * @returns {Promise<Array>} Array of list objects
 */
export async function getLists(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lists:', error)
    return []
  }
}

/**
 * Get a single list by slug with movies
 * @param {string} slug - List slug
 * @returns {Promise<Object|null>} List object with movies or null
 */
export async function getListBySlug(slug) {
  try {
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('slug', slug)
      .single()

    if (listError) throw listError

    // Fetch movies in the list
    if (list && list.movie_ids && list.movie_ids.length > 0) {
      const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .in('id', list.movie_ids)

      if (moviesError) throw moviesError
      list.movies = movies || []
    }

    return list
  } catch (error) {
    console.error('Error fetching list:', error)
    return null
  }
}

/**
 * Get lists by category
 * @param {string} category - Category name
 * @param {number} limit - Number of lists to fetch
 * @returns {Promise<Array>} Array of lists
 */
export async function getListsByCategory(category, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lists by category:', error)
    return []
  }
}
