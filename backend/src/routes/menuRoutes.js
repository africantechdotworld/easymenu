import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Categories
router.get('/:restaurantId/categories', getCategories);
router.post('/categories', protect, upload.single('image'), createCategory);
router.put('/categories/:id', protect, upload.single('image'), updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

// Items
router.get('/categories/:categoryId/items', getMenuItems);
router.post('/items', protect, upload.single('image'), createMenuItem);
router.put('/items/:id', protect, upload.single('image'), updateMenuItem);
router.delete('/items/:id', protect, deleteMenuItem);

export default router;
