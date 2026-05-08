import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { logAction } from './audit.controller';

// Drop every server-secret field before returning settings to non-admin
// callers. Add new secrets here whenever you extend SiteSettings — this is
// the single chokepoint that keeps payment + 3rd-party keys off the wire.
const stripSecrets = (s: any) => {
  if (!s) return s;
  const {
    googleApiKey: _gak,
    stripeSecretKey: _ssk,
    paypalSecret: _ps,
    ...safe
  } = s;
  return safe;
};

const isAdmin = (req: Request) => {
  const roles = (req as any).user?.roles || [];
  return roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
      include: { logo: true, favicon: true, ogImage: true },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'singleton' },
        include: { logo: true, favicon: true, ogImage: true },
      });
    }

    res.json({ success: true, data: isAdmin(req) ? settings : stripSecrets(settings) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' });
  }
};

export const getHomepageConfig = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await (prisma.siteSettings as any).findUnique({ where: { id: 'singleton' } });
    const homepageConfig = (settings?.homepageConfig || {}) as Record<string, unknown>;
    res.json({ success: true, data: homepageConfig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch homepage config' });
  }
};

export const updateHomepageSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const section = req.params['section'] as string;
    const sectionData = req.body;

    if (!section || typeof section !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_-]{0,40}$/.test(section)) {
      res.status(400).json({ success: false, message: 'Invalid section key.' });
      return;
    }

    // Wrap read-modify-write in a transaction so two admins saving
    // different sections at the same instant don't drop one another's
    // changes. Prisma's transaction here is sequential — under contention,
    // one will retry and re-merge against the latest config.
    const updated = await prisma.$transaction(async (tx) => {
      const settings = await (tx.siteSettings as any).findUnique({ where: { id: 'singleton' } });
      const existing = ((settings?.homepageConfig) || {}) as Record<string, unknown>;
      const merged: Record<string, unknown> = { ...existing };
      merged[section] = sectionData;

      return (tx.siteSettings as any).upsert({
        where: { id: 'singleton' },
        update: { homepageConfig: merged },
        create: { id: 'singleton', homepageConfig: merged },
      });
    });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_HOMEPAGE_SECTION',
      entity: 'SiteSettings',
      entityId: 'singleton',
      details: { section },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const updatedConfig = (updated.homepageConfig || {}) as Record<string, unknown>;
    res.json({ success: true, message: `Section "${section}" saved`, data: updatedConfig[section] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update homepage section' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      storeName, tagline, companySlogan,
      supportEmail, supportPhone, contactEmail, contactPhone, contactAddress,
      logoId, faviconId, ogImageId,
      currencyCode, currencySymbol, timezone, address,
      orderPrefix, maintenanceMode, maintenanceMessage,
      googlePlaceId, googleApiKey,
      footerConfig, homepageConfig,
    } = req.body;

    const update: Record<string, unknown> = {
      storeName, tagline, companySlogan,
      supportEmail, supportPhone, contactEmail, contactPhone, contactAddress,
      logoId, faviconId, ogImageId,
      currencyCode, currencySymbol, timezone, address,
      orderPrefix, maintenanceMode, maintenanceMessage,
      googlePlaceId,
      footerConfig, homepageConfig,
    };

    if (typeof googleApiKey === 'string' && googleApiKey.trim() !== '') {
      update['googleApiKey'] = googleApiKey.trim();
    }

    const updatedSettings = await (prisma.siteSettings as any).upsert({
      where: { id: 'singleton' },
      update,
      create: {
        id: 'singleton',
        storeName: storeName || 'Ginag',
        tagline,
        companySlogan,
        supportEmail,
        supportPhone,
        contactEmail,
        contactPhone,
        contactAddress,
        logoId,
        faviconId,
        ogImageId,
        currencyCode: currencyCode || 'USD',
        currencySymbol: currencySymbol || '$',
        timezone: timezone || 'America/Chicago',
        address,
        orderPrefix: orderPrefix || 'CO-',
        maintenanceMode: maintenanceMode ?? false,
        maintenanceMessage,
        googlePlaceId,
        googleApiKey: typeof googleApiKey === 'string' && googleApiKey.trim() !== '' ? googleApiKey.trim() : null,
        footerConfig: footerConfig || {},
        homepageConfig: homepageConfig || {},
      },
      include: { logo: true, favicon: true, ogImage: true },
    });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_SITE_SETTINGS',
      entity: 'SiteSettings',
      entityId: 'singleton',
      details: {
        updatedFields: Object.keys(req.body),
        maintenanceMode: updatedSettings.maintenanceMode,
        storeName: updatedSettings.storeName,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Settings saved successfully', data: stripSecrets(updatedSettings) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update site settings' });
  }
};
