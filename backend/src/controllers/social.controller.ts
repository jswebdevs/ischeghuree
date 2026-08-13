import { Request, Response } from 'express';
import prisma from '../config/prisma';

// 🚨 IMPORT THE LOGGER
import { logAction } from './audit.controller';

// 1. GET PUBLIC SOCIAL LINKS (For the Footer - Read-only)
export const getPublicSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: links });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch social links' });
  }
};

// 2. GET ALL SOCIAL LINKS (For Admin Dashboard - Read-only)
export const getAllSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: links });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch social links' });
  }
};

// 3. CREATE SOCIAL LINK (Admin)
export const createSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, icon, link, isActive, order } = req.body;

    const newLink = await prisma.socialLink.create({
      data: {
        name,
        icon,
        link,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    });

    // 🚨 LOG: CREATE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'CREATE_SOCIAL_LINK',
      entity: 'SocialLink',
      entityId: newLink.id,
      details: { name: newLink.name, link: newLink.link },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: 'Social link added', data: newLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create social link' });
  }
};

// 4. UPDATE SOCIAL LINK (Admin)
export const updateSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, icon, link, isActive, order } = req.body;

    const updatedLink = await prisma.socialLink.update({
      where: { id },
      data: { name, icon, link, isActive, order }
    });

    // 🚨 LOG: UPDATE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_SOCIAL_LINK',
      entity: 'SocialLink',
      entityId: updatedLink.id,
      details: { 
        name: updatedLink.name, 
        link: updatedLink.link, 
        isActive: updatedLink.isActive 
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Social link updated', data: updatedLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update social link' });
  }
};

// 5. DELETE SOCIAL LINK (Admin)
export const deleteSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Capture the deleted link so we can record its name and URL
    const deletedLink = await prisma.socialLink.delete({ where: { id } });
    
    // 🚨 LOG: DELETE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_SOCIAL_LINK',
      entity: 'SocialLink',
      entityId: id,
      details: { deletedName: deletedLink.name, deletedLink: deletedLink.link },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete social link' });
  }
};