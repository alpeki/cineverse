/**
 * 🎬 CineVerse Features
 * Theme Toggle, Language Switcher, Search, Auth
 */

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { supabase } from './lib/supabaseClient.js'

// ========================================
// GRADIENT CATEGORIES ANIMATION
// ========================================
function initGradientCategories() {
  const items = document.querySelectorAll('.category-list li')

  if (!items || items.length === 0) {
    console.warn('Category list items not found')
    return
  }

  // GSAP CustomEase için fallback
  const customEase = window.CustomEase
    ? CustomEase.create('custom', 'M0,0 C0.548,0.032 0.63,1 1,1')
    : 'power2.inOut'

  // Intro animation
  if (window.gsap) {
    const introTween = gsap
      .timeline({
        defaults: {
          duration: 0.48
        }
      })
      .to(items, {
        '--stop-active': '100%',
        stagger: {
          each: 0.1,
          ease: customEase
        }
      })
      .to(items, {
        '--stop-hover': '100%',
        stagger: {
          each: 0.1
        }
      })
      .to(
        items,
        {
          '--stop-hover': '0%',
          stagger: {
            each: -0.1
          }
        },
        '-=0.1'
      )

    gsap.set(items, { '--stop-hover': '0%' })

    // Hover animations
    items.forEach(item => {
      item.addEventListener('mouseenter', function () {
        gsap.to(this, {
          '--stop-hover': '100%',
          ease: customEase,
          duration: 0.36
        })
      })

      item.addEventListener('mouseleave', function () {
        gsap.to(this, {
          '--stop-hover': '0%',
          ease: customEase,
          duration: 0.36
        })
      })

      // Smooth scroll
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target')
        if (target) {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  }
}

// Initialize gradient categories when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGradientCategories)
} else {
  initGradientCategories()
}

// ========================================
// THEME TOGGLE
// ========================================
const themeToggle = document.getElementById('theme-toggle')
const themeIcon = document.getElementById('theme-icon')
let currentTheme = localStorage.getItem('theme') || 'dark'

// Apply saved theme
if (currentTheme === 'light') {
  document.body.classList.add('light-theme')
  themeIcon.textContent = '☀️'
}

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-theme')
  currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark'
  themeIcon.textContent = currentTheme === 'light' ? '☀️' : '🌙'
  localStorage.setItem('theme', currentTheme)
})

// ========================================
// LANGUAGE SWITCHER
// ========================================
const langToggle = document.getElementById('lang-toggle')
const langText = document.getElementById('lang-text')
let currentLang = localStorage.getItem('lang') || 'tr'

// Translations
const translations = {
  tr: {
    İncelemeler: 'İncelemeler',
    Fragmanlar: 'Fragmanlar',
    Listeler: 'Listeler',
    Profiller: 'Profiller',
    Haberler: 'Haberler',
    'Giriş Yap': 'Giriş Yap',
    'Kayıt Ol': 'Kayıt Ol',
    Ara: 'Ara',
    'Hesabın yok mu?': 'Hesabın yok mu?',
    'Zaten hesabın var mı?': 'Zaten hesabın var mı?'
  },
  en: {
    İncelemeler: 'Reviews',
    Fragmanlar: 'Trailers',
    Listeler: 'Lists',
    Profiller: 'Profiles',
    Haberler: 'News',
    'Giriş Yap': 'Login',
    'Kayıt Ol': 'Sign Up',
    Ara: 'Search',
    'Hesabın yok mu?': "Don't have an account?",
    'Zaten hesabın var mı?': 'Already have an account?'
  }
}

function updateLanguage(lang) {
  currentLang = lang
  langText.textContent = lang === 'tr' ? 'EN' : 'TR'

  // Update all elements with data-tr and data-en
  document.querySelectorAll('[data-tr]').forEach(el => {
    const trText = el.getAttribute('data-tr')
    const enText = el.getAttribute('data-en')
    el.textContent = lang === 'tr' ? trText : enText
  })

  // Update placeholders
  document.querySelectorAll('[data-placeholder-tr]').forEach(input => {
    const trPlaceholder = input.getAttribute('data-placeholder-tr')
    const enPlaceholder = input.getAttribute('data-placeholder-en')
    input.placeholder = lang === 'tr' ? trPlaceholder : enPlaceholder
  })

  localStorage.setItem('lang', lang)
}

// Apply saved language
updateLanguage(currentLang)

langToggle?.addEventListener('click', () => {
  updateLanguage(currentLang === 'tr' ? 'en' : 'tr')
})

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
const searchBtn = document.getElementById('search-btn')
const searchModal = document.getElementById('search-modal')
const searchInput = document.getElementById('search-input')
const searchResults = document.getElementById('search-results')

searchBtn?.addEventListener('click', () => {
  searchModal?.classList.add('active')
  document.body.style.overflow = 'hidden' // Lock scroll
  searchInput?.focus()
})

