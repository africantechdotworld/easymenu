import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Restaurant from '../models/Restaurant.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new restaurant
// @route   POST /api/auth/register
// @access  Public
export const registerRestaurant = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if restaurant exists
        const restaurantExists = await Restaurant.findOne({ email });
        if (restaurantExists) {
            return res.status(400).json({ message: 'Restaurant already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create restaurant
        const restaurant = await Restaurant.create({
            name,
            email,
            password: hashedPassword,
        });

        if (restaurant) {
            res.status(201).json({
                _id: restaurant.id,
                name: restaurant.name,
                email: restaurant.email,
                token: generateToken(restaurant._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid restaurant data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a restaurant
// @route   POST /api/auth/login
// @access  Public
export const loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;

        const restaurant = await Restaurant.findOne({ email });

        if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
            res.json({
                _id: restaurant.id,
                name: restaurant.name,
                email: restaurant.email,
                token: generateToken(restaurant._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current restaurant profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.restaurantId).select('-password');
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Check if there are uploaded files
        if (req.files) {
            if (req.files.logoUrl && req.files.logoUrl[0]) {
                updates.logoUrl = `/uploads/${req.files.logoUrl[0].filename}`;
            }
            if (req.files.bannerUrl && req.files.bannerUrl[0]) {
                updates.bannerUrl = `/uploads/${req.files.bannerUrl[0].filename}`;
            }
        }

        // Prevents updating of sensitive auth data
        delete updates.password;
        delete updates.email;

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.restaurantId,
            updates,
            { new: true }
        ).select('-password');

        res.json(updatedRestaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
