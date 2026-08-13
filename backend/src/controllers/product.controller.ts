import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { logAction } from './audit.controller';

const cleanPrice = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

// Public routes attach the user via optionalAuth; only admins may see
// DRAFT/ARCHIVED products in listings and detail views.
const isAdminReq = (req: Request): boolean => {
  const roles: string[] = (req as any).user?.roles || [];
  return roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
};

const HIDDEN_STATUSES = ['DRAFT', 'ARCHIVED'] as const;

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, slug, productCode, shortDesc, longDesc,
      priceMin, priceMax, priceNote,
      categoryIds, attributes, tags,
      featuredImageId, galleryImageIds,
      material, usage, usefulness, awareness, specifications,
      productStatus, blogUrl,
      suggestedProducts,
    } = req.body;

    if (!name || !productCode) {
      res.status(400).json({ success: false, message: 'name and productCode are required' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        productCode,
        shortDesc,
        longDesc,
        priceMin: cleanPrice(priceMin),
        priceMax: cleanPrice(priceMax),
        priceNote: priceNote ?? null,
        tags: tags || [],
        attributes,
        material,
        usage,
        usefulness,
        awareness,
        specifications,
        productStatus: productStatus || 'DRAFT',
        blogUrl: blogUrl || null,
        categories: categoryIds && categoryIds.length > 0
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
        suggestedProducts: suggestedProducts && suggestedProducts.length > 0
          ? { connect: suggestedProducts.map((id: string) => ({ id })) }
          : undefined,
        featuredImage: featuredImageId ? { connect: { id: featuredImageId } } : undefined,
        images: galleryImageIds && galleryImageIds.length > 0
          ? { connect: galleryImageIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        categories: { select: { id: true, name: true, slug: true } },
        featuredImage: { select: { id: true, originalUrl: true, thumbUrl: true } },
        images: { select: { id: true, originalUrl: true, thumbUrl: true } },
      },
    });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: product.id,
      details: { name: product.name, productCode: product.productCode },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sort, material, status } = req.query;
    // Sanitize pagination: non-numeric input falls back to defaults, and both
    // values are clamped so NaN/negative skip/take never reach Prisma.
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const where: any = {};

    // Storefront callers never see unpublished products.
    if (!isAdminReq(req)) {
      where.productStatus = { notIn: [...HIDDEN_STATUSES] };
    }

    // Optional status filter — only publicly-visible statuses are accepted, so
    // this can safely override the notIn guard above (e.g. ?status=FEATURED
    // powers the homepage "Featured" grid).
    const PUBLIC_STATUSES = ['ACTIVE', 'FEATURED', 'HOT', 'NEW'];
    if (status && typeof status === 'string' && PUBLIC_STATUSES.includes(status.toUpperCase())) {
      where.productStatus = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { productCode: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (category) where.categories = { some: { id: String(category) } };
    if (material) where.material = { in: String(material).split(',') };
    if (minPrice || maxPrice) {
      const conditions: any[] = [];
      if (minPrice) conditions.push({ priceMax: { gte: Number(minPrice) } });
      if (maxPrice) conditions.push({ priceMin: { lte: Number(maxPrice) } });
      where.AND = (where.AND || []).concat(conditions);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'az') orderBy = { name: 'asc' };
    else if (sort === 'za') orderBy = { name: 'desc' };
    else if (sort === 'price_low') orderBy = { priceMin: 'asc' };
    else if (sort === 'price_high') orderBy = { priceMax: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy,
        include: {
          categories: { select: { id: true, name: true, slug: true } },
          featuredImage: { select: { id: true, originalUrl: true, thumbUrl: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: true,
        featuredImage: true,
        images: true,
        model3d: { select: { id: true, originalUrl: true } },
        turntableFrames: {
          orderBy: { sequence: 'asc' },
          select: { id: true, originalUrl: true, sequence: true },
        },
        suggestedProducts: {
          take: 4,
          select: {
            id: true,
            name: true,
            slug: true,
            priceMin: true,
            priceMax: true,
            priceNote: true,
            featuredImage: { select: { originalUrl: true, thumbUrl: true } },
          },
        },
      },
    });

    // Hide unpublished products from non-admin callers — indistinguishable
    // from a missing product so the slug can't be probed.
    if (!product || (!isAdminReq(req) && (HIDDEN_STATUSES as readonly string[]).includes(product.productStatus))) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (product.suggestedProducts && product.suggestedProducts.length > 0) {
      product.suggestedProducts = product.suggestedProducts.sort(() => 0.5 - Math.random());
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get Single Product Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const {
      name, slug, productCode, shortDesc, longDesc, tags,
      blogUrl, productStatus, attributes, material, usage,
      usefulness, awareness, specifications,
      priceMin, priceMax, priceNote,
      featuredImageId, galleryImageIds, categoryIds, suggestedProducts,
    } = req.body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (productCode !== undefined) dataToUpdate.productCode = productCode;
    if (shortDesc !== undefined) dataToUpdate.shortDesc = shortDesc;
    if (longDesc !== undefined) dataToUpdate.longDesc = longDesc;
    if (tags !== undefined) dataToUpdate.tags = tags;
    if (blogUrl !== undefined) dataToUpdate.blogUrl = blogUrl;
    if (productStatus !== undefined) dataToUpdate.productStatus = productStatus;
    if (attributes !== undefined) dataToUpdate.attributes = attributes;
    if (material !== undefined) dataToUpdate.material = material;
    if (usage !== undefined) dataToUpdate.usage = usage;
    if (usefulness !== undefined) dataToUpdate.usefulness = usefulness;
    if (awareness !== undefined) dataToUpdate.awareness = awareness;
    if (specifications !== undefined) dataToUpdate.specifications = specifications;
    if (priceMin !== undefined) dataToUpdate.priceMin = cleanPrice(priceMin);
    if (priceMax !== undefined) dataToUpdate.priceMax = cleanPrice(priceMax);
    if (priceNote !== undefined) dataToUpdate.priceNote = priceNote || null;

    if (featuredImageId !== undefined) {
      dataToUpdate.featuredImage = featuredImageId
        ? { connect: { id: featuredImageId } }
        : { disconnect: true };
    }
    if (Array.isArray(galleryImageIds)) {
      const validIds = galleryImageIds.filter((v) => typeof v === 'string' && v.trim() !== '');
      dataToUpdate.images = { set: validIds.map((imgId) => ({ id: imgId })) };
    }
    if (Array.isArray(categoryIds)) {
      const validIds = categoryIds.filter((v) => typeof v === 'string' && v.trim() !== '');
      dataToUpdate.categories = { set: validIds.map((catId) => ({ id: catId })) };
    }
    if (Array.isArray(suggestedProducts)) {
      const validIds = suggestedProducts.filter((v) => typeof v === 'string' && v.trim() !== '');
      dataToUpdate.suggestedProducts = { set: validIds.map((pid) => ({ id: pid })) };
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        featuredImage: { select: { id: true, originalUrl: true, thumbUrl: true } },
        images: { select: { id: true, originalUrl: true, thumbUrl: true } },
        categories: true,
        suggestedProducts: { select: { id: true, name: true } },
      },
    });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: product.id,
      details: { updatedFields: Object.keys(dataToUpdate), name: product.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    await prisma.product.delete({ where: { id } });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { deletedProductName: product.name, productCode: product.productCode },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed due to a database constraint or system error.',
      error: error.message || error,
    });
  }
};

export const getProductFilters = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        // Public endpoint: DRAFT products must not leak their materials either.
        where: { productStatus: { notIn: [...HIDDEN_STATUSES] } },
        select: { material: true },
      }),
      prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
    ]);

    const materials = Array.from(new Set(products.map((p) => p.material).filter(Boolean))) as string[];

    res.json({
      success: true,
      data: {
        materials: materials.sort(),
        categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
      },
    });
  } catch (error) {
    console.error('Get Product Filters Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch filters' });
  }
};
