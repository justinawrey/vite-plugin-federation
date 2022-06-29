import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '../../../lib/src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote',
      exposes: {
        './HelloWorld.vue': './src/components/HelloWorld.vue',
      },
      shared: ['vue'],
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
  }
})
