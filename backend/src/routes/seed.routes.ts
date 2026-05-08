import { Router } from 'express';
import prisma from '../config/prisma';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Demo data seeding is destructive-adjacent (creates rows on every call) and
// must never be reachable by anonymous traffic. SUPER_ADMIN only.
router.post('/seed-demo', protect, authorize('SUPER_ADMIN'), async (_req, res) => {
  try {
    const cat = await prisma.category.upsert({
      where: { slug: 'charms' },
      update: {},
      create: {
        name: 'Charms',
        slug: 'charms',
        description: 'Handcrafted purse charms and chains.',
      },
    });

    const products = [
      {
        name: 'Heart of Gold Charm',
        slug: 'heart-of-gold-charm',
        productCode: 'CHM-001',
        material: 'Gold-plated brass',
        priceMin: 25,
        priceMax: 45,
        priceNote: 'Price varies by size and finish',
        tags: ['Heart', 'Gold', 'Classic'],
        shortDesc: 'Signature heart charm with crystal accents.',
      },
      {
        name: 'Mini Purse Charm',
        slug: 'mini-purse-charm',
        productCode: 'CHM-002',
        material: 'Resin & metal',
        priceMin: 30,
        priceMax: 55,
        tags: ['Purse', 'Quirky'],
        shortDesc: 'A miniature purse-shaped charm in multiple colorways.',
      },
      {
        name: 'Initial Letter Charm',
        slug: 'initial-letter-charm',
        productCode: 'CHM-003',
        material: 'Crystal & gold',
        priceMin: 20,
        priceMax: 35,
        tags: ['Initial', 'Custom'],
        shortDesc: 'Personalized letter charm — pick any initial.',
      },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          ...p,
          categories: { connect: { id: cat.id } },
          productStatus: 'ACTIVE',
        },
      });
    }

    res.json({ success: true, message: 'Demo charms seeded successfully.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
