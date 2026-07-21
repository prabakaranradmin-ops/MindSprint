const { defineConfig } = require('@playwright/test');

/* Set LIVE_URL to run the same suite against a deployed site instead of the
   local dev server — e.g. LIVE_URL=https://prabakaranradmin-ops.github.io/MindSprint
   npm test. No webServer is started in that mode (nothing to boot locally),
   and there's no path suffix assumed, so LIVE_URL must point at the folder
   that actually serves app.html as index.html (the Pages deploy does this —
   see .github/workflows/ci.yml's "cp app.html _site/index.html"). */
const liveUrl = process.env.LIVE_URL;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 150000,
  expect: { timeout: 20000 },
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: liveUrl || 'http://localhost:4173',
    screenshot: 'on',
    viewport: { width: 1200, height: 820 },
  },
  ...(liveUrl ? {} : {
    webServer: {
      command: 'node serve.cjs',
      port: 4173,
      reuseExistingServer: true,
      timeout: 30000,
    },
  }),
});
