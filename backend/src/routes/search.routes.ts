// src/routes/search.routes.ts
import { Router } from 'express';
import { globalSearch } from '../controllers/search.controller';

const router = Router();

// GET /api/v1/search?q=something
router.get('/', globalSearch);

export default router;