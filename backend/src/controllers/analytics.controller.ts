import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDashboardOverview = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      totalCategories,
    ] = await Promise.all([
      prisma.customOrder.count(),
      prisma.customOrder.count({ where: { status: 'PENDING' } }),
      prisma.customOrder.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.customOrder.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count({ where: { roles: { has: 'CUSTOMER' } } }),
      prisma.product.count(),
      prisma.category.count(),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        totalCustomers,
        totalProducts,
        totalCategories,
      },
    });
  } catch (error) {
    console.error('Dashboard Overview Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard overview' });
  }
};

export const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    // Clamp so non-numeric input can't produce an Invalid Date (500).
    const safeDays = Math.min(Math.max(Number(days) || 30, 1), 365);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - safeDays);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.customOrder.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    });

    const buckets = new Map<string, { date: string; totalOrders: number; completedOrders: number }>();
    for (let i = 0; i <= safeDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, { date: key, totalOrders: 0, completedOrders: 0 });
    }

    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const b = buckets.get(key);
      if (!b) continue;
      b.totalOrders += 1;
      if (o.status === 'COMPLETED') b.completedOrders += 1;
    }

    res.json({ success: true, data: Array.from(buckets.values()) });
  } catch (error) {
    console.error('Chart Data Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
  }
};
