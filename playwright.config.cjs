const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 150000,
  expect: { timeout: 20000 },
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'on',
    viewport: { width: 1200, height: 820 },
  },
  webServer: {
    command: 'node serve.cjs',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
