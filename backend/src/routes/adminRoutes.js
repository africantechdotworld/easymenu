import express from 'express';
import { adminLogin, getAllRestaurants, getSystemStats, deleteRestaurant } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Route
router.post('/login', adminLogin);

// Protected Admin Routes
// Note: We'll use the existing protect middleware, but in a real app, we'd add an isAdmin middleware too.
// For now, let's keep it simple as requested.
router.get('/restaurants', protect, getAllRestaurants);
router.get('/stats', protect, getSystemStats);
router.delete('/restaurants/:id', protect, deleteRestaurant);

export default router;
