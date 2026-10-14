import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { testConfig } from './testConfig';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
const ENV = (process.env.ENV || 'qa') as 'qa' | 'dev' | 'sit';

if (!ENV || ![`qa`, `dev`, `sit`].includes(ENV)) {
  console.log(`Please set the ENV variable to either qa, dev or sit`);
  process.exit();
}

// $env:ENV="dev";npm run test-dxp-ui
// $env:ENV="qa";npm run test-dxp-ui

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  outputDir: 'playwright-artifacts', // Change the default output directory for all artifacts
  globalSetup: './src/utils/globalCookieSetup.ts',
  globalTimeout: undefined,
  timeout: 180_000,
  expect: {
    timeout: 180000,
  },
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: testConfig[ENV].dxpui,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    video: {
      mode: process.env.CI ? 'retain-on-failure' : 'on',
      size: { width: 1280, height: 720 },
    },
    headless: process.env.CI ? true : false,
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    launchOptions: {
      slowMo: process.env.CI ? 0 : 500,
      //args: ['--start-maximized'],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth-setup',
      testMatch: 'ui-auth-setup.ts',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 }
      },
      testDir: './src/utils/',
    },
    {
      name: 'auth-setup-upg',
      testMatch: 'ui-auth-setup.ts',
      grep: /Authenticate as UPG Account User/,
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 }
      },
      testDir: './src/utils/',
    },
    {
      name: 'auth-setup-axp',
      testMatch: 'axp-auth-setup.ts',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
        baseURL: testConfig[ENV].axp,
      },
      testDir: './src/utils/',
    },
    {
      name: 'auth-setup-sit',
      testMatch: 'ui-auth-setup-sit.ts',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
        baseURL: testConfig['sit'].dxpui,
      },
      testDir: './src/utils/',
    },
    {
      name: 'api-auth-setup',
      testMatch: 'api-auth-setup.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      testDir: './src/utils/',
    },
    {
      name: 'featureApiAuthSetup',
      testMatch: 'feature-api-auth-setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testDir: './src/utils/',
    },
    {
      name: 'featureIamDevicePoolSetup',
      testMatch: 'iamDevice/iamDevicePoolSetup.ts',
      dependencies: ['featureApiAuthSetup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testDir: './src/utils/',
    },
    {
      name: 'featureIamDevicePoolTeardown',
      testMatch: 'iamDevice/iamDevicePoolTeardown.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testDir: './src/utils/',
    },
    {
      name: 'featureTests',
      testDir: './src/tests/',
      testMatch: ['device/**/*.spec.ts', 'customer/**/*.spec.ts', 'user/**/*.spec.ts'],
      dependencies: ['featureApiAuthSetup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'uiTests',
      testDir: './src/tests/',
      // Keep customer-initiated spec in its own project to avoid duplicate execution.
      testIgnore: [
        'sideSheet.spec.ts',
        'device/**/*.spec.ts',
        'customer/**/*.spec.ts',
        'user/**/*.spec.ts',
        'amendmentCustomerInitiated.spec.ts',
      ],
      testMatch: '**/*.spec.ts',
      // Exclude DevSanity-only tests, but keep any test explicitly tagged for daily sanity.
      grepInvert: /^(?=.*@DevSanityTests)(?!.*@dailysanity).*$/,
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'dataPackTests',
      testDir: './src/data-pack/',
      testMatch: '*.spec.ts',
      dependencies: ['auth-setup-upg'],
      grepInvert: /@no-auth-setup/,
      testIgnore: ['errorHoldContracts.spec.ts'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
      retries: process.env.CI ? 0 : 0,
    },
    {
      name: 'dataPackTests-noAuthSetup',
      testDir: './src/data-pack/',
      testMatch: '*.spec.ts',
      grep: /@no-auth-setup/,
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
      retries: process.env.CI ? 0 : 0,
    },
    {
      name: 'devTests',
      testDir: './src/tests/',
      grep: /@DevSanityTests/,
      testMatch: '*.spec.ts',
      dependencies: ['auth-setup-upg'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'auth-setup-sf',
      testMatch: 'sf-auth-setup.ts',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
        baseURL: testConfig[ENV].salesforce,
      },
      testDir: './src/utils/',
    },
    {
      name: 'salesforce',
      testDir: './src/salesforce/',
      testMatch: '*.spec.ts',
      // dependencies: ['auth-setup-sf'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 900 },
        baseURL: testConfig[ENV].salesforce,
        headless: true,
      },
    },
    {
      name: 'sitTests',
      testDir: './src/sit_uat/',
      testMatch: '*.spec.ts',
      grep: /@sit-sanity/,
      dependencies: ['auth-setup-sit'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
        baseURL: testConfig['sit'].dxpui,
      },
    },
    {
      name: 'customerInitiatedAmendments',
      testDir: './src/tests/',
      testMatch: 'amendmentCustomerInitiated.spec.ts',
      dependencies: ['auth-setup', 'auth-setup-axp'],
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    }

    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'], channel: 'chrome',
    //     // viewport: { width: 1280, height: 551 },
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});