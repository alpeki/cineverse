/**
 * Analytics Configuration
 * 
 * Vercel Analytics integration for tracking user behavior and performance
 */

import { inject } from '@vercel/analytics'

// Initialize Vercel Analytics
export function initAnalytics() {
  if (typeof window !== 'undefined') {
    inject()
    console.log('✅ Vercel Analytics initialized')
  }
}

// Track custom events
export function trackEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', eventName, properties)
  }
}

// Track page views
export function trackPageView(pageName) {
  trackEvent('page_view', { page: pageName })
}

// Track movie views
export function trackMovieView(movieId, movieTitle) {
  trackEvent('movie_viewed', {
    movie_id: movieId,
    movie_title: movieTitle
  })
}

// Track search queries
export function trackSearch(query, resultsCount) {
  trackEvent('search', {
    query: query,
    results_count: resultsCount
  })
}

// Track modal opens
export function trackModalOpen(modalType, itemId) {
  trackEvent('modal_opened', {
    modal_type: modalType,
    item_id: itemId
  })
}

// Track errors
export function trackError(errorMessage, errorStack) {
  trackEvent('error', {
    message: errorMessage,
    stack: errorStack
  })
}
