// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL и BASE_PATH задаются при сборке для предпросмотра на GitHub Pages
// (там сайт живёт в подпапке). Для своего домена они не нужны.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
});
