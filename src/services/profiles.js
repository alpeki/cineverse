/**
 * 👤 Profiles Service
 * 
 * Handles all profile-related database operations (actors, directors, writers) for CineVerse.
 */

import { supabase } from '../lib/supabaseClient.js'

/**
 * Get all profiles
 * @param {number} limit - Number of profiles to fetch
 * @returns {Promise<Array>} Array of profile objects
 */
export async function getProfiles(limit = 8) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('❌ Error fetching profiles:', error.message)
    return []
  }
}

/**
 * Get a single profile by ID
 * @param {string} id - Profile UUID
 * @returns {Promise<Object|null>} Profile object or null
 */
export async function getProfileById(id) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Error fetching profile by ID:', error.message)
    return null
  }
}

/**
 * Get profiles by role (actor, director, writer)
 * @param {string} role - Role type
 * @param {number} limit - Number of profiles to fetch
 * @returns {Promise<Array>} Array of profiles
 */
export async function getProfilesByRole(role, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('❌ Error fetching profiles by role:', error.message)
    return []
  }
}

/**
 * Search profiles by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching profiles
 */
export async function searchProfiles(query) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('❌ Error searching profiles:', error.message)
    return []
  }
}
