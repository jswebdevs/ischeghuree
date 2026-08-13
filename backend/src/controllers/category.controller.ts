import { Request, Response } from 'express';
import prisma from '../config/prisma';

// 🚨 IMPORT THE LOGGER
import { logAction } from './audit.controller';

// 1. CREATE CATEGORY
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      slug, 
      description, 
      parentId, 
      featuredImageId, 
      icon 
    } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/ /g, '-'),
        description,
        icon: icon || null, 
        // Safely handle relations: if empty string passed from frontend, convert to null
        parentId: parentId ? parentId : null,
        featuredImageId: featuredImageId ? featuredImageId : null, 
      },
      include: {
        featuredImage: { select: { originalUrl: true } }
      }
    });

    // 🚨 LOG: CREATE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'CREATE_CATEGORY',
      entity: 'Category',
      entityId: category.id,
      details: { name: category.name, slug: category.slug, parentId: category.parentId },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create category', error });
  }
};

// 2. GET ALL (Tree or Flat List)
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tree } = req.query;

    if (tree === 'true') {
      // Return hierarchical data (Top-level categories with their children)
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: { 
          children: { 
            include: { 
              children: true, // Depth: 2 levels deep
              featuredImage: { select: { originalUrl: true } }
            } 
          },
          featuredImage: { select: { originalUrl: true } }
        },
      });
      res.json({ success: true, data: categories });
      return;
    }

    // Flat list with counts
    const categories = await prisma.category.findMany({
      include: { 
        featuredImage: { select: { originalUrl: true, thumbUrl: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 3. GET SINGLE CATEGORY (By Slug)
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug: slug as string },
      include: {
        parent: { select: { name: true, slug: true } },
        children: { select: { name: true, slug: true, _count: { select: { products: true } } } },
        featuredImage: true,
        _count: { select: { products: true } }
      }
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 4. UPDATE CATEGORY
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // FIX: Force TypeScript to treat this as a single string
    const identifier = (req.params.id || req.params.slug) as string; 
    
    // Destructure incoming data
    const { featuredImageId, icon, parentId, slug, ...otherData } = req.body;

    // Check if the identifier is a UUID
    const isId = identifier && identifier.length === 36 && identifier.includes('-');

    const category = await prisma.category.update({
      // FIX: Ensure Prisma receives guaranteed strings
      where: isId ? { id: identifier } : { slug: identifier }, 
      data: {
        ...otherData,
        slug: slug ? slug : undefined,
        icon: icon ? icon : null, 
        parentId: parentId ? parentId : null,
        featuredImageId: featuredImageId ? featuredImageId : null,
      },
      include: {
        featuredImage: { select: { originalUrl: true } }
      }
    });

    // 🚨 LOG: UPDATE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_CATEGORY',
      entity: 'Category',
      entityId: category.id,
      details: { updatedFields: Object.keys(otherData), name: category.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error: any) {
    console.error("Update Error:", error);
    
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Category not found. Update failed.' });
      return;
    }

    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// 5. DELETE CATEGORY
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if category has products
    const categoryCheck = await prisma.category.findUnique({
        where: { id: id as string },
        include: { _count: { select: { products: true } } }
    });

    if (!categoryCheck) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
    }

    if (categoryCheck._count.products > 0) {
        res.status(400).json({ 
            success: false, 
            message: `Cannot delete category. It still contains ${categoryCheck._count.products} products.` 
        });
        return;
    }

    await prisma.category.delete({ where: { id: id as string } });
    
    // 🚨 LOG: DELETE ACTION
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_CATEGORY',
      entity: 'Category',
      entityId: id as string,
      details: { deletedCategoryName: categoryCheck.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    // Specifically catch Prisma "Record Not Found" error
    if (error.code === 'P2025') {
        res.status(404).json({ success: false, message: 'Category not found.' });
        return;
    }
    
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};