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

// Variations arrive as the full ordered list on every save and are synced by
// id: rows that come back with an id are updated, rows without one are
// created, and the product's other variations are deleted. (Delete-and-
// recreate would briefly hold two rows with the same unique productCode.)
// Rows without a name are dropped; a malformed colour is ignored rather than
// failing the whole save.
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const optText = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);
const idList = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : [];

const parseVariants = (raw: unknown) => {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((v: any) => v && typeof v.name === 'string' && v.name.trim() !== '')
    .map((v: any, i: number) => ({
      id: optText(v.id),
      data: {
        name: v.name.trim(),
        productCode: optText(v.productCode),
        colorHex: typeof v.colorHex === 'string' && HEX_COLOR.test(v.colorHex) ? v.colorHex : null,
        imageId: optText(v.imageId),
        material: optText(v.material),
        shortDesc: optText(v.shortDesc),
        priceMin: cleanPrice(v.priceMin),
        priceMax: cleanPrice(v.priceMax),
        isAvailable: v.isAvailable !== false,
        sortOrder: i,
      },
      galleryIds: idList(v.galleryImageIds),
    }));
};

type VariantRows = NonNullable<ReturnType<typeof parseVariants>>;

const syncVariants = async (tx: any, productId: string, rows: VariantRows) => {
  // A variation code must not reuse any product's main code, or orders quoting
  // it would be ambiguous. (Variation-vs-variation clashes hit the unique
  // index and surface as P2002.)
  const codes = rows.map((r) => r.data.productCode).filter((c): c is string => !!c);
  if (codes.length > 0) {
    const clash = await tx.product.findFirst({
      where: { productCode: { in: codes } },
      select: { productCode: true },
    });
    if (clash) throw Object.assign(new Error('variant code clash'), { code: 'VARIANT_CODE_TAKEN', value: clash.productCode });
  }

  const existing: { id: string }[] = await tx.productVariant.findMany({
    where: { productId },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((v) => v.id));
  const keepIds = rows.map((r) => r.id).filter((id): id is string => !!id && existingIds.has(id));

  await tx.productVariant.deleteMany({ where: { productId, id: { notIn: keepIds } } });
  // Clear the kept rows' codes first so swapping codes between two
  // variations in one save doesn't trip the unique index mid-way.
  if (keepIds.length > 0) {
    await tx.productVariant.updateMany({ where: { id: { in: keepIds } }, data: { productCode: null } });
  }

  for (const row of rows) {
    const gallery = row.galleryIds.map((id) => ({ id }));
    if (row.id && existingIds.has(row.id)) {
      await tx.productVariant.update({
        where: { id: row.id },
        data: { ...row.data, images: { set: gallery } },
      });
    } else {
      await tx.productVariant.create({
        data: { ...row.data, productId, images: { connect: gallery } },
      });
    }
  }
};

const mediaSelect = { select: { id: true, originalUrl: true, thumbUrl: true } };
const variantInclude = {
  orderBy: { sortOrder: 'asc' as const },
  include: { image: mediaSelect, images: mediaSelect },
};

// Maps the Prisma errors an admin can actually cause from the product form to
// a 4xx with a readable message (shown in the dashboard's error popup),
// instead of a bare 500. Returns false for anything else.
const sendPrismaError = (error: any, res: Response): boolean => {
  if (error?.code === 'VARIANT_CODE_TAKEN') {
    res.status(409).json({
      success: false,
      message: `Variation code "${error.value}" is already a product code — use a different one.`,
    });
    return true;
  }
  if (error?.code === 'P2002') {
    // meta.target is empty under the Prisma 7 pg driver adapter; the column
    // then only appears in the adapter cause or the message text.
    const target = [
      ...([] as string[]).concat(error.meta?.target ?? []),
      ...([] as string[]).concat(error.meta?.driverAdapterError?.cause?.constraint?.fields ?? []),
      String(error.message ?? ''),
    ].join(' ');
    const isVariant = error.meta?.modelName === 'ProductVariant' || target.includes('ProductVariant');
    const field = isVariant && target.includes('productCode') ? 'A variation product code'
      : target.includes('productCode') ? 'Product code'
      : target.includes('slug') ? 'Slug'
      : 'A unique field';
    res.status(409).json({ success: false, message: `${field} already exists — use a different one.` });
    return true;
  }
  if (error?.code === 'P2025' || error?.code === 'P2018') {
    res.status(400).json({
      success: false,
      message: 'A linked category, image or suggested product no longer exists — reselect it and save again.',
    });
    return true;
  }
  if (error?.name === 'PrismaClientValidationError') {
    res.status(400).json({ success: false, message: 'Some product fields have an invalid value.' });
    return true;
  }
  return false;
};

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
      variantLabel, variants,
    } = req.body;

    if (!name || !productCode) {
      res.status(400).json({ success: false, message: 'name and productCode are required' });
      return;
    }

    const variantRows = parseVariants(variants);
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
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
        variantLabel: variantLabel || null,
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
        select: { id: true },
      });
      if (variantRows && variantRows.length > 0) await syncVariants(tx, created.id, variantRows);
      return tx.product.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          categories: { select: { id: true, name: true, slug: true } },
          featuredImage: mediaSelect,
          images: mediaSelect,
          variants: variantInclude,
        },
      });
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
    if (sendPrismaError(error, res)) return;
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
        // A variation's own code finds its parent product.
        { variants: { some: { productCode: { contains: String(search), mode: 'insensitive' } } } },
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
        variants: variantInclude,
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

// Admin edit form: the full record by id, with every relation the form saves
// back (the public by-slug view caps suggestions at 4, and the list endpoint
// omits gallery/3D/variants — loading either into the form would drop data
// on the next save).
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
      include: {
        categories: { select: { id: true, name: true, slug: true } },
        featuredImage: { select: { id: true, originalUrl: true, thumbUrl: true } },
        images: { select: { id: true, originalUrl: true, thumbUrl: true } },
        model3d: { select: { id: true, originalUrl: true } },
        turntableFrames: {
          orderBy: { sequence: 'asc' },
          select: { id: true, originalUrl: true, sequence: true },
        },
        suggestedProducts: { select: { id: true, name: true } },
        variants: variantInclude,
      },
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get Product By Id Error:', error);
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
      variantLabel, variants,
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
    if (variantLabel !== undefined) dataToUpdate.variantLabel = variantLabel || null;
    const variantRows = parseVariants(variants);

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

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data: dataToUpdate, select: { id: true } });
      if (variantRows) await syncVariants(tx, id, variantRows);
      return tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          featuredImage: mediaSelect,
          images: mediaSelect,
          categories: true,
          suggestedProducts: { select: { id: true, name: true } },
          variants: variantInclude,
        },
      });
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
    if (sendPrismaError(error, res)) return;
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
