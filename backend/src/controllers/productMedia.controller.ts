import { Request, Response } from 'express';
import prisma from '../config/prisma';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import sharp from 'sharp';
import { logAction } from './audit.controller';

const FOLDER_3D = 'products/3d';
const FOLDER_360 = 'products/360';

const GLB_MIME_TYPES = new Set([
  'model/gltf-binary',
  'application/octet-stream', // browsers often send .glb as this
  'model/gltf+json',
  'application/json',
]);

const isGlbFile = (file: Express.Multer.File): boolean => {
  const ext = (file.originalname.split('.').pop() || '').toLowerCase();
  if (ext === 'glb' || ext === 'gltf') return true;
  return GLB_MIME_TYPES.has(file.mimetype);
};

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
  resourceType: 'image' | 'raw'
): Promise<any> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

const toWebP = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
  if (file.mimetype === 'image/webp') return file;
  const buf = await sharp(file.buffer).webp({ quality: 85 }).toBuffer();
  return {
    ...file,
    buffer: buf,
    mimetype: 'image/webp',
    originalname: file.originalname.replace(/\.[^/.]+$/, '.webp'),
    size: buf.length,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3D MODEL (.glb) — single file per product
// ─────────────────────────────────────────────────────────────────────────────

export const upload3dModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file provided.' });
      return;
    }
    if (!isGlbFile(file)) {
      res.status(400).json({ success: false, message: 'Only .glb or .gltf files are accepted for 3D models.' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { model3d: true },
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Replace existing 3D model: remove old Cloudinary asset + Media row first.
    if (product.model3d) {
      try {
        if (product.model3d.filename) {
          await cloudinary.uploader.destroy(product.model3d.filename, { resource_type: 'raw' });
        }
      } catch (e) {
        console.warn('Cloudinary destroy old 3D model failed (continuing):', e);
      }
      // Detach product from old model first to free the unique constraint, then delete the Media row.
      await prisma.product.update({ where: { id: productId }, data: { model3dId: null } });
      await prisma.media.delete({ where: { id: product.model3d.id } });
    }

    const result = await uploadToCloudinary(file, FOLDER_3D, 'raw');

    const media = await prisma.media.create({
      data: {
        filename: result.public_id,
        originalUrl: result.secure_url,
        mimetype: file.mimetype || 'model/gltf-binary',
        size: file.size,
        folder: FOLDER_3D,
        title: file.originalname,
        mediaType: 'DOCUMENT', // closest fit; the `kind` discriminator is the source of truth
        kind: 'PRODUCT_3D_MODEL',
        uploadedById: (req as any).user?.id ?? null,
      },
    });

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { model3dId: media.id },
      include: { model3d: true },
    });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPLOAD_PRODUCT_3D_MODEL',
      entity: 'Product',
      entityId: productId,
      details: { mediaId: media.id, size: file.size },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ success: true, data: updated.model3d });
  } catch (error: any) {
    console.error('upload3dModel error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload 3D model', error: error.message });
  }
};

export const delete3dModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { model3d: true },
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    if (!product.model3d) {
      res.json({ success: true, message: 'No 3D model to delete.' });
      return;
    }

    if (product.model3d.filename) {
      try {
        await cloudinary.uploader.destroy(product.model3d.filename, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Cloudinary destroy 3D model failed (continuing):', e);
      }
    }

    await prisma.product.update({ where: { id: productId }, data: { model3dId: null } });
    await prisma.media.delete({ where: { id: product.model3d.id } });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_PRODUCT_3D_MODEL',
      entity: 'Product',
      entityId: productId,
      details: { mediaId: product.model3d.id },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: '3D model removed.' });
  } catch (error: any) {
    console.error('delete3dModel error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete 3D model', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 360° TURNTABLE — ordered image sequence per product
// ─────────────────────────────────────────────────────────────────────────────

export const uploadTurntableFrames = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const files = (req.files as Express.Multer.File[] | undefined) || [];

    if (files.length === 0) {
      res.status(400).json({ success: false, message: 'No frames uploaded.' });
      return;
    }
    if (files.length < 8) {
      res.status(400).json({ success: false, message: 'A 360° turntable needs at least 8 frames (24–36 recommended).' });
      return;
    }
    if (files.some((f) => !f.mimetype.startsWith('image/'))) {
      res.status(400).json({ success: false, message: 'All turntable frames must be images.' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { turntableFrames: true },
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Replace mode: drop existing frames + their Cloudinary assets first.
    if (product.turntableFrames.length > 0) {
      const ids = product.turntableFrames.map((m) => m.id);
      const publicIds = product.turntableFrames.map((m) => m.filename).filter(Boolean) as string[];
      try {
        await Promise.all(publicIds.map((pid) => cloudinary.uploader.destroy(pid, { resource_type: 'image' })));
      } catch (e) {
        console.warn('Cloudinary destroy old 360 frames failed (continuing):', e);
      }
      await prisma.media.deleteMany({ where: { id: { in: ids } } });
    }

    // Files are uploaded in field order — index = sequence.
    const created = await Promise.all(
      files.map(async (file, idx) => {
        const webp = await toWebP(file);
        const result = await uploadToCloudinary(webp, FOLDER_360, 'image');
        return prisma.media.create({
          data: {
            filename: result.public_id,
            originalUrl: result.secure_url,
            thumbUrl: result.secure_url,
            mimetype: webp.mimetype,
            size: webp.size,
            folder: FOLDER_360,
            title: webp.originalname,
            mediaType: 'IMAGE',
            kind: 'PRODUCT_360_FRAME',
            sequence: idx,
            product360ForId: productId,
            uploadedById: (req as any).user?.id ?? null,
          },
        });
      })
    );

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPLOAD_PRODUCT_360_FRAMES',
      entity: 'Product',
      entityId: productId,
      details: { frameCount: created.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    console.error('uploadTurntableFrames error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload 360° frames', error: error.message });
  }
};

export const deleteTurntableFrames = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const frames = await prisma.media.findMany({
      where: { product360ForId: productId, kind: 'PRODUCT_360_FRAME' },
    });
    if (frames.length === 0) {
      res.json({ success: true, message: 'No turntable frames to delete.' });
      return;
    }

    const publicIds = frames.map((m) => m.filename).filter(Boolean) as string[];
    try {
      await Promise.all(publicIds.map((pid) => cloudinary.uploader.destroy(pid, { resource_type: 'image' })));
    } catch (e) {
      console.warn('Cloudinary destroy 360 frames failed (continuing):', e);
    }
    await prisma.media.deleteMany({ where: { id: { in: frames.map((m) => m.id) } } });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_PRODUCT_360_FRAMES',
      entity: 'Product',
      entityId: productId,
      details: { frameCount: frames.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: `${frames.length} frames removed.` });
  } catch (error: any) {
    console.error('deleteTurntableFrames error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete 360° frames', error: error.message });
  }
};
