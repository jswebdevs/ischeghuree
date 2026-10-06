"use client";

import { useState } from "react";
import { X, Plus, ArrowUp, ArrowDown, Trash2, ImagePlus } from "lucide-react";
import MediaManager, { type MediaItem } from "@/components/dashboard/shared/media/MediaManager";

export interface VariantFormRow {
  /** Client-only key for React lists; rows are saved replace-all, so it is
   *  never sent as the database id. */
  key: string;
  name: string;
  colorHex: string;
  image?: { id: string; thumbUrl?: string; originalUrl: string };
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
  colorHex: "",
  image: undefined,
  priceMin: "",
  priceMax: "",
  isAvailable: true,
});

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const inputClass =
  "w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1";

// Variation swatches: each row is one option (a colour, pattern or size) the
// customer can pick on the product page. A swatch shows its colour when one is
// set, otherwise its photo. Price is optional — blank uses the product's own.
export default function VariantsPart({ product, update }: VariantsPartProps) {
  // Key of the row whose image picker is open.
  const [pickerFor, setPickerFor] = useState<string | null>(null);
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

  const handleImageSelect = (media: MediaItem | MediaItem[]) => {
    const picked = Array.isArray(media) ? media[0] : media;
    if (picked && pickerFor) {
      patchRow(pickerFor, {
        image: { id: picked.id, thumbUrl: picked.thumbUrl, originalUrl: picked.originalUrl ?? "" },
      });
    }
    setPickerFor(null);
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
                      onClick={() => setPickerFor(row.key)}
                      title="Choose variant photo"
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
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Name *</label>
                        <input
                          value={row.name}
                          onChange={(e) => patchRow(row.key, { name: e.target.value })}
                          placeholder="লাল — Red"
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
                          Remove photo
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

      {pickerFor && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Select Variation Photo</h3>
              <button type="button" onClick={() => setPickerFor(null)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-hidden bg-background"><MediaManager isPicker multiple={false} onSelect={handleImageSelect} /></div>
          </div>
        </div>
      )}
    </>
  );
}
