import { Router } from 'express';
import { 
  getActiveHeroSections, 
  getAllHeroSections, 
  createHeroSection, 
  updateHeroSection, 
  deleteHeroSection 
} from '../controllers/hero.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route for storefront
router.get('/active', getActiveHeroSections);

// Admin routes
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/all', getAllHeroSections);
router.post('/', createHeroSection);
router.patch('/:id', updateHeroSection);
router.delete('/:id', deleteHeroSection);

export default router;
