// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://naerix.com',
  server: { host: '127.0.0.1', port: 4322 },
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()], server: { strictPort: true } },
  integrations: [sitemap()],
});
