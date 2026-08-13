import { Request, Response } from 'express';
import prisma from '../config/prisma';

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// Public routes attach the user via optionalAuth; only admins may see
// non-PUBLISHED pages.
const isAdminReq = (req: Request): boolean => {
  const roles: string[] = (req as any).user?.roles || [];
  return roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
};

// @desc    Create a new custom page
// @route   POST /api/v1/pages
export const createPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, status, template, featuredImage, metaTitle, metaDescription, pageConfig } = req.body;

    let slug = req.body.slug || generateSlug(title);

    const existingPage = await prisma.storefrontPage.findUnique({ where: { slug } });
    if (existingPage) {
      res.status(400).json({ success: false, message: "A page with this URL slug already exists." });
      return;
    }

    const newPage = await prisma.storefrontPage.create({
      data: {
        title,
        slug,
        template:        template        || "DEFAULT",
        content:         content         ?? [],
        status:          status          || "DRAFT",
        featuredImage:   featuredImage   || null,
        metaTitle:       metaTitle       || null,
        metaDescription: metaDescription || null,
        pageConfig:      pageConfig      ?? null,
      },
    });

    res.status(201).json({ success: true, data: newPage });
  } catch (error: any) {
    console.error("Create Page Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create page" });
  }
};

// @desc    Get all pages
// @route   GET /api/v1/pages
export const getAllPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;

    const whereClause: any = {};
    if (status) whereClause.status = status;

    // Guests and customers only ever see published pages, regardless of the
    // status filter they pass. Admins can list drafts.
    if (!isAdminReq(req)) whereClause.status = 'PUBLISHED';

    const pages = await prisma.storefrontPage.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({ success: true, count: pages.length, data: pages });
  } catch (error: any) {
    console.error("Get Pages Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pages" });
  }
};

// @desc    Get a single page by slug
// @route   GET /api/v1/pages/:slug
export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const page = await prisma.storefrontPage.findUnique({ where: { slug } });

    if (!page) {
      res.status(404).json({ success: false, message: "Page not found" });
      return;
    }

    if (page.status === "DRAFT" && !isAdminReq(req)) {
      res.status(403).json({ success: false, message: "This page is not published yet." });
      return;
    }

    res.status(200).json({ success: true, data: page });
  } catch (error: any) {
    console.error("Get Single Page Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch page" });
  }
};

// @desc    Update a page
// @route   PATCH /api/v1/pages/:id
export const updatePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Explicitly whitelist known fields — avoids Prisma validation errors
    // if the client sends unknown/internal fields, and prevents injection.
    const {
      title,
      slug,
      status,
      template,
      featuredImage,
      metaTitle,
      metaDescription,
      pageConfig,
      content,
    } = req.body;

    const data: Record<string, any> = {};
    if (title          !== undefined) data.title          = title;
    if (slug           !== undefined) data.slug           = slug;
    if (status         !== undefined) data.status         = status;
    if (template       !== undefined) data.template       = template;
    if (featuredImage  !== undefined) data.featuredImage  = featuredImage;
    if (metaTitle      !== undefined) data.metaTitle      = metaTitle;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;
    if (pageConfig     !== undefined) data.pageConfig     = pageConfig;
    if (content        !== undefined) data.content        = content;

    const updatedPage = await prisma.storefrontPage.update({
      where: { id },
      data,
    });

    res.status(200).json({ success: true, data: updatedPage });
  } catch (error: any) {
    console.error("Update Page Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update page" });
  }
};

// @desc    Delete a page
// @route   DELETE /api/v1/pages/:id
export const deletePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    await prisma.storefrontPage.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    console.error("Delete Page Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete page" });
  }
};
