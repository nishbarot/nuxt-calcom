import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    // Enable TypeScript support
    typescript: true,
    // Enable stylistic rules for consistent formatting
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false
    }
  },
  dirs: {
    src: ['./runtime', './src']
  }
}).append(
  // Global ignores
  {
    ignores: [
      'dist/**',
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'coverage/**',
      'playground/.nuxt/**',
      'artifacts/**',
      'docs/**',
      'temp/**',
      // Added from .eslintignore
      '*.d.ts',
      'playground/dist/**',
      'playwright-report/**',
      'test-results/**',
      '.vscode/**',
      '.idea/**'
    ]
  },
  // Custom rules for the project
  {
    rules: {
      // Vue specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',

      // TypeScript rules - make them warnings for development
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // General rules - allow console in development
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-useless-escape': 'warn',
      'no-async-promise-executor': 'warn'
    }
  },
  // Test files configuration
  {
    files: ['tests/**/*.ts', 'tests/**/*.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off'
    }
  },
  // Playground files configuration
  {
    files: ['playground/**/*'],
    rules: {
      'no-console': 'off'
    }
  }
)
