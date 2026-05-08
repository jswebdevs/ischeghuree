import { Request, Response } from 'express';
import prisma from '../config/prisma';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import os from 'os';
import path from 'path';

// 🚨 IMPORT THE LOGGER
import { logAction } from './audit.controller';

// Point fluent-ffmpeg at the bundled binary
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

const FOLDER_NAME = 'media';

// Convert any image buffer → WebP
const convertToWebP = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
  if (!file.mimetype.startsWith('image/') || file.mimetype === 'image/webp') return file;
  const convertedBuffer = await sharp(file.buffer).webp({ quality: 85 }).toBuffer();
  return {
    ...file,
    buffer: convertedBuffer,
    mimetype: 'image/webp',
    originalname: file.originalname.replace(/\.[^/.]+$/, '.webp'),
    size: convertedBuffer.length,
  };
};

// Convert any video buffer → WebM via temp files
const convertToWebM = (file: Express.Multer.File): Promise<Express.Multer.File> => {
  if (!file.mimetype.startsWith('video/') || file.mimetype === 'video/webm') return Promise.resolve(file);

  return new Promise((resolve, reject) => {
    const tmpInput = path.join(os.tmpdir(), `upload_in_${Date.now()}`);
    const tmpOutput = path.join(os.tmpdir(), `upload_out_${Date.now()}.webm`);

    fs.writeFileSync(tmpInput, file.buffer);

    ffmpeg(tmpInput)
      .outputFormat('webm')
      .videoCodec('libvpx-vp9')
      .audioCodec('libvorbis')
      .outputOptions(['-crf 33', '-b:v 0'])
      .output(tmpOutput)
      .on('end', () => {
        const convertedBuffer = fs.readFileSync(tmpOutput);
        fs.unlink(tmpInput, () => {});
        fs.unlink(tmpOutput, () => {});
        resolve({
          ...file,
          buffer: convertedBuffer,
          mimetype: 'video/webm',
          originalname: file.originalname.replace(/\.[^/.]+$/, '.webm'),
          size: convertedBuffer.length,
        });
      })
      .on('error', (err) => {
        fs.unlink(tmpInput, () => {});
        fs.unlink(tmpOutput, () => {});
        reject(err);
      })
      .run();
  });
};

// Convert file before upload (images → webp, videos → webm)
const convertFile = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
  if (file.mimetype.startsWith('image/')) return convertToWebP(file);
  if (file.mimetype.startsWith('video/')) return convertToWebM(file);
  return file;
};

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (file: Express.Multer.File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER_NAME,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// 1. CREATE (Bulk Upload Files)
export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const uploadPromises = files.map(async (file) => {
      // 1. Convert image → WebP / video → WebM
      const converted = await convertFile(file);

      // 2. Upload to Cloudinary
      const result = await uploadToCloudinary(converted);

      const mediaType = converted.mimetype.startsWith('image/') ? 'IMAGE' :
                        converted.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT';

      // 3. Save to Database (use converted metadata)
      return prisma.media.create({
        data: {
          filename: result.public_id,
          originalUrl: result.secure_url,
          thumbUrl: result.secure_url,
          mimetype: converted.mimetype,
          size: converted.size,
          folder: FOLDER_NAME,
          mediaType: mediaType as any,
          altText: req.body.altText || '',
          title: converted.originalname,
        }
      });
    });

    const results = await Promise.all(uploadPromises);

    // 🚨 LOG: UPLOAD ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'BULK_UPLOAD_MEDIA',
      entity: 'Media',
      entityId: results[0]?.id || 'bulk',
      details: { uploadedCount: results.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, data: results });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

// 2. READ ALL (Gallery View - Read-only)
export const getAllMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, count: media.length, data: media });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 3. READ ONE (Single Details - Read-only)
export const getMediaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }

    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 4. UPDATE (Metadata OR File Replacement)
export const updateMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { altText, title, description } = req.body;

    const existingMedia = await prisma.media.findUnique({ where: { id } });
    if (!existingMedia) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }

    let updateData: any = { altText, title, description };
    let fileReplaced = false;

    if (req.file) {
      fileReplaced = true;
      // A. Delete old file from Cloudinary
      if (existingMedia.filename) {
        await cloudinary.uploader.destroy(existingMedia.filename);
      }

      // B. Convert image → WebP / video → WebM, then upload
      const converted = await convertFile(req.file);
      const result = await uploadToCloudinary(converted);

      const mediaType = converted.mimetype.startsWith('image/') ? 'IMAGE' :
                        converted.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT';

      updateData = {
        ...updateData,
        filename: result.public_id,
        originalUrl: result.secure_url,
        thumbUrl: result.secure_url,
        mimetype: converted.mimetype,
        size: converted.size,
        mediaType: mediaType as any,
      };
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: updateData
    });

    // 🚨 LOG: UPDATE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_MEDIA',
      entity: 'Media',
      entityId: updatedMedia.id,
      details: { fileReplaced, title: updatedMedia.title, updatedFields: Object.keys(updateData) },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Media updated', data: updatedMedia });
  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// 5. DELETE (Bulk Delete)
export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'No file IDs provided' });
      return;
    }

    const mediaItems = await prisma.media.findMany({ where: { id: { in: ids } } });
    if (mediaItems.length === 0) {
      res.status(404).json({ success: false, message: 'Files not found' });
      return;
    }

    const publicIds = mediaItems.map(m => m.filename).filter(Boolean) as string[];

    // 1. Delete from Cloudinary
    if (publicIds.length > 0) {
      const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
      await Promise.all(deletePromises);
    }

    // 2. Delete from Database
    await prisma.media.deleteMany({ where: { id: { in: ids } } });

    // 🚨 LOG: DELETE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'BULK_DELETE_MEDIA',
      entity: 'Media',
      entityId: 'bulk',
      details: { deletedCount: ids.length, publicIds },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: `${ids.length} files deleted successfully` });
  } catch (error: any) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};