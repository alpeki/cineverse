/**
 * Movies Service
 * 
 * Handles all movie-related database operations
 */

import { supabase } from '../lib/supabase.js'

/**
 * Get all published movies
 * @param {number} limit - Number of movies to fetch
 * @returns {Promise<Array>} Array of movie objects
 */
export async function getMovies(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}

/**
 * Get a single movie by ID
 * @param {string} id - Movie UUID
 * @returns {Promise<Object|null>} Movie object or null
 */
export async function getMovieById(id) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching movie:', error)
    return null
  }
}

/**
 * Search movies by title or synopsis
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching movies
 */
export async function searchMovies(query) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
      .eq('status', 'published')
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

/**
 * Get movies by genre
 * @param {string} genre - Genre name
 * @param {number} limit - Number of movies to fetch
 * @returns {Promise<Array>} Array of movies
 */
export async function getMoviesByGenre(genre, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .contains('genres', [genre])
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching movies by genre:', error)
    return []
  }
}

/**
 * Get movies by year range
 * @param {number} startYear - Start year
 * @param {number} endYear - End year
 * @returns {Promise<Array>} Array of movies
 */
export async function getMoviesByYear(startYear, endYear) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .gte('year', startYear)
      .lte('year', endYear)
      .eq('status', 'published')
      .order('year', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching movies by year:', error)
    return []
  }
}

/**
 * Get top rated movies
 * @param {number} limit - Number of movies to fetch
 * @returns {Promise<Array>} Array of top rated movies
 */
export async function getTopRatedMovies(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'published')
      .gte('rating', 4.0)
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return []
  }
}
