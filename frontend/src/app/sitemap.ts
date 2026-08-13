import { MetadataRoute } from 'next';

const BASE_URL =
    process.env['NEXT_PUBLIC_CLIENT_URL']?.replace(/\/$/, '') ||
    'https://ischeghuree.com';

const API_URL = process.env['NEXT_PUBLIC_API_URL'];

// Static pages we always advertise. Every entry maps to a real route
// under src/app/.
const staticRoutes = [
    '',
    '/shop',
    '/categories',
    '/about-us',
    '/contact-us',
    '/faq',
    '/order-now',
    '/privacy-policy',
    '/terms-of-service',
    '/return-refund-policy',
    '/exchange-policy',
    '/shipping-policy',
    '/cancellation-policy',
];

// Pull dynamic resources from the API. Each helper swallows errors so a
// flaky upstream still produces a usable sitemap from the static list.
async function fetchSlugs(path: string): Promise<{ slug: string; updatedAt?: string }[]> {
    if (!API_URL) return [];
    try {
        const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 600 } });
        if (!res.ok) return [];
        const json = await res.json();
        const list = json.data || json.products || json.categories || [];
        return Array.isArray(list)
            ? (list as { slug?: string; updatedAt?: string }[])
                .filter((x) => x?.slug)
                .map((x) => ({ slug: x.slug as string, updatedAt: x.updatedAt }))
            : [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories] = await Promise.all([
        fetchSlugs('/products?limit=500&page=1'),
        fetchSlugs('/categories'),
    ]);

    const now = new Date();

    const fixed: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.7,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
        url: `${BASE_URL}/categories/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...fixed, ...productEntries, ...categoryEntries];
}