// Close modal and unlock scroll
document.querySelectorAll('[data-close]').forEach(closeBtn => {
  closeBtn.addEventListener('click', e => {
    const modal = e.target.closest('.modal')
    if (modal) {
      modal.classList.remove('active')
      document.body.style.overflow = '' // Unlock scroll
    }
  })
})

let searchTimeout
searchInput?.addEventListener('input', e => {
  clearTimeout(searchTimeout)
  const query = e.target.value.trim()

  if (query.length < 2) {
    searchResults.innerHTML = ''
    return
  }

  searchTimeout = setTimeout(async () => {
    await performSearch(query)
  }, 300)
})

async function performSearch(query) {
  searchResults.innerHTML = '<p class="text-gray-400">Aranıyor...</p>'

  try {
    // Search in movies, profiles, news
    const [movies, profiles, news] = await Promise.all([
      supabase.from('movies').select('*').ilike('title', `%${query}%`).limit(5),
      supabase.from('profiles').select('*').ilike('name', `%${query}%`).limit(5),
      supabase.from('news').select('*').ilike('title', `%${query}%`).limit(5)
    ])

    const results = []

    if (movies.data?.length) {
      results.push('<h3 class="font-bold text-accent mb-2">Filmler</h3>')
      movies.data.forEach(m => {
        results.push(`
          <div class="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer transition">
            <p class="font-bold">${m.title}</p>
            <p class="text-sm text-gray-400">${m.synopsis?.substring(0, 80) || ''}...</p>
          </div>
        `)
      })
    }

    if (profiles.data?.length) {
      results.push('<h3 class="font-bold text-accent mb-2 mt-4">Profiller</h3>')
      profiles.data.forEach(p => {
        results.push(`
          <div class="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer transition">
            <p class="font-bold">${p.name}</p>
            <p class="text-sm text-gray-400">${p.role === 'director' ? 'Yönetmen' : 'Oyuncu'}</p>
          </div>
        `)
      })
    }

    if (news.data?.length) {
      results.push('<h3 class="font-bold text-accent mb-2 mt-4">Haberler</h3>')
      news.data.forEach(n => {
        results.push(`
          <div class="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer transition">
            <p class="font-bold">${n.title}</p>
            <p class="text-sm text-gray-400">${new Date(n.published_date).toLocaleDateString('tr-TR')}</p>
          </div>
        `)
      })
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="text-gray-400">Sonuç bulunamadı.</p>'
    } else {
      searchResults.innerHTML = results.join('')
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.innerHTML = '<p class="text-red-500">Arama sırasında bir hata oluştu.</p>'
  }
}

// ========================================
// AUTH MODALS
// ========================================
const loginBtn = document.getElementById('login-btn')
const loginModal = document.getElementById('login-modal')
const signupModal = document.getElementById('signup-modal')
const showSignup = document.getElementById('show-signup')
const showLogin = document.getElementById('show-login')
const loginForm = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')

loginBtn?.addEventListener('click', () => {
  loginModal?.classList.add('active')
})

showSignup?.addEventListener('click', () => {
  loginModal?.classList.remove('active')
  signupModal?.classList.add('active')
})

showLogin?.addEventListener('click', () => {
  signupModal?.classList.remove('active')
  loginModal?.classList.add('active')
})

// Login
loginForm?.addEventListener('submit', async e => {
  e.preventDefault()
  const email = e.target[0].value
  const password = e.target[1].value

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    alert('Giriş başarılı! 🎉')
    loginModal?.classList.remove('active')
    loginBtn.innerHTML = '<span>👤 Profil</span>'
  } catch (error) {
    alert('Giriş hatası: ' + error.message)
  }
})

// Signup
signupForm?.addEventListener('submit', async e => {
  e.preventDefault()
  const name = e.target[0].value
  const email = e.target[1].value
  const password = e.target[2].value

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    })

    if (error) throw error

    alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin. 📧')
    signupModal?.classList.remove('active')
  } catch (error) {
    alert('Kayıt hatası: ' + error.message)
  }
})

// Check if user is logged in
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    loginBtn.innerHTML = '<span>👤 Profil</span>'
  }
})

// ========================================
// NAV CATEGORIES VISIBILITY
// ========================================
const navCategories = document.getElementById('nav-categories')
const heroSection = document.getElementById('hero')

function updateNavCategories() {
  if (!navCategories || !heroSection) return

  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
  const scrollPosition = window.scrollY + 100 // Add offset for better UX

  if (scrollPosition > heroBottom) {
    navCategories.classList.remove('hidden')
  } else {
    navCategories.classList.add('hidden')
  }
}

// Update on scroll
window.addEventListener('scroll', updateNavCategories)
// Initial check
updateNavCategories()

console.log('✅ Features loaded: Theme, Language, Search, Auth, Nav Categories')
