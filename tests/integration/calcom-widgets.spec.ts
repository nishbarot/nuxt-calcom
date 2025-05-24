import { test, expect } from '@playwright/test'

test.describe('Cal.com Widgets Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the playground
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Page Loading', () => {
    test('should load the playground page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Nuxt Cal\.com Module/)
      await expect(page.locator('h1')).toContainText('Nuxt Cal.com Module - Dev Playground')
    })

    test('should show Cal.com script loading status', async ({ page }) => {
      // Check for status indicator
      const statusElement = page.locator('text=Cal.com Script')
      await expect(statusElement).toBeVisible()

      // Wait for script to load (with timeout)
      await expect(page.locator('text=Cal.com Script Loaded')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Inline Widget', () => {
    test('should render inline widget container', async ({ page }) => {
      const inlineWidget = page.locator('.cal-inline-widget')
      await expect(inlineWidget).toBeVisible()

      // Check that it has proper dimensions
      const boundingBox = await inlineWidget.boundingBox()
      expect(boundingBox?.height).toBeGreaterThan(400)
    })

    test('should load Cal.com iframe in inline widget', async ({ page }) => {
      // Wait for Cal.com script to load
      await page.waitForFunction(() => window.Cal && typeof window.Cal === 'function', {
        timeout: 10000,
      })

      // Wait for iframe to appear (Cal.com creates iframes)
      await expect(page.locator('iframe')).toBeVisible({ timeout: 15000 })

      // Verify iframe has Cal.com source
      const iframe = page.locator('iframe').first()
      const src = await iframe.getAttribute('src')
      expect(src).toContain('cal.com')
    })

    test('should handle different cal links', async ({ page }) => {
      // Change the input to a different cal link
      await page.fill('#calLinkInput', 'demo/30min')

      // Wait for the widget to update
      await page.waitForTimeout(1000)

      // Check that the effective link is updated
      await expect(page.locator('text=demo/30min')).toBeVisible()
    })

    test('should parse full URLs correctly', async ({ page }) => {
      // Test URL parsing
      await page.fill('#calLinkInput', 'https://cal.com/demo/consultation')

      // Wait for normalization
      await page.waitForTimeout(500)

      // Should show normalized version
      await expect(page.locator('text=demo/consultation')).toBeVisible()
    })
  })

  test.describe('Popup Button', () => {
    test('should render popup button', async ({ page }) => {
      const popupButton = page.locator('button:has-text("Book:")')
      await expect(popupButton).toBeVisible()
      await expect(popupButton).toBeEnabled()
    })

    test('should have proper data attributes', async ({ page }) => {
      const popupButton = page.locator('button:has-text("Book:")').first()

      // Check for Cal.com data attributes
      await expect(popupButton).toHaveAttribute('data-cal-link')
      await expect(popupButton).toHaveAttribute('data-cal-namespace')
    })

    test('should open popup when clicked', async ({ page }) => {
      // Wait for Cal.com script to be ready
      await page.waitForFunction(() => window.Cal && typeof window.Cal === 'function', {
        timeout: 10000,
      })

      const popupButton = page.locator('button:has-text("Book:")').first()

      // Click the button
      await popupButton.click()

      // Wait for popup/modal to appear
      // Cal.com typically creates a modal overlay
      await expect(page.locator('[role="dialog"], .cal-modal, iframe')).toBeVisible({
        timeout: 5000,
      })
    })

    test('should handle custom button text', async ({ page }) => {
      // Change cal link which should update button text
      await page.fill('#calLinkInput', 'custom-user')
      await page.waitForTimeout(500)

      await expect(page.locator('button:has-text("Book: custom-user")')).toBeVisible()
    })
  })

  test.describe('Floating Widget', () => {
    test('should render floating widget', async ({ page }) => {
      const floatingWidget = page.locator('.cal-floating-widget')
      await expect(floatingWidget).toBeVisible()
    })

    test('should be positioned correctly', async ({ page }) => {
      const floatingWidget = page.locator('.cal-floating-widget')

      // Check CSS positioning
      await expect(floatingWidget).toHaveCSS('position', 'fixed')
      await expect(floatingWidget).toHaveCSS('z-index', '9999')
    })

    test('should be clickable and open popup', async ({ page }) => {
      // Wait for Cal.com script
      await page.waitForFunction(() => window.Cal && typeof window.Cal === 'function', {
        timeout: 10000,
      })

      const floatingButton = page.locator('.cal-floating-widget button')
      await expect(floatingButton).toBeVisible()

      // Click floating button
      await floatingButton.click()

      // Should open popup
      await expect(page.locator('[role="dialog"], .cal-modal, iframe')).toBeVisible({
        timeout: 5000,
      })
    })

    test('should update when cal link changes', async ({ page }) => {
      // Change the cal link
      await page.fill('#calLinkInput', 'new-user')
      await page.waitForTimeout(500)

      // Floating widget should update
      await expect(page.locator('button:has-text("Float: new-user")')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      // All widgets should still be visible and functional
      await expect(page.locator('.cal-inline-widget')).toBeVisible()
      await expect(page.locator('button:has-text("Book:")')).toBeVisible()
      await expect(page.locator('.cal-floating-widget')).toBeVisible()
    })

    test('should adapt inline widget on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 })

      const inlineWidget = page.locator('.cal-inline-widget')
      const boundingBox = await inlineWidget.boundingBox()

      // Should not exceed viewport width
      expect(boundingBox?.width).toBeLessThanOrEqual(320)
    })
  })

  test.describe('Error Handling', () => {
    test('should handle invalid cal links gracefully', async ({ page }) => {
      // Enter invalid cal link
      await page.fill('#calLinkInput', 'invalid-url-format')

      // Should fall back to demo
      await expect(page.locator('text=demo')).toBeVisible()
    })

    test('should show loading states', async ({ page }) => {
      // Check for loading placeholder
      await expect(page.locator('text=Loading Cal.com calendar')).toBeVisible()
    })

    test('should handle script loading failures gracefully', async ({ page }) => {
      // Block Cal.com script
      await page.route('**/embed.js', route => route.abort())

      // Reload page
      await page.reload()

      // Should show not loaded status
      await expect(page.locator('text=Cal.com Script Not Loaded')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
    })

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Filter out known acceptable errors (like network errors for blocked resources)
      const criticalErrors = errors.filter(
        error => !error.includes('net::ERR_') && !error.includes('Failed to load resource'),
      )

      expect(criticalErrors).toHaveLength(0)
    })
  })
})
