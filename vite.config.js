import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base path makes the deployment work on both subfolders (like GitHub Pages) and root domains
  base: './',
  build: {
    outDir: 'dist',
  }
});
