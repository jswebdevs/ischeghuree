import { Router } from 'express';
import { 
  registerUser, 
  verifyEmail, 
  sendPhoneOtp, 
  verifyPhoneOtp, 
  updateProfile, 
  uploadAvatar,
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
  getMe,
  getAllAdmins,
  getAdminByUsername,
  createAdminAccount,
  updateAdminAccount,
  getUsersByRole
} from '../controllers/user.controller';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware'; // <-- Add optionalAuth
import { writeLimiter } from '../middlewares/rateLimit';
import { upload } from '../config/upload';

const router = Router();

// writeLimiter: each registration sends a verification email — keep abuse
// from burning the shop's Gmail quota.
router.post('/register', writeLimiter, registerUser);
router.get('/verify-email/:token', verifyEmail);

router.get('/me', protect, getMe);

// SUPER-ADMIN: STAFF MANAGEMENT ROUTES
router.get('/admins', protect, authorize('SUPER_ADMIN'), getAllAdmins);
router.get('/role/:role', protect, authorize('SUPER_ADMIN'), getUsersByRole);
router.get('/admins/:username', protect, authorize('SUPER_ADMIN'), getAdminByUsername);
router.post('/admins', protect, authorize('SUPER_ADMIN'), createAdminAccount);
router.patch('/admins/:id', protect, authorize('SUPER_ADMIN'), updateAdminAccount);



// --- CHANGED to optionalAuth ---
router.post('/send-otp', optionalAuth, sendPhoneOtp);
router.post('/verify-otp', optionalAuth, verifyPhoneOtp);

router.patch('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createUser);
router.get('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), getAllUsers);
router.get('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), getUserById);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteUser);

export default router;