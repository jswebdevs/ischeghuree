"use client";

import { useRef, useState } from "react";
import { Box, Loader2, Trash2, Upload, RotateCw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Frame {
  id: string;
  originalUrl: string;
  sequence: number;
}

interface Model3d {
  id: string;
  originalUrl: string;
}

interface Props {
  productId: string;
  initialModel3d?: Model3d | null;
  initialFrames?: Frame[];
}

// Admin upload form-part for 3D model + 360° turntable frames. Only shows in
// edit mode — uploads happen against an existing product id, not as part of
// the main "save" payload, because each is multipart and goes straight to
// Cloudinary.
export default function ImmersiveMediaPart({ productId, initialModel3d, initialFrames }: Props) {
  const [model3d, setModel3d] = useState<Model3d | null>(initialModel3d ?? null);
  const [frames, setFrames] = useState<Frame[]>(
    (initialFrames ?? []).slice().sort((a, b) => a.sequence - b.sequence)
  );

  const [uploading3d, setUploading3d] = useState(false);
  const [deleting3d, setDeleting3d] = useState(false);
  const [uploading360, setUploading360] = useState(false);
  const [deleting360, setDeleting360] = useState(false);

  const model3dRef = useRef<HTMLInputElement>(null);
  const turntableRef = useRef<HTMLInputElement>(null);

  const upload3d = async (file: File) => {
    setUploading3d(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post(`/products/${productId}/model3d`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModel3d(res.data?.data ?? null);
      toast.success("3D model uploaded");
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "3D upload failed");
    } finally {
      setUploading3d(false);
      if (model3dRef.current) model3dRef.current.value = "";
    }
  };

  const delete3d = async () => {
    if (!model3d) return;
    if (!confirm("Remove the 3D model from this product?")) return;
    setDeleting3d(true);
    try {
      await api.delete(`/products/${productId}/model3d`);
      setModel3d(null);
      toast.success("3D model removed");
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting3d(false);
    }
  };

  const upload360 = async (files: FileList) => {
    const arr = Array.from(files);
    if (arr.length < 8) {
      toast.error("Select at least 8 frames (24–36 recommended).");
      return;
    }
    if (arr.length > 48) {
      toast.error("Maximum 48 frames per turntable.");
      return;
    }
    if (frames.length > 0 && !confirm(`Replace the existing ${frames.length} frames with ${arr.length} new ones?`)) {
      return;
    }

    setUploading360(true);
    try {
      const fd = new FormData();
      // Sort by name so 01.jpg, 02.jpg, … land in the right turntable order.
      arr
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
        .forEach((f) => fd.append("frames", f));

      const res = await api.post(`/products/${productId}/turntable`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const created: Frame[] = res.data?.data ?? [];
      setFrames(created.slice().sort((a, b) => a.sequence - b.sequence));
      toast.success(`Uploaded ${created.length} turntable frames`);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "360° upload failed");
    } finally {
      setUploading360(false);
      if (turntableRef.current) turntableRef.current.value = "";
    }
  };

  const delete360 = async () => {
    if (frames.length === 0) return;
    if (!confirm(`Remove all ${frames.length} turntable frames?`)) return;
    setDeleting360(true);
    try {
      await api.delete(`/products/${productId}/turntable`);
      setFrames([]);
      toast.success("Turntable frames removed");
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting360(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
      <div className="p-4 md:p-8 space-y-8">
        <h2 className="text-xl font-black text-foreground uppercase tracking-wider flex items-center gap-3">
          <Box className="w-5 h-5 text-primary" /> Immersive Media
        </h2>

        {/* ── 3D model ─────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              3D Model (.glb / .gltf)
            </label>
            {model3d && (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                Linked
              </span>
            )}
          </div>

          {model3d ? (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Box className="w-5 h-5 text-primary" />
                <a
                  href={model3d.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  Open .glb in new tab
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => model3dRef.current?.click()}
                  disabled={uploading3d || deleting3d}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-card border border-border hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-40"
                >
                  {uploading3d ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Replace
                </button>
                <button
                  type="button"
                  onClick={delete3d}
                  disabled={uploading3d || deleting3d}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer disabled:opacity-40"
                >
                  {deleting3d ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => model3dRef.current?.click()}
              disabled={uploading3d}
              className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all cursor-pointer disabled:opacity-40"
            >
              {uploading3d ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Box className="w-6 h-6" />
              )}
              <span className="text-xs font-black uppercase tracking-widest">
                {uploading3d ? "Uploading…" : "Upload .glb / .gltf"}
              </span>
              <span className="text-[10px] text-muted-foreground">Up to 30 MB</span>
            </button>
          )}

          <input
            ref={model3dRef}
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload3d(f);
            }}
          />
        </section>

        {/* ── 360° turntable ───────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              360° Turntable Frames
            </label>
            {frames.length > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                {frames.length} frames
              </span>
            )}
          </div>

          {frames.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto rounded-xl border border-border p-2 bg-muted/10">
                {frames.map((f) => (
                  <div
                    key={f.id}
                    className="relative aspect-square rounded-md overflow-hidden bg-muted border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- CDN turntable frame with unknown dimensions */}
                    <img src={f.originalUrl} alt={`frame ${f.sequence}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 text-[8px] font-black bg-black/70 text-white px-1 rounded-tl-md">
                      {f.sequence + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => turntableRef.current?.click()}
                  disabled={uploading360 || deleting360}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-card border border-border hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-40"
                >
                  {uploading360 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Replace All
                </button>
                <button
                  type="button"
                  onClick={delete360}
                  disabled={uploading360 || deleting360}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer disabled:opacity-40"
                >
                  {deleting360 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Remove All
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => turntableRef.current?.click()}
              disabled={uploading360}
              className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all cursor-pointer disabled:opacity-40"
            >
              {uploading360 ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <RotateCw className="w-6 h-6" />
              )}
              <span className="text-xs font-black uppercase tracking-widest">
                {uploading360 ? "Uploading…" : "Upload 24–36 Frames"}
              </span>
              <span className="text-[10px] text-muted-foreground text-center px-2">
                Filenames are sorted naturally (01.jpg, 02.jpg, …) to set turntable order. 8–48 frames, 5 MB each.
              </span>
            </button>
          )}

          <input
            ref={turntableRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const fl = e.target.files;
              if (fl && fl.length > 0) upload360(fl);
            }}
          />
        </section>
      </div>
    </div>
  );
}
