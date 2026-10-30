import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: { host: true, port: 5173 },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 拆分第三方库：游戏 chunk 与框架 chunk 分离，利用长缓存
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'vendor-three'
          if (id.includes('/vue/') || id.includes('@vue')) return 'vendor-vue'
        }
      }
    }
  }
})
