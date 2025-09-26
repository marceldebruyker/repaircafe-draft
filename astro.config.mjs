import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const sanitizeUrl = (url) => {
  if (!url) return undefined;
  try {
    const normalized = new URL(url, 'https://dummy-base.local');
    return normalized.origin === 'https://dummy-base.local'
      ? normalized.pathname.replace(/\/$/, '')
      : normalized.origin.replace(/\/$/, '') + normalized.pathname.replace(/\/$/, '');
  } catch (error) {
    console.warn('Invalid SANITY_STUDIO_URL provided. Falling back to default /admin redirect.');
    return undefined;
  }
};

const studioBaseUrl = sanitizeUrl(process.env.SANITY_STUDIO_URL) || 'https://repaircafe-studio.vercel.app';

// https://docs.astro.build/reference/configuration-reference/
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  prefetch: true,
  output: 'static',
  redirects: [
    {
      source: '/admin',
      destination: studioBaseUrl,
      status: 307
    },
    {
      source: '/admin/(.*)',
      destination: `${studioBaseUrl}/$1`,
      status: 307
    }
  ]
});
