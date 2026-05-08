import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductFilters
} from '../controllers/product.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// --- PUBLIC ROUTES (No Lock) ---
router.get('/', getProducts);
router.get('/filters/options', getProductFilters);
router.get('/:slug', getProductBySlug);



router.post(
  '/',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  createProduct
);

router.patch(
  '/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteProduct
);

export default router;