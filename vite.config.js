import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/indy-locator-web/', // <--- THIS FIXES THE 404 ERRORS
  server: {
    host: '127.0.0.1', 
    port: 0, 
    open: true
  },
  build: {
    outDir: 'dist',
  }
});
