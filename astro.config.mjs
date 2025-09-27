import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/edge';

// https://docs.astro.build/reference/configuration-reference/
export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false })],
  prefetch: true,
  output: 'server'
});
