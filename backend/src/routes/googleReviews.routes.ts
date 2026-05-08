import { Router } from 'express';
import { getGoogleReviews } from '../controllers/googleReviews.controller';

const router = Router();

router.get('/', getGoogleReviews);

export default router;
