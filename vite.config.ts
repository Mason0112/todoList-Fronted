import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✨ 在這裡加入 define 設定
  define: {
    // 這個設定會在打包時，自動將程式碼中所有 'global' 的地方靜態替換成 'window'
    // 這是從根本上解決 'global is not defined' 錯誤最可靠的方法
    global: 'window',
  },
})