const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "e2e",          // ← remove the "./"
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npx vite --port 5173",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 30000,
  },
});