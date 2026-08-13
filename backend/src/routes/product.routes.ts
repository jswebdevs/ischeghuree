import { Router } from 'express';
import multer from 'multer';
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductFilters,
} from '../controllers/product.controller';
import {
  upload3dModel,
  delete3dModel,
  uploadTurntableFrames,
  deleteTurntableFrames,
} from '../controllers/productMedia.controller';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// 3D models are larger than ordinary images; turntable frames are images but
// we may receive 24–36 of them in one request. Both use memory storage so the
// stream goes straight to Cloudinary.
const upload3d = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB per .glb
});

const upload360 = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 48 }, // 5 MB per frame, up to 48 frames
});

// --- PUBLIC ROUTES ---
// optionalAuth lets logged-in admins see DRAFT/ARCHIVED products; guests
// and customers only ever get published ones (filtered in the controller).
router.get('/', optionalAuth, getProducts);
router.get('/filters/options', getProductFilters);
router.get('/:slug', optionalAuth, getProductBySlug);

router.post(
  '/',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  createProduct
);

router.patch(
  '/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteProduct
);

// --- 3D model (.glb / .gltf) ---
router.post(
  '/:id/model3d',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload3d.single('file'),
  upload3dModel
);
router.delete(
  '/:id/model3d',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  delete3dModel
);

// --- 360° turntable frames (ordered image sequence) ---
router.post(
  '/:id/turntable',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload360.array('frames', 48),
  uploadTurntableFrames
);
router.delete(
  '/:id/turntable',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteTurntableFrames
);

export default router;
