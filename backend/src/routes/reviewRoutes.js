import express from 'express';
import { getRestaurantReviews, getItemReviews, addReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.get('/item/:menuItemId', getItemReviews);
router.post('/', addReview);

export default router;
