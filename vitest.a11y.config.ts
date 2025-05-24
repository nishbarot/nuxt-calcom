import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/accessibility/**/*.test.ts'],
    reporters: ['verbose'],
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
  }
})
