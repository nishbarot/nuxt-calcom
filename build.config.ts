import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/module',
    {
      builder: 'mkdist',
      input: 'src/runtime',
      outDir: 'dist/runtime',
    },
  ],
  externals: ['nuxt', '@nuxt/kit', '@nuxt/schema'],
  rollup: {
    emitCJS: true,
  },
})
