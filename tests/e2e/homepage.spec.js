/**
 * Homepage E2E Tests
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CineVerse/)
  })

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should have hero section', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('should have movie cards', async ({ page }) => {
    await page.goto('/')
    const movieCards = page.locator('.movie-card')
    await expect(movieCards.first()).toBeVisible()
  })

  test('should navigate to sections on click', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="#reviews"]')
    await page.waitForTimeout(1000)
    const url = page.url()
    expect(url).toContain('#reviews')
  })

  test('should open modal on profile click', async ({ page }) => {
    await page.goto('/')
    const profileCard = page.locator('.profile-card').first()
    if (await profileCard.isVisible()) {
      await profileCard.click()
      const modal = page.locator('.modal')
      await expect(modal).toBeVisible()
    }
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })
})
