import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { logAction } from './audit.controller';

// 1. GET ALL HERO SECTIONS (Public - filtered by isActive)
export const getActiveHeroSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const heroes = await prisma.heroSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: { image: true }
    });
    res.json({ success: true, data: heroes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero sections' });
  }
};

// 2. GET ALL HERO SECTIONS (Admin - all)
export const getAllHeroSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const heroes = await prisma.heroSection.findMany({
      orderBy: { order: 'asc' },
      include: { image: true }
    });
    res.json({ success: true, data: heroes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch all hero sections' });
  }
};

// 3. CREATE HERO SECTION (Admin)
export const createHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, badgeLabel, badgeText, imageID, isActive, order } = req.body;

    // If this new hero is active, deactivate all others
    if (isActive === true) {
      await prisma.heroSection.updateMany({
        where: { id: { not: undefined } }, // placeholder to match all others
        data: { isActive: false }
      });
    }

    const hero = await prisma.heroSection.create({
      data: {
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        badgeLabel,
        badgeText,
        imageID,
        isActive: isActive ?? true,
        order: order ?? 0
      },
      include: { image: true }
    });

    // LOG ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.roles?.[0],
      action: 'CREATE_HERO_SECTION',
      entity: 'HeroSection',
      entityId: hero.id,
      details: { title: hero.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: 'Hero section created', data: hero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create hero section' });
  }
};

// 4. UPDATE HERO SECTION (Admin)
export const updateHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, subtitle, description, buttonText, buttonLink, badgeLabel, badgeText, imageID, isActive, order } = req.body;

    // If this hero is being activated, deactivate all others
    if (isActive === true) {
      await prisma.heroSection.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
      });
    }

    const hero = await prisma.heroSection.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        badgeLabel,
        badgeText,
        imageID,
        isActive,
        order
      },
      include: { image: true }
    });

    // LOG ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.roles?.[0],
      action: 'UPDATE_HERO_SECTION',
      entity: 'HeroSection',
      entityId: hero.id,
      details: { title: hero.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Hero section updated', data: hero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update hero section' });
  }
};

// 5. DELETE HERO SECTION (Admin)
export const deleteHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const hero = await prisma.heroSection.delete({
      where: { id }
    });

    // LOG ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.roles?.[0],
      action: 'DELETE_HERO_SECTION',
      entity: 'HeroSection',
      entityId: id,
      details: { title: hero.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Hero section deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete hero section' });
  }
};
