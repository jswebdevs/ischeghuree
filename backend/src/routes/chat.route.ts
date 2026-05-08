import { Router } from 'express';
import { 
  getAllSessions, 
  getSessionHistory, 
  updateSessionStatus,
  bulkUpdateSessionStatus,
  adminSendMessage
} from '../controllers/chat.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// 🛡️ All routes require Admin privileges
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Bulk operations (Must come before /:id routes to prevent express from mistaking 'bulk' for an ID)
router.patch('/sessions/bulk', bulkUpdateSessionStatus);

// Fetching Data
router.get('/sessions', getAllSessions);
router.get('/sessions/:id/messages', getSessionHistory);

// Single Session Actions
router.patch('/sessions/:id/status', updateSessionStatus);
router.post('/sessions/:id/messages', adminSendMessage);

export default router;