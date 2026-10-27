import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/panel5/' : '/',
  plugins: [react()],
  publicDir: 'web/public',
  server: { port: 5173 },
});
