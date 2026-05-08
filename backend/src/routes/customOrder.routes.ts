import { Router } from 'express';
import {
  createCustomOrder,
  listCustomOrders,
  listMyCustomOrders,
  getCustomOrder,
  updateCustomOrderStatus,
  deleteCustomOrder,
} from '../controllers/customOrder.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createCustomOrder);

// Customer-scoped (any logged-in user sees orders matching their email)
router.get('/mine', protect, listMyCustomOrders);

router.get('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), listCustomOrders);
router.get('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), getCustomOrder);
router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCustomOrderStatus);
router.delete('/:id', protect, authorize('SUPER_ADMIN'), deleteCustomOrder);

export default router;
