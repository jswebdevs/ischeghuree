import { Router } from 'express';
import { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory,
  getCategoryBySlug
} from '../controllers/category.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public: View categories (e.g., for the navbar)
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin Only: Manage categories
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createCategory);
router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);

export default router;