/**
 * 🎬 CineVerse Main Application
 *
 * Handles dynamic data loading and UI rendering
 */

import { getMovies, getTopRatedMovies } from './services/movies.js'
import { getProfiles } from './services/profiles.js'
import { getNews } from './services/news.js'
import { getLists } from './services/lists.js'

// Loading state management
let isLoading = false

/**
 * Show loading spinner
 */
function showLoading(sectionId) {
  const section = document.querySelector(`#${sectionId}`)
  if (!section) return

  const container = section.querySelector('.grid') || section.querySelector('.container')
  if (container) {
    container.innerHTML = `
      <div class="col-span-full flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    `
  }
}

/**
 * Show error message
 */
function showError(sectionId, message = 'Veri yüklenirken bir hata oluştu') {
  const section = document.querySelector(`#${sectionId}`)
  if (!section) return

  const container = section.querySelector('.grid') || section.querySelector('.container')
  if (container) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20">
        <p class="text-red-500 text-xl mb-4">❌ ${message}</p>
        <button onclick="location.reload()" class="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-full font-bold transition">
          Tekrar Dene
        </button>
      </div>
    `
  }
}

/**
 * Render movie card
 */
function renderMovieCard(movie) {
  const stars = '⭐'.repeat(Math.round(movie.rating))

  return `
    <div class="review-card card-tilt card-glow group cursor-pointer" data-movie-id="${movie.id}">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img 
          src="${movie.poster_url || '/assets/images/placeholder.jpg'}" 
          alt="${movie.title}" 
          loading="lazy" 
          class="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
          onerror="this.src='/assets/images/placeholder.jpg'"
        />
      </div>
      <h3 class="text-2xl font-bold mb-2">${movie.title}</h3>
      <div class="flex items-center mb-3">
        <span class="text-accent text-xl">${stars}</span>
        <span class="ml-2 text-sm text-gray-400">${movie.rating.toFixed(1)}/5</span>
      </div>
      <p class="text-sm font-light text-gray-300">${movie.synopsis?.substring(0, 150) || movie.review?.substring(0, 150) || 'Açıklama yok'}...</p>
    </div>
  `
}

/**
 * Render profile card
 */
function renderProfileCard(profile) {
  return `
    <div class="profile-card cursor-pointer group" data-profile-id="${profile.id}">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img 
          src="${profile.photo_url || '/assets/images/placeholder-profile.jpg'}" 
          alt="${profile.name}" 
          loading="lazy" 
          class="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          onerror="this.src='/assets/images/placeholder-profile.jpg'"
        />
      </div>
      <h3 class="text-xl font-bold">${profile.name}</h3>
      <p class="text-sm text-gray-400 font-light">${profile.role === 'director' ? 'Yönetmen' : 'Oyuncu'}</p>
    </div>
  `
}

/**
 * Render news card
 */
function renderNewsCard(news) {
  const date = new Date(news.published_date).toLocaleDateString('tr-TR')

  return `
    <article class="news-card card-tilt card-glow group cursor-pointer" data-news-id="${news.id}">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img 
          src="${news.thumbnail_url || '/assets/images/placeholder-news.jpg'}" 
          alt="${news.title}" 
          loading="lazy" 
          class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          onerror="this.src='/assets/images/placeholder-news.jpg'"
        />
      </div>
      <p class="text-sm text-accent mb-2">${date}</p>
      <h3 class="text-xl font-bold mb-3 group-hover:text-accent transition">${news.title}</h3>
      <p class="text-sm font-light text-gray-300">${news.excerpt || news.content?.substring(0, 150) || ''}...</p>
      <a href="#" class="mt-4 inline-block text-accent text-sm font-bold hover:underline">Devamını Oku →</a>
    </article>
  `
}

/**
 * Load and render movies
 */
async function loadMovies() {
  console.log('📽️ Loading movies...')
  showLoading('reviews')

  try {
    const movies = await getMovies(6)

    if (!movies || movies.length === 0) {
      showError('reviews', 'Henüz film eklenmemiş')
      return
    }

    const container = document.querySelector('#reviews .grid')
    if (container) {
      container.innerHTML = movies.map(renderMovieCard).join('')
      console.log(`✅ Loaded ${movies.length} movies`)
    }
  } catch (error) {
    console.error('❌ Error loading movies:', error)
    showError('reviews')
  }
}

/**
 * Load and render profiles
 */
async function loadProfiles() {
  console.log('👤 Loading profiles...')
  showLoading('profiles')

  try {
    const profiles = await getProfiles(8)

    if (!profiles || profiles.length === 0) {
      showError('profiles', 'Henüz profil eklenmemiş')
      return
    }

    const container = document.querySelector('#profiles .grid')
    if (container) {
      container.innerHTML = profiles.map(renderProfileCard).join('')
      console.log(`✅ Loaded ${profiles.length} profiles`)
    }
  } catch (error) {
    console.error('❌ Error loading profiles:', error)
    showError('profiles')
  }
}

/**
 * Load and render news
 */
async function loadNews() {
  console.log('📰 Loading news...')
  showLoading('news')

  try {
    const news = await getNews(3)

    if (!news || news.length === 0) {
      showError('news', 'Henüz haber eklenmemiş')
      return
    }

    const container = document.querySelector('#news .grid')
    if (container) {
      container.innerHTML = news.map(renderNewsCard).join('')
      console.log(`✅ Loaded ${news.length} news items`)
    }
  } catch (error) {
    console.error('❌ Error loading news:', error)
    showError('news')
  }
}

/**
 * Initialize app
 */
export async function initApp() {
  console.log('🚀 Initializing CineVerse...')

  if (isLoading) {
    console.log('⏳ Already loading...')
    return
  }

  isLoading = true

  try {
    // Load all sections in parallel
    await Promise.all([loadMovies(), loadProfiles(), loadNews()])

    console.log('✅ CineVerse initialized successfully!')
  } catch (error) {
    console.error('❌ Error initializing app:', error)
  } finally {
    isLoading = false
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
