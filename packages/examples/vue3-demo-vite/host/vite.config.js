import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host',
      remotes: {
        remote: 'http://localhost:3001/remoteEntry.js',
      },
      shared: ['vue'],
    }),
  ],

  build: {
    target: 'esnext',
    minify: false,
  },
})
