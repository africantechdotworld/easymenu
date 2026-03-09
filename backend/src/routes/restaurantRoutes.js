import express from 'express';
import { getRestaurant, getRestaurants } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurant);

export default router;
