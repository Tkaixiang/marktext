import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for MarkText E2E Tests
 *
 * Tests the complete Electron application including main process, renderer, and user interactions.
 */

export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run for
  timeout: 60 * 1000,

  // Test execution settings
  fullyParallel: false, // Electron tests should run serially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for Electron tests

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure'
  },

  // Configure projects for different test scenarios
  projects: [
    {
      name: 'electron',
      testMatch: '**/*.e2e.test.js',
      use: {
        // Electron-specific settings will be configured in test setup
      }
    }
  ],

  // Output folder for test artifacts
  outputDir: 'test-results',

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  snapshotDir: 'tests/e2e/snapshots'
})
