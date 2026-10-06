"use client";

import { useState } from "react";
import { X, Plus, ArrowUp, ArrowDown, Trash2, ImagePlus } from "lucide-react";
import MediaManager, { type MediaItem } from "@/components/dashboard/shared/media/MediaManager";

type FormMedia = { id: string; thumbUrl?: string; originalUrl: string };

export interface VariantFormRow {
  /** React list key. Equals the database id for saved rows. */
  key: string;
  /** Database id of a saved variation; absent for rows added in this session. */
  id?: string;
  name: string;
  productCode: string;
  colorHex: string;
  image?: FormMedia;
  gallery: FormMedia[];
  material: string;
  shortDesc: string;
  priceMin: number | string | null;
  priceMax: number | string | null;
  isAvailable: boolean;
}

interface VariantsPartProps {
  product: {
    variantLabel: string;
    variants: VariantFormRow[];
  };
  update: (fields: Partial<VariantsPartProps["product"]>) => void;
}

export const newVariantRow = (): VariantFormRow => ({
  key: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()),
  name: "",
  productCode: "",
  colorHex: "",
  image: undefined,
  gallery: [],
  material: "",
  shortDesc: "",
  priceMin: "",
  priceMax: "",
  isAvailable: true,
});

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const inputClass =
  "w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1";

// Variation swatches: each row is one option (a colour, pattern or size) the
// customer can pick on the product page, with its own code, photos, price,
// material, description and stock. A swatch shows its colour when one is
// set, otherwise its main photo. Blank fields fall back to the product's own.
export default function VariantsPart({ product, update }: VariantsPartProps) {
  // Row + slot whose media picker is open.
  const [picker, setPicker] = useState<{ key: string; slot: "main" | "gallery" } | null>(null);
  const rows = product.variants;

  const setRows = (next: VariantFormRow[]) => update({ variants: next });
  const patchRow = (key: string, fields: Partial<VariantFormRow>) =>
    setRows(rows.map((r) => (r.key === key ? { ...r, ...fields } : r)));
  const removeRow = (key: string) => setRows(rows.filter((r) => r.key !== key));
  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  };

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    const picked = (Array.isArray(media) ? media : [media]).map((m) => ({
      id: m.id,
      thumbUrl: m.thumbUrl,
      originalUrl: m.originalUrl ?? "",
    }));
    if (picker && picked.length > 0) {
      const row = rows.find((r) => r.key === picker.key);
      if (row && picker.slot === "main") patchRow(row.key, { image: picked[0] });
      if (row && picker.slot === "gallery") {
        const have = new Set(row.gallery.map((g) => g.id));
        patchRow(row.key, { gallery: [...row.gallery, ...picked.filter((g) => !have.has(g.id))] });
      }
    }
    setPicker(null);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-wider">
              Variations / Swatches
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              রং বা ডিজাইনের অপশন — Colour or design options shown as swatches on the product page.
              Leave empty if the product has none.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="variant-label">Option name</label>
            <input
              id="variant-label"
              value={product.variantLabel}
              onChange={(e) => update({ variantLabel: e.target.value })}
              placeholder="রং — Color"
              className={inputClass}
            />
          </div>

          <div className="space-y-4">
            {rows.map((row, i) => {
              const validHex = HEX_COLOR.test(row.colorHex);
              return (
                <div key={row.key} className="border border-border rounded-2xl p-4 space-y-4 bg-muted/20">
                  <div className="flex items-start gap-4">
                    {/* Swatch preview + image picker */}
                    <button
                      type="button"
                      onClick={() => setPicker({ key: row.key, slot: "main" })}
                      title="Choose variation's main photo"
                      className="relative w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-border overflow-hidden flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-background"
                    >
                      {row.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- CDN media thumbnail with unknown dimensions
                        <img src={row.image.thumbUrl || row.image.originalUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="w-6 h-6" />
                      )}
                      {validHex && (
                        <span
                          className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow"
                          style={{ backgroundColor: row.colorHex }}
                        />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Name *</label>
                        <input
                          value={row.name}
                          onChange={(e) => patchRow(row.key, { name: e.target.value })}
                          placeholder="লাল — Red"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Product code</label>
                        <input
                          value={row.productCode}
                          onChange={(e) => patchRow(row.key, { productCode: e.target.value })}
                          placeholder="HAIR-002-RED"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Swatch colour</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={validHex && row.colorHex.length === 7 ? row.colorHex : "#000000"}
                            onChange={(e) => patchRow(row.key, { colorHex: e.target.value })}
                            aria-label="Pick swatch colour"
                            className="w-10 h-9 shrink-0 rounded-lg border border-border bg-transparent cursor-pointer"
                          />
                          <input
                            value={row.colorHex}
                            onChange={(e) => patchRow(row.key, { colorHex: e.target.value.trim() })}
                            placeholder="#c0392b (blank = use photo)"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelClass}>Price min</label>
                          <input
                            type="number"
                            min={0}
                            value={row.priceMin ?? ""}
                            onChange={(e) => patchRow(row.key, { priceMin: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Price max</label>
                          <input
                            type="number"
                            min={0}
                            value={row.priceMax ?? ""}
                            onChange={(e) => patchRow(row.key, { priceMax: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Material</label>
                      <input
                        value={row.material}
                        onChange={(e) => patchRow(row.key, { material: e.target.value })}
                        placeholder="Blank = product's material"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:row-span-2">
                      <label className={labelClass}>Short description</label>
                      <textarea
                        value={row.shortDesc}
                        onChange={(e) => patchRow(row.key, { shortDesc: e.target.value })}
                        placeholder="Blank = product's description"
                        rows={3}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Gallery photos</label>
                      <div className="flex flex-wrap gap-2">
                        {row.gallery.map((img) => (
                          <div key={img.id} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border group">
                            {/* eslint-disable-next-line @next/next/no-img-element -- CDN media thumbnail with unknown dimensions */}
                            <img src={img.thumbUrl || img.originalUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => patchRow(row.key, { gallery: row.gallery.filter((g) => g.id !== img.id) })}
                              aria-label="Remove gallery photo"
                              className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setPicker({ key: row.key, slot: "gallery" })}
                          aria-label="Add gallery photos"
                          className="w-12 h-12 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={row.isAvailable}
                        onChange={(e) => patchRow(row.key, { isAvailable: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                      />
                      Available
                    </label>
                    <div className="flex items-center gap-1">
                      {row.image && (
                        <button
                          type="button"
                          onClick={() => patchRow(row.key, { image: undefined })}
                          className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground hover:text-destructive"
                        >
                          Remove main photo
                        </button>
                      )}
                      <button type="button" onClick={() => moveRow(i, -1)} disabled={i === 0} aria-label="Move up" className="p-2 rounded-lg hover:bg-muted disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => moveRow(i, 1)} disabled={i === rows.length - 1} aria-label="Move down" className="p-2 rounded-lg hover:bg-muted disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => removeRow(row.key)} aria-label="Remove variation" className="p-2 rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setRows([...rows, newVariantRow()])}
              className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add variation
            </button>
          </div>
        </div>
      </div>

      {picker && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">
                {picker.slot === "main" ? "Select Variation Photo" : "Add Variation Gallery Photos"}
              </h3>
              <button type="button" onClick={() => setPicker(null)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-hidden bg-background"><MediaManager isPicker multiple={picker.slot === "gallery"} onSelect={handleMediaSelect} /></div>
          </div>
        </div>
      )}
    </>
  );
}
