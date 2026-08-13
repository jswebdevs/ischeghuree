import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  getHomepageConfig,
  updateHomepageSection,
} from '../controllers/settings.controller';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────
// optionalAuth populates req.user if a valid token is present; the
// controller then includes secret fields only for admins, strips for
// everyone else (storefront, guests).
router.get('/homepage', getHomepageConfig);
router.get('/', optionalAuth, getSettings);

// ── Admin routes ───────────────────────────────────────────────────────────
router.patch('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateSettings);

// Patch a single homepage section key without overwriting the others
router.patch('/homepage/:section', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateHomepageSection);

export default router;
