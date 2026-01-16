import { test as base, _electron as electron } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * E2E Test Fixtures for Electron Testing
 *
 * Provides utilities for launching and testing the Electron app.
 */

// Extend base test with Electron app fixture
export const test = base.extend({
  /**
   * Launch Electron app for each test
   */
  electronApp: async ({}, use) => {
    // Path to the Electron main process entry file
    const electronPath = path.join(__dirname, '../../node_modules/.bin/electron')
    const appPath = path.join(__dirname, '../../')

    // Launch Electron app
    const app = await electron.launch({
      args: [appPath],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        ELECTRON_DISABLE_SECURITY_WARNINGS: 'true'
      }
    })

    // Wait for app to be ready
    await app.context().waitForEvent('page', { timeout: 30000 })

    // Use the app in tests
    await use(app)

    // Clean up: close the app
    await app.close()
  },

  /**
   * Get the main window
   */
  mainWindow: async ({ electronApp }, use) => {
    // Wait for the first window to open
    const window = await electronApp.firstWindow()

    // Wait for window to be ready
    await window.waitForLoadState('domcontentloaded')

    await use(window)
  }
})

export { expect } from '@playwright/test'

/**
 * Test Helpers
 */

/**
 * Wait for app to be fully initialized
 */
export async function waitForAppReady(window) {
  await window.waitForSelector('[data-app-ready="true"]', { timeout: 10000 })
}

/**
 * Create a new file in the app
 */
export async function createNewFile(window) {
  await window.keyboard.press('CmdOrCtrl+N')
  await window.waitForTimeout(500)
}

/**
 * Open a file in the app
 */
export async function openFile(window, filePath) {
  // Trigger file open dialog (would need to be mocked or use file input)
  await window.keyboard.press('CmdOrCtrl+O')
  await window.waitForTimeout(500)
}

/**
 * Save current file
 */
export async function saveFile(window) {
  await window.keyboard.press('CmdOrCtrl+S')
  await window.waitForTimeout(500)
}

/**
 * Type text in editor
 */
export async function typeInEditor(window, text) {
  const editor = await window.locator('.editor-content')
  await editor.click()
  await window.keyboard.type(text)
}

/**
 * Get editor content
 */
export async function getEditorContent(window) {
  const editor = await window.locator('.editor-content')
  return await editor.textContent()
}

/**
 * Toggle sidebar
 */
export async function toggleSidebar(window) {
  await window.keyboard.press('CmdOrCtrl+J')
  await window.waitForTimeout(300)
}

/**
 * Check if sidebar is visible
 */
export async function isSidebarVisible(window) {
  const sidebar = await window.locator('.side-bar')
  return await sidebar.isVisible()
}

/**
 * Take screenshot for debugging
 */
export async function takeDebugScreenshot(window, name) {
  await window.screenshot({ path: `test-results/debug-${name}.png` })
}
