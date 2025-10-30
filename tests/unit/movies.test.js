/**
 * Movies Service Unit Tests
 */

import { describe, it, expect, beforeAll } from '@jest/globals'
import { getMovies, getMovieById, searchMovies } from '../../src/services/movies.js'

describe('Movies Service', () => {
  describe('getMovies', () => {
    it('should return an array of movies', async () => {
      const movies = await getMovies(6)
      expect(Array.isArray(movies)).toBe(true)
    })

    it('should respect the limit parameter', async () => {
      const movies = await getMovies(3)
      expect(movies.length).toBeLessThanOrEqual(3)
    })

    it('should return movies with required fields', async () => {
      const movies = await getMovies(1)
      if (movies.length > 0) {
        const movie = movies[0]
        expect(movie).toHaveProperty('id')
        expect(movie).toHaveProperty('title')
        expect(movie).toHaveProperty('rating')
      }
    })
  })

  describe('getMovieById', () => {
    it('should return null for invalid ID', async () => {
      const movie = await getMovieById('invalid-uuid')
      expect(movie).toBeNull()
    })
  })

  describe('searchMovies', () => {
    it('should return an array', async () => {
      const results = await searchMovies('test')
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle empty query', async () => {
      const results = await searchMovies('')
      expect(Array.isArray(results)).toBe(true)
    })
  })
})
