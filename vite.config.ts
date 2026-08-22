import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { manifest } from './manifest.ts';
import pack from './package.json' with { type: 'json' };

const homepage = pack.homepage?.trim();

// Local development against sibling checkouts of shlink-web-component / shlink-frontend-kit.
// Enabled automatically when the sibling directories exist; disable with LOCAL_LIBS=false.
const webComponentSrc = process.env.WEB_COMPONENT_SRC ?? resolve(import.meta.dirname, '../shlink-web-component/src');
const frontendKitSrc = process.env.FRONTEND_KIT_SRC ?? resolve(import.meta.dirname, '../shlink-frontend-kit/src');
const useLocalLibs = process.env.LOCAL_LIBS !== 'false' && existsSync(webComponentSrc);

const localLibsAlias = useLocalLibs
  ? [
      // Sub-path entries must be declared before the main entry
      { find: '@shlinkio/shlink-web-component/settings', replacement: resolve(webComponentSrc, 'settings') },
      { find: '@shlinkio/shlink-web-component/api-contract', replacement: resolve(webComponentSrc, 'api-contract') },
      { find: '@shlinkio/shlink-web-component/tailwind.preset.css', replacement: resolve(webComponentSrc, 'tailwind.preset.css') },
      { find: '@shlinkio/shlink-web-component', replacement: webComponentSrc },
      ...(existsSync(frontendKitSrc)
        ? [
            { find: '@shlinkio/shlink-frontend-kit/tailwind.preset.css', replacement: resolve(frontendKitSrc, 'tailwind.preset.css') },
            { find: '@shlinkio/shlink-frontend-kit', replacement: frontendKitSrc },
          ]
        : []),
    ]
  : [];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
      strategies: 'injectManifest',
      srcDir: './src',
      filename: 'service-worker.ts',
      injectRegister: false,
      manifestFilename: 'manifest.json',
      manifest,
    }),
  ],

  build: {
    outDir: 'build',
  },

  resolve: {
    alias: localLibsAlias,
    // Prevent duplicated React/redux/i18next instances when aliasing library sources
    dedupe: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit', 'react-router', 'i18next'],
  },

  server: {
    port: 3000,
    proxy: {
      // Lets the local UI exercise a remote Shlink instance without weakening its production CORS policy.
      '/rest': {
        target: process.env.VITE_SHLINK_PROXY_TARGET ?? 'https://quarks.click',
        changeOrigin: true,
      },
    },
    watch: {
      // Do not watch test files or generated files, avoiding the dev server to constantly reload when not needed
      ignored: ['**/.idea/**', '**/.git/**', '**/build/**', '**/coverage/**', '**/test/**'],
    },
  },

  base: !homepage ? undefined : homepage, // Not using just homepage because empty string should be discarded

  // Vitest config
  test: {
    globals: true,
    clearMocks: true,
    env: {
      ...process.env,
      VITE_DEFAULT_LANGUAGE: 'en',
    },

    // Run tests in an actual browser
    browser: {
      provider: playwright({
        // In CI, this instructs playwright to use a pre-existing Chrome instance
        launchOptions: process.env.CI ? { channel: 'chrome' } : undefined,
      }),
      enabled: true,
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'clover'],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/*.{ts,tsx}',
        '!src/reducers/index.ts',
        '!src/**/provideServices.ts',
        '!src/container/*.ts',
        '!src/utils/helpers/sw.ts',
      ],

      // Required code coverage. Lower than this will make the check fail
      thresholds: {
        statements: 95,
        branches: 89, // FIXME Increase to 95 again. It dropped after updating to vitest 4
        functions: 93,
        lines: 95,
      },
    },

    // Silent warnings triggered by reactstrap components, as it's getting removed
    onConsoleLog: (log) => !log.includes('`transition.timeout` is marked as required'),
  },
});
