import { Request, Response } from 'express';
import prisma from '../config/prisma';

const productCardIncludes = {
  featuredImage: { select: { originalUrl: true, thumbUrl: true } },
  categories: { select: { name: true } },
};

export const getSpecialCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = String(req.params.type).toLowerCase();
    const limit = Number(req.query.limit) || 8;

    const whereClause: any = { productStatus: { notIn: ['DRAFT', 'ARCHIVED'] } };
    let orderByClause: any = { updatedAt: 'desc' };

    if (type === 'latest') {
      orderByClause = { createdAt: 'desc' };
    } else {
      const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
      const upper = type.toUpperCase();
      const lower = type.toLowerCase();

      whereClause.OR = [{ tags: { hasSome: [capitalized, lower, upper] } }];

      const validStatuses = ['ACTIVE', 'FEATURED', 'HOT', 'NEW'];
      if (validStatuses.includes(upper)) {
        whereClause.OR.push({ productStatus: upper });
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      orderBy: orderByClause,
      include: productCardIncludes,
    });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(`Error fetching dynamic collection [${req.params.type}]:`, error);
    res.status(500).json({ success: false, message: 'Failed to fetch collection' });
  }
};

export const getCollectionByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = String(req.params.tag);
    const limit = Number(req.query.limit) || 8;

    const products = await prisma.product.findMany({
      where: {
        tags: { has: tag },
        productStatus: { notIn: ['DRAFT', 'ARCHIVED'] },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: productCardIncludes,
    });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(`Error fetching tag [${req.params.tag}]:`, error);
    res.status(500).json({ success: false, message: 'Failed to fetch tagged products' });
  }
};
