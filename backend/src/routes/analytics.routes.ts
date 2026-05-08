import { Router } from 'express';
import { getDashboardOverview, getChartData } from '../controllers/analytics.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/overview', getDashboardOverview);
router.get('/chart-data', getChartData);

export default router;
