import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://backend:3001', //для того чтобы запустить локально заменить на http://localhost:3001
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
