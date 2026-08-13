import { Router } from 'express';
import { 
  getActiveTheme, 
  getPublicThemes,
  getAllThemes, 
  createTheme, 
  updateTheme, 
  deleteTheme, 
  toggleThemeProperty 
} from '../controllers/theme.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// --- PUBLIC (Anyone) ---
router.get('/active', getActiveTheme); // Default site style
router.get('/list', getPublicThemes);   // Options for the user toggle menu

// --- PROTECTED (Admin & SuperAdmin) ---
router.get('/all', protect, authorize('SUPER_ADMIN', 'ADMIN'), getAllThemes);
router.patch('/:id/toggle', protect, authorize('SUPER_ADMIN', 'ADMIN'), toggleThemeProperty);

// --- RESTRICTED (SuperAdmin Only) ---
router.post('/', protect, authorize('SUPER_ADMIN'), createTheme);
router.patch('/:id', protect, authorize('SUPER_ADMIN'), updateTheme);
router.delete('/:id', protect, authorize('SUPER_ADMIN'), deleteTheme);

export default router;