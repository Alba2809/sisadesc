import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, 'src/context'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@images-login': path.resolve(__dirname, 'src/assets/login'),
      '@images-logos': path.resolve(__dirname, 'src/assets/logos'),
      '@images-icons': path.resolve(__dirname, 'src/assets/icons'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      // Añade más alias según tus necesidades
    },
  },
})
