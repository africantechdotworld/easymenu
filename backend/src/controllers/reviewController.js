import Review from '../models/Review.js';

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
export const getRestaurantReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurantId: req.params.restaurantId, menuItemId: { $exists: false } }).sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get reviews for a menu item
// @route   GET /api/reviews/item/:menuItemId
// @access  Public
export const getItemReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ menuItemId: req.params.menuItemId }).sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Public
export const addReview = async (req, res) => {
    try {
        const { restaurantId, menuItemId, userName, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const review = await Review.create({
            restaurantId,
            menuItemId: menuItemId || undefined,
            userName: userName || 'Anonymous',
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
