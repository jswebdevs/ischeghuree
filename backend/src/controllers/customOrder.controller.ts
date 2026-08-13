import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { logAction } from './audit.controller';
import { sendMail, renderOrderConfirmation, renderDeliveryStatusUpdate } from '../utils/mailer';

const VALID_DELIVERY_STATUSES = [
  'PENDING',
  'DISPATCHED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'RETURNED',
  'CANCELLED',
] as const;
type DeliveryStatusValue = (typeof VALID_DELIVERY_STATUSES)[number];

const isAdminUser = (user: any): boolean =>
  Array.isArray(user?.roles) && user.roles.some((r: string) => r === 'SUPER_ADMIN' || r === 'ADMIN');

// Generate a collision-resistant order number without relying on an
// app-level row count (which is racy under load — two simultaneous orders
// would read the same count and write the same number, then violate the
// unique index). The base36 timestamp + random suffix gives ~1.7B keyspace.
const generateOrderNumber = (prefix: string) => {
  const stamp = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 6).padStart(4, '0');
  return `${prefix}${stamp}-${rnd}`;
};

const validateBody = (body: any): { ok: true; data: any } | { ok: false; message: string } => {
  const {
    customerName,
    customerPhone,
    productDetails,
    quantity,
    orderType,
    deliveryMethod,
    mailingAddress,
    customerEmail,
    notes,
  } = body || {};

  if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
    return { ok: false, message: 'নাম আবশ্যক। Name is required.' };
  }
  if (!customerPhone || typeof customerPhone !== 'string' || !customerPhone.trim()) {
    return { ok: false, message: 'মোবাইল নম্বর আবশ্যক। Cell number is required.' };
  }
  if (!productDetails || typeof productDetails !== 'string' || !productDetails.trim()) {
    return { ok: false, message: 'পণ্যের বিবরণ আবশ্যক। Product details are required.' };
  }
  let parsedQuantity: number | null = null;
  if (quantity !== undefined && quantity !== null && String(quantity).trim() !== '') {
    const q = Number(quantity);
    if (!Number.isInteger(q) || q < 1) {
      return { ok: false, message: 'পরিমাণ একটি ধনাত্মক সংখ্যা হতে হবে। Quantity must be a positive whole number.' };
    }
    parsedQuantity = q;
  }
  const resolvedOrderType = orderType === undefined || orderType === null || orderType === '' ? 'RETAIL' : orderType;
  if (resolvedOrderType !== 'RETAIL' && resolvedOrderType !== 'WHOLESALE') {
    return { ok: false, message: 'অর্ডারের ধরন খুচরা বা পাইকারী হতে হবে। Order type must be RETAIL or WHOLESALE.' };
  }
  if (deliveryMethod !== 'PICKUP' && deliveryMethod !== 'MAILING') {
    return { ok: false, message: 'ডেলিভারি পদ্ধতি নির্বাচন করুন। Delivery method must be PICKUP or MAILING.' };
  }
  if (deliveryMethod === 'MAILING' && (!mailingAddress || !String(mailingAddress).trim())) {
    return { ok: false, message: 'মেইলিং ঠিকানা আবশ্যক। Mailing address is required when delivery method is mailing.' };
  }
  if (customerEmail && typeof customerEmail === 'string' && customerEmail.trim()) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim());
    if (!ok) return { ok: false, message: 'ইমেইল ঠিকানাটি সঠিক নয়। Email is not a valid address.' };
  }

  return {
    ok: true,
    data: {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      productDetails: productDetails.trim(),
      quantity: parsedQuantity,
      orderType: resolvedOrderType,
      deliveryMethod,
      mailingAddress: deliveryMethod === 'MAILING' ? String(mailingAddress).trim() : null,
      customerEmail: customerEmail ? String(customerEmail).trim() : null,
      notes: notes ? String(notes).trim() : null,
    },
  };
};

export const createCustomOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = validateBody(req.body);
    if (!validated.ok) {
      res.status(400).json({ success: false, message: validated.message });
      return;
    }

    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    const prefix = settings?.orderPrefix || 'IG-';
    const storeName = settings?.storeName || 'ইচ্ছে ঘুড়ি — Ische Ghuree';

    const orderNumber = generateOrderNumber(prefix);

    const order = await prisma.customOrder.create({
      data: { ...validated.data, orderNumber },
    });

    if (order.customerEmail) {
      try {
        const { html, text } = renderOrderConfirmation({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          productDetails: order.productDetails,
          quantity: order.quantity,
          orderType: order.orderType,
          deliveryMethod: order.deliveryMethod,
          mailingAddress: order.mailingAddress,
          storeName,
          supportPhone: settings?.supportPhone || settings?.contactPhone,
          supportEmail: settings?.supportEmail || settings?.contactEmail,
        });
        await sendMail({
          to: order.customerEmail,
          subject: `Order Confirmation — ${order.orderNumber}`,
          html,
          text,
          fromName: storeName,
        });
      } catch (mailErr) {
        console.error('Confirmation email failed:', mailErr);
      }
    }

    await logAction({
      action: 'CREATE_CUSTOM_ORDER',
      entity: 'CustomOrder',
      entityId: order.id,
      details: { orderNumber: order.orderNumber, deliveryMethod: order.deliveryMethod },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Order received. A confirmation email has been sent if you provided one.',
      data: { id: order.id, orderNumber: order.orderNumber },
    });
  } catch (error) {
    console.error('Create CustomOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit order' });
  }
};

