import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://docs.astro.build/reference/configuration-reference/
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  prefetch: true,
  output: 'static'
});
