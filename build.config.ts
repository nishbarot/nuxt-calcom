import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // Generates .d.ts declaration files
  declaration: true,

  // Defines the build entries
  entries: [
    // The main module file
    'src/module',

    // This is the crucial part you need to add.
    // It tells unbuild to take everything in `src/runtime`,
    // process it, and output it to `dist/runtime`.
    {
      builder: 'mkdist',
      input: './src/runtime/',
      outDir: './dist/runtime',
    },
  ],

  // Common externals for Nuxt modules
  externals: [
    'nuxt',
    '@nuxt/kit',
    '@nuxt/schema',
    // Add any other dependencies that shouldn't be bundled
  ],

  rollup: {
    // Emits CommonJS output for compatibility
    emitCJS: true,
  },
})
