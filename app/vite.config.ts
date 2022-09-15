import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
    port: Number(process.env.PORT) || 8000,
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      exclude: ['@aeternity/rock-paper-scissors'],
      include: [],
    },
  },
  optimizeDeps: {
    include: ['@aeternity/rock-paper-scissors'],
  },
});
