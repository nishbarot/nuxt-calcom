import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'playground/**',
      'tests/integration/**',
      'tests/accessibility/**',
      '**/*.spec.ts',
      '**/node_modules/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'playground/', 'tests/', '**/*.d.ts', '**/*.config.*']
    },
    typecheck: {
      enabled: false
    }
  },
  resolve: {
    alias: {
      '#app': resolve(__dirname, './tests/mocks/nuxt-app.ts'),
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './')
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
})
