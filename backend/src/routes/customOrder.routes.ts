import { Router } from 'express';
import {
  createCustomOrder,
  listCustomOrders,
  listMyCustomOrders,
  getCustomOrder,
  updateCustomOrderStatus,
  updateCustomOrderDelivery,
  deleteCustomOrder,
} from '../controllers/customOrder.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { writeLimiter } from '../middlewares/rateLimit';

const router = Router();

// Public intake — writeLimiter keeps abuse from filling the DB/inbox.
router.post('/', writeLimiter, createCustomOrder);

// Customer-scoped (any logged-in user sees orders matching their email)
router.get('/mine', protect, listMyCustomOrders);

router.get('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), listCustomOrders);

// Single-order detail: customer can read their own (controller checks email match);
// admins can read any. No authorize() here — the access check lives in the controller.
router.get('/:id', protect, getCustomOrder);

router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCustomOrderStatus);
router.patch('/:id/delivery', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCustomOrderDelivery);
router.delete('/:id', protect, authorize('SUPER_ADMIN'), deleteCustomOrder);

export default router;
