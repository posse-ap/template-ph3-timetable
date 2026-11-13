import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 画面（localhost:5173）から /api などへのリクエストを、Laravel（localhost:8080）へ流す。
    // 画面と API が同じオリジンに見えるので、fetch("/api/courses") のように URL の頭を書かずに呼べる
    proxy: {
      '/api': 'http://localhost:8080',
      // ここから下の3つは W9（ログイン）で使う
      '/sanctum': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
    },
  },
})
