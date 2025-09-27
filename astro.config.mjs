import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://docs.astro.build/reference/configuration-reference/
export default defineConfig({
  adapter: vercel({
    runtime: 'nodejs20.x'
  }),
  integrations: [tailwind({ applyBaseStyles: false })],
  prefetch: true,
  output: 'server'
});
