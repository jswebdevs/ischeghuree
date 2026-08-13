import { MetadataRoute } from 'next';
import { getGlobalSettings } from '@/lib/getSettings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getGlobalSettings();

  const storeName = settings?.storeName || 'ইচ্ছে ঘুড়ি — Ische Ghuree';
  const description = settings?.tagline || 'আভিজাত্যের ছোঁয়া… A touch of elegance…';
  const faviconUrl = settings?.favicon?.originalUrl || '/ische-ghuree.svg';
  const isSvg = faviconUrl.toLowerCase().endsWith('.svg');

  return {
    name: storeName,
    short_name: 'ইচ্ছে ঘুড়ি',
    description: description,
    start_url: '/',
    display: 'standalone',
    // Brand palette (DESIGN.md §1): deep night blue bg, kite-sky blue accent.
    background_color: '#0d1b2a',
    theme_color: '#1476b8',
    icons: [
      {
        src: faviconUrl,
        sizes: 'any',
        ...(isSvg ? { type: 'image/svg+xml' } : {}),
      },
    ],
  };
}
