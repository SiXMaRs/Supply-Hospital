import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // คุณสามารถเปลี่ยน port ตรงนี้ได้ตามใจชอบ
    host: true, // เพื่อให้เครื่องอื่นในวง LAN เข้าดูหน้าเว็บผ่าน IP เครื่องคุณได้
  }
})