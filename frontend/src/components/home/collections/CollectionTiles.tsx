import Image from "next/image";
import Link from "next/link";
import IconRenderer from "@/components/shared/IconRenderer";
import { getCategoriesFlat } from "@/lib/getSettings";

interface TileCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parentId?: string | null;
  featuredImage?: { originalUrl?: string; thumbUrl?: string } | null;
  _count?: { products?: number };
}

interface CollectionTilesProps {
  /** Pass a pre-fetched list (e.g. subcategories) instead of loading top-level ones. */
  categories?: TileCategory[];
  title?: string | null;
  subtitle?: string | null;
  /** Hide categories that currently have no products. Off for the /categories index. */
  onlyWithProducts?: boolean;
  limit?: number;
}

// Image-led category tiles. Falls back to the category's icon when no
// featuredImage is set, so a freshly created category still looks deliberate
// rather than broken.
export default async function CollectionTiles({
  categories,
  title = "ক্যাটাগরি — Shop by collection",
  subtitle = null,
  onlyWithProducts = true,
  limit,
}: CollectionTilesProps) {
  let list: TileCategory[] = categories ?? (await getCategoriesFlat());

  if (!categories) {
    list = list.filter((c) => !c.parentId);
  }
  if (onlyWithProducts) {
    list = list.filter((c) => (c._count?.products ?? 0) > 0);
  }
  if (limit) {
    list = list.slice(0, limit);
  }

  if (!list.length) return null;

  return (
    <section className="py-12 md:py-16" aria-labelledby="collection-tiles-heading">
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-8 text-center">
            <h2
              id="collection-tiles-heading"
              className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-heading tracking-tight"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-sm md:text-base text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {list.map((cat) => {
            const img = cat.featuredImage?.originalUrl || cat.featuredImage?.thumbUrl;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted/20 hover:border-primary/50 transition-colors"
              >
                {img ? (
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                    <IconRenderer
                      name={cat.icon}
                      className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                )}

                {/* Scrim keeps the label legible over any photograph. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                  <h3 className="font-heading text-sm md:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow">
                    {cat.name}
                  </h3>
                  {(cat._count?.products ?? 0) > 0 && (
                    <span className="mt-0.5 block text-[9px] font-bold text-white/75 uppercase tracking-widest">
                      {cat._count?.products} পণ্য — items
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
