import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
  base: '/FutureArchive/',
  publicDir: isSsrBuild ? false : 'public',
  build: { outDir: 'dist', emptyOutDir: true },
}));
