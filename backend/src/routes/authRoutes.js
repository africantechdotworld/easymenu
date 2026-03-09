import express from 'express';
import { registerRestaurant, loginRestaurant, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerRestaurant);
router.post('/login', loginRestaurant);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.fields([{ name: 'logoUrl', maxCount: 1 }, { name: 'bannerUrl', maxCount: 1 }]), updateProfile);

export default router;
