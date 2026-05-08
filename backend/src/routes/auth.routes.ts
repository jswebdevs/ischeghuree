import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimit';

const router = Router();

// POST /api/auth/login — protected by tight rate limit (env-tunable)
router.post('/login', authLimiter, login);

export default router;
