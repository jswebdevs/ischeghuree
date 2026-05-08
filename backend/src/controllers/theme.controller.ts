import { Request, Response } from 'express';
import prisma from '../config/prisma';

// --- PUBLIC ---

/**
 * 1. Get the single "Master" theme (loads first for everyone)
 */
export const getActiveTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const theme = await prisma.storeTheme.findFirst({ where: { isActive: true } });
    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active theme' });
  }
};

/**
 * 2. Get list of available themes for the user toggle menu
 * Only returns themes where status = true
 */
export const getPublicThemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const themes = await prisma.storeTheme.findMany({
      where: { status: true },
      select: { 
        id: true, 
        name: true, 
        lightVariables: true, 
        darkVariables: true, 
        radius: true 
      }
    });
    res.json({ success: true, data: themes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch theme list' });
  }
};

// --- SUPER ADMIN ONLY (CRUD) ---

export const getAllThemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const themes = await prisma.storeTheme.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: themes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch themes' });
  }
};

export const createTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const theme = await prisma.storeTheme.create({ data: req.body });
    res.status(201).json({ success: true, data: theme });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Theme name must be unique' });
  }
};

export const updateTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // 🔥 Cast to string here
    const theme = await prisma.storeTheme.update({ 
      where: { id }, 
      data: req.body 
    });
    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update failed' });
  }
};

export const deleteTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // 🔥 Cast to string here
    const theme = await prisma.storeTheme.findUnique({ where: { id } });
    
    if (theme?.isActive) {
      res.status(400).json({ success: false, message: 'Cannot delete active theme' });
      return;
    }

    await prisma.storeTheme.delete({ where: { id } });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

// --- ADMIN & SUPER ADMIN ---

/**
 * Admin decides if theme exists in frontend (status) 
 * or if it is the default for new visitors (isActive)
 */
export const toggleThemeProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // 🔥 Cast to string here
    const { status, isActive } = req.body;

    if (isActive) {
      await prisma.$transaction([
        prisma.storeTheme.updateMany({ data: { isActive: false } }),
        prisma.storeTheme.update({ 
          where: { id }, 
          data: { isActive: true, status: true } 
        })
      ]);
    } else {
      await prisma.storeTheme.update({
        where: { id },
        data: { 
          ...(status !== undefined && { status }),
          ...(isActive !== undefined && { isActive }) 
        }
      });
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Toggle failed' });
  }
};