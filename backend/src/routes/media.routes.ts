import { Router } from 'express';
import { 
  createMedia, 
  getAllMedia, 
  getMediaById, 
  updateMedia, 
  deleteMedia 
} from '../controllers/media.controller';
import { upload } from '../config/upload'; 
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Read operations
router.get('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), getAllMedia);
router.get('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), getMediaById);

// Bulk upload (expects 'files' array in FormData)
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), upload.array('files'), createMedia);

// Single update/replace
router.patch('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('file'), updateMedia);

// Bulk delete (expects { ids: [...] } in request body)
router.delete('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteMedia);

export default router;