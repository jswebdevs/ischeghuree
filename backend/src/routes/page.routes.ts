import { Router } from 'express';
import {
  createPage,
  getAllPages,
  getPageBySlug,
  updatePage,
  deletePage
} from '../controllers/page.controller';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// --- Public Routes ---
// Use optionalAuth so admins can list/preview DRAFT pages, but guests cannot
router.get('/', optionalAuth, getAllPages);
router.get('/:slug', optionalAuth, getPageBySlug);

// --- Protected/Admin Routes ---
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createPage);
router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updatePage);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deletePage);

export default router;