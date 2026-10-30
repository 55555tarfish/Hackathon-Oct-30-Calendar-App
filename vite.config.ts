import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Listen on all network addresses (0.0.0.0, localhost, 127.0.0.1)
    open: false
  }
});
