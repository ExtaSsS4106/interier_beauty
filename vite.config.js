import { defineConfig } from 'vite';

export default defineConfig({
  root: 'www',
  base: './',
  publicDir: 'vendor',
  build: { outDir: '../dist', emptyOutDir: true },
});