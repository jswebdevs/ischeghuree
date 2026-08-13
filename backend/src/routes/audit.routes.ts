import { Router } from 'express';
import { getAuditLogs, getAuditLogById, deleteAuditLog, deleteAllAuditLogs } from '../controllers/audit.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);

// Delete routes restricted to SUPER_ADMIN only
router.delete('/all', authorize('SUPER_ADMIN'), deleteAllAuditLogs);
router.delete('/:id', authorize('SUPER_ADMIN'), deleteAuditLog);

export default router;
