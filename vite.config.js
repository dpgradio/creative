import { defineConfig } from 'vite'

export default defineConfig({
  root: './dev',
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@dpgradio/creative': '../src',
    },
  },
})
