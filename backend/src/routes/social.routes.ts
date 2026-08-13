import { Router } from 'express';
import { 
  getPublicSocialLinks, 
  getAllSocialLinks, 
  createSocialLink, 
  updateSocialLink, 
  deleteSocialLink 
} from '../controllers/social.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route for the storefront
router.get('/', getPublicSocialLinks);

// Protected Admin Routes
router.get('/admin', protect, authorize('SUPER_ADMIN', 'ADMIN'), getAllSocialLinks);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createSocialLink);
router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateSocialLink);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteSocialLink);

export default router;