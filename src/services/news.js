/**
 * News Service
 * 
 * Handles all news-related database operations
 */

import { supabase } from '../lib/supabase.js'

/**
 * Get all published news
 * @param {number} limit - Number of news items to fetch
 * @returns {Promise<Array>} Array of news objects
 */
export async function getNews(limit = 3) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

/**
 * Get a single news item by slug
 * @param {string} slug - News slug
 * @returns {Promise<Object|null>} News object or null
 */
export async function getNewsBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching news:', error)
    return null
  }
}

/**
 * Get news by category
 * @param {string} category - Category name (news, review, interview)
 * @param {number} limit - Number of news items to fetch
 * @returns {Promise<Array>} Array of news items
 */
export async function getNewsByCategory(category, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching news by category:', error)
    return []
  }
}

/**
 * Increment news view count
 * @param {string} id - News UUID
 * @returns {Promise<boolean>} Success status
 */
export async function incrementNewsViews(id) {
  try {
    const { error } = await supabase.rpc('increment_news_views', { news_id: id })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error incrementing news views:', error)
    return false
  }
}
