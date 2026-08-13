// src/controllers/search.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Only admins (attached via optionalAuth) may see DRAFT/ARCHIVED products
// in search results.
const isAdminReq = (req: Request): boolean => {
  const roles: string[] = (req as any).user?.roles || [];
  return roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
};

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = Number(req.query.limit) || 15;

    // If the user sends an empty search, return an empty array instantly
    if (!query || query.trim() === '') {
      res.json({ success: true, data: [] });
      return;
    }

    const productWhere: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { productCode: { contains: query, mode: 'insensitive' } },
        { tags: { has: query.toLowerCase() } } // Searches inside your tags array too!
      ]
    };
    if (!isAdminReq(req)) {
      productWhere.productStatus = { notIn: ['DRAFT', 'ARCHIVED'] };
    }

    // Run database queries in parallel for maximum speed
    const [products, categories] = await Promise.all([

      // 1. Find matching products
      prisma.product.findMany({
        where: productWhere,
        take: limit,
        // Include the image so the frontend can display it in the dropdown
        include: { 
          featuredImage: { select: { thumbUrl: true, originalUrl: true } } 
        }
      }),

      // 2. Find matching categories
      prisma.category.findMany({
        where: { 
          name: { contains: query, mode: 'insensitive' } 
        },
        take: 5, // Keep categories limited so they don't flood the results
        include: {
          featuredImage: { select: { thumbUrl: true, originalUrl: true } }
        }
      })
    ]);

    // Tag the results so your generic frontend UI knows what to render
    const taggedCategories = categories.map(c => ({ ...c, type: 'category' }));
    const taggedProducts = products.map(p => ({ ...p, type: 'product' }));

    // Combine them (Categories first, then Products)
    const combinedResults = [...taggedCategories, ...taggedProducts];

    res.json({
      success: true,
      data: combinedResults
    });

  } catch (error) {
    console.error("Global search error:", error);
    res.status(500).json({ success: false, message: 'Search failed', error });
  }
};