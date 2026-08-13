// Shared shape of the storefront page object returned by getPageBySlug()
// (backend Page model) as consumed by the template components.

export interface PageContentBlock {
    type: string;
    data: {
        content?: string;
        [key: string]: unknown;
    };
}

export interface ContactPageConfig {
    email?: string;
    whatsapp?: string;
    location?: string;
    responseTime?: string;
}

export interface PageData {
    title: string;
    content: PageContentBlock[];
    updatedAt: string;
    featuredImage?: string | null;
    pageConfig?: ContactPageConfig | null;
    [key: string]: unknown;
}
