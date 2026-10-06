// The slice of a product's variations a product card needs to draw its swatch
// row: enough to paint each swatch and preview its photo, nothing more.
export const variantCardSelect = {
  orderBy: { sortOrder: 'asc' as const },
  select: {
    id: true,
    name: true,
    colorHex: true,
    isAvailable: true,
    image: { select: { originalUrl: true, thumbUrl: true } },
  },
};