// Customer-scoped: orders matching the logged-in user's email
export const listMyCustomOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.email) {
      res.json({ success: true, data: [] });
      return;
    }
    const orders = await prisma.customOrder.findMany({
      where: { customerEmail: user.email },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('listMyCustomOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your orders' });
  }
};

export const listCustomOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    // Cap pagination to keep one admin from blowing the function's memory.
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const where: any = {};
    if (status && typeof status === 'string') where.status = status;
    if (search && typeof search === 'string') {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.customOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
      prisma.customOrder.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error('List CustomOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getCustomOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.customOrder.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Admins see any order; a logged-in customer only sees their own (matched by email).
    const user = (req as any).user;
    if (!isAdminUser(user)) {
      if (!user?.email || !order.customerEmail || order.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
        res.status(403).json({ success: false, message: 'You are not allowed to view this order.' });
        return;
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get CustomOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const updateCustomOrderDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { deliveryProvider, trackingUrl, deliveryStatus, deliveryNote, deliveredAt } = req.body || {};

    const data: any = {};

    if (deliveryStatus !== undefined) {
      if (!VALID_DELIVERY_STATUSES.includes(deliveryStatus)) {
        res.status(400).json({
          success: false,
          message: `Invalid deliveryStatus. Must be one of: ${VALID_DELIVERY_STATUSES.join(', ')}.`,
        });
        return;
      }
      data.deliveryStatus = deliveryStatus as DeliveryStatusValue;

      // Auto-stamp deliveredAt when transitioning to DELIVERED, unless caller passed an explicit value.
      if (deliveryStatus === 'DELIVERED' && deliveredAt === undefined) {
        data.deliveredAt = new Date();
      }
    }

    if (deliveryProvider !== undefined) {
      data.deliveryProvider = deliveryProvider ? String(deliveryProvider).trim() : null;
    }

    if (trackingUrl !== undefined) {
      const url = trackingUrl ? String(trackingUrl).trim() : '';
      if (url) {
        if (!/^https?:\/\//i.test(url)) {
          res.status(400).json({ success: false, message: 'trackingUrl must start with http:// or https://' });
          return;
        }
        data.trackingUrl = url;
      } else {
        data.trackingUrl = null;
      }
    }

    if (deliveryNote !== undefined) {
      data.deliveryNote = deliveryNote ? String(deliveryNote) : null;
    }

    if (deliveredAt !== undefined) {
      data.deliveredAt = deliveredAt ? new Date(deliveredAt) : null;
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ success: false, message: 'No delivery fields provided.' });
      return;
    }

    const existing = await prisma.customOrder.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = await prisma.customOrder.update({ where: { id }, data });

    // Notify customer if status actually changed (and they have an email on file).
    const statusChanged = data.deliveryStatus && data.deliveryStatus !== existing.deliveryStatus;
    if (statusChanged && order.customerEmail) {
      try {
        const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
        const storeName = settings?.storeName || 'ইচ্ছে ঘুড়ি — Ische Ghuree';
        const { html, text } = renderDeliveryStatusUpdate({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          newStatus: order.deliveryStatus,
          previousStatus: existing.deliveryStatus,
          deliveryProvider: order.deliveryProvider,
          trackingUrl: order.trackingUrl,
          deliveryNote: order.deliveryNote,
          storeName,
          supportPhone: settings?.supportPhone || settings?.contactPhone,
          supportEmail: settings?.supportEmail || settings?.contactEmail,
        });
        await sendMail({
          to: order.customerEmail,
          subject: `Delivery update — ${order.orderNumber} — ${order.deliveryStatus}`,
          html,
          text,
          fromName: storeName,
        });
      } catch (mailErr) {
        console.error('Delivery status email failed:', mailErr);
      }
    }

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_CUSTOM_ORDER_DELIVERY',
      entity: 'CustomOrder',
      entityId: order.id,
      details: {
        from: existing.deliveryStatus,
        to: order.deliveryStatus,
        provider: order.deliveryProvider,
        hasTrackingUrl: !!order.trackingUrl,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update CustomOrder delivery error:', error);
    res.status(500).json({ success: false, message: 'Failed to update delivery info' });
  }
};

export const updateCustomOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, notes } = req.body || {};
    const valid = ['PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!valid.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value.' });
      return;
    }

    const data: any = { status };
    if (notes !== undefined) data.notes = notes ? String(notes) : null;

    const order = await prisma.customOrder.update({ where: { id }, data });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_CUSTOM_ORDER_STATUS',
      entity: 'CustomOrder',
      entityId: order.id,
      details: { status, notes: notes ? 'updated' : undefined },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update CustomOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

export const deleteCustomOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.customOrder.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    await prisma.customOrder.delete({ where: { id } });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_CUSTOM_ORDER',
      entity: 'CustomOrder',
      entityId: id,
      details: { orderNumber: order.orderNumber },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Delete CustomOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};
