import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    esbuild: {
      minify: true,
    },
    minify:true,
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'validaccess',
      fileName: (format) => `validaccess.${format}.js`,
    },    
  }
});