import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  root, envDir: path.resolve(root, '..'),
  plugins: [react(), tailwindcss()],
  build: { outDir: path.resolve(root, '../dist-admin'), emptyOutDir: true },
  server: { fs: { allow: [path.resolve(root, '..')] }, hmr: process.env.DISABLE_HMR === 'true' ? false : { port: 24680 } },
});
