"use client";

export interface StoreVariant {
  id: string;
  name: string;
  productCode?: string | null;
  colorHex?: string | null;
  image?: { id: string; originalUrl: string; thumbUrl?: string | null } | null;
  images?: { id: string; originalUrl: string; thumbUrl?: string | null }[] | null;
  material?: string | null;
  shortDesc?: string | null;
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  isAvailable?: boolean;
}

interface VariantSwatchesProps {
  label?: string | null;
  variants: StoreVariant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

// Round swatches for a product's options. A swatch is its colour when one is
// set, otherwise the option's photo, otherwise its initial. Clicking the
// selected swatch again clears the choice. Unavailable options stay visible
// (struck through) so customers know they exist, but can't be picked.
export default function VariantSwatches({ label, variants, selectedId, onSelect }: VariantSwatchesProps) {
  if (!variants.length) return null;
  const selected = variants.find((v) => v.id === selectedId);
  const groupLabel = label || "অপশন — Options";

  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-foreground mb-3">
        {groupLabel}
        {selected && <span className="font-normal text-muted-foreground">: {selected.name}</span>}
      </p>
      <div role="radiogroup" aria-label={groupLabel} className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          const available = v.isAvailable !== false;
          const thumb = v.image?.thumbUrl || v.image?.originalUrl;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={available ? v.name : `${v.name} — স্টকে নেই / unavailable`}
              title={available ? v.name : `${v.name} — unavailable`}
              disabled={!available}
              onClick={() => onSelect(isSelected ? null : v.id)}
              className={`relative w-11 h-11 rounded-full p-0.5 border-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? "border-primary scale-110" : "border-border hover:border-primary/60"
              }`}
            >
              <span
                className="block w-full h-full rounded-full overflow-hidden bg-muted bg-cover bg-center flex items-center justify-center text-xs font-bold text-foreground"
                style={
                  v.colorHex
                    ? { backgroundColor: v.colorHex }
                    : thumb
                      ? { backgroundImage: `url("${thumb}")` }
                      : undefined
                }
              >
                {!v.colorHex && !thumb && v.name.trim().charAt(0)}
              </span>
              {!available && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  <span className="block w-full h-0.5 bg-foreground/70 rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
