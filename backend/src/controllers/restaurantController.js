import Restaurant from '../models/Restaurant.js';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get restaurant details (public)
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).select('-password -email');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all active restaurants (for testing or landing page discovery)
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select('-password -email');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
