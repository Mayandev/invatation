import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        invitation: resolve(import.meta.dirname, 'index.html'),
        guide: resolve(import.meta.dirname, 'guide.html')
      }
    }
  }
});
