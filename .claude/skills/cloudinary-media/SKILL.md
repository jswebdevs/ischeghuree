---
name: cloudinary-media
description: "Media upload pipeline for backend (multer + sharp + ffmpeg + Cloudinary). Use when adding new upload endpoints, changing how images/videos are stored, or wiring a media field on a model. Encodes the WebP/WebM auto-conversion, Cloudinary streaming, and Media table linkage."
trigger: media upload
---

# Cloudinary Media Pipeline (backend)

All file uploads (product images, hero banners, avatars, blog featured images, etc.) flow through one pipeline: **multer (memory) → sharp/ffmpeg (transcode) → Cloudinary (CDN) → `Media` table (metadata)**.

## Where things live

- Cloudinary client: [src/config/cloudinary.ts](../../../backend/src/config/cloudinary.ts)
- Multer config (memoryStorage): [src/config/upload.ts](../../../backend/src/config/upload.ts)
- Pipeline implementation: [src/controllers/media.controller.ts](../../../backend/src/controllers/media.controller.ts)
- Schema: `Media` model in [prisma/schema.prisma](../../../backend/prisma/schema.prisma)

Required env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## How uploads work (in order)

1. Route uses `upload.single('file')` or `upload.array('files')` from `config/upload.ts` (multer memory storage — no disk writes).
2. `convertToWebP` runs on any non-WebP image via `sharp` (quality 85). Original mimetype/extension are rewritten.
3. `convertToWebM` runs on any non-WebM video via `fluent-ffmpeg` using the bundled static binary (`ffmpeg-static`). Uses temp files in `os.tmpdir()` because ffmpeg can't stream from a Buffer.
4. Buffer is streamed to Cloudinary with `streamifier.createReadStream(buffer).pipe(cloudinary.uploader.upload_stream(...))`.
5. A row is inserted into `Media` (`originalUrl`, `thumbUrl`, `mimetype`, `size`, `folder`, `uploadedById`).
6. Other models reference media by FK (e.g. `Product.featuredImageId`) — uploads return the `Media.id` for the caller to wire in.

## Adding a new upload endpoint

```ts
// routes
router.post('/avatars', protect, upload.single('file'), uploadAvatar);

// controller
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';
import sharp from 'sharp';

export const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });

  const buffer = req.file.mimetype.startsWith('image/') && req.file.mimetype !== 'image/webp'
    ? await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer()
    : req.file.buffer;

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars', resource_type: 'auto' },
      (err, res) => (err ? reject(err) : resolve(res)),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

  const media = await prisma.media.create({
    data: {
      filename: req.file.originalname,
      originalUrl: result.secure_url,
      thumbUrl: result.secure_url,
      mimetype: 'image/webp',
      size: buffer.length,
      uploadedById: req.user.id,
    },
  });

  res.json({ success: true, data: media });
};
```

## Gotchas

- **Memory storage** means buffers live in RAM. Multer's default field-size limit (`limits` in `config/upload.ts`) protects the process from OOM — don't raise it past ~25MB without a reason.
- **Video conversion is slow** (libvpx-vp9 is heavy) and synchronous from the controller's perspective. For UX, surface a "processing…" state on the client; consider moving to a background queue if uploads grow.
- **Always set `resource_type: 'auto'`** on Cloudinary — otherwise videos get treated as images and the upload silently truncates.
- **Don't disconnect a Media row** if a Product still references it — Prisma will error. Use `featuredImage: { disconnect: true }` on the Product update first, then optionally delete the Media row separately.
- **Cleanup**: deleting a `Product` does NOT delete its `Media` rows or the underlying Cloudinary asset. If the user wants true cleanup, add explicit `cloudinary.uploader.destroy(public_id)` calls.
