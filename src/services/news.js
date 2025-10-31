/**
 * 📰 News Service
 * 
 * Handles all news-related database operations for CineVerse.
 */

import { supabase } from '../lib/supabaseClient.js'

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
    console.error('❌ Error fetching news:', error.message)
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
    console.error('❌ Error fetching news by slug:', error.message)
    return null
  }
}

/**
 * Get news by category
 * @param {string} category - Category name (e.g. news, review, interview)
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
    console.error('❌ Error fetching news by category:', error.message)
    return []
  }
}

/**
 * Increment news view count (safe RPC)
 * Requires an RPC function in Supabase: increment_news_views(news_id UUID)
 * @param {string} id - News UUID
 * @returns {Promise<boolean>} Success status
 */
export async function incrementNewsViews(id) {
  try {
    const { error } = await supabase.rpc('increment_news_views', { news_id: id })
    if (error) throw error
    return true
  } catch (error) {
    console.warn('⚠️ increment_news_views RPC not found or failed:', error.message)
    return false
  }
}
