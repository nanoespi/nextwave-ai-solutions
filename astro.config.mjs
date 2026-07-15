// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://nextwaveaisolutions.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});