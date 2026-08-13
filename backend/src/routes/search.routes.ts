// src/routes/search.routes.ts
import { Router } from 'express';
import { globalSearch } from '../controllers/search.controller';
import { optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/search?q=something
// optionalAuth so admins can find DRAFT/ARCHIVED products; guests cannot.
router.get('/', optionalAuth, globalSearch);

export default router;