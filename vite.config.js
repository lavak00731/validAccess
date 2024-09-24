import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    esbuild: {
      minify: true,
    },
  },
  server: {
    open: 'index.html',
  },
});