// Shared shape of a category record as returned by the admin /categories API
// and consumed by the dashboard category components.

export interface AdminCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
  featuredImageId?: string | null;
  featuredImage?: { thumbUrl?: string; originalUrl?: string } | null;
  _count?: { products?: number };
  createdAt?: string;
  updatedAt?: string;
}
