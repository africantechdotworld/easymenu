import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import MenuCategory from '../models/MenuCategory.js';

// Generate Admin JWT
const generateAdminToken = (id) => {
    return jwt.sign({ id, role: 'system_admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                name: admin.name,
                email: admin.email,
                token: generateAdminToken(admin._id),
                role: 'system_admin'
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Restaurants
// @route   GET /api/admin/restaurants
// @access  Private (Admin Role)
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select('-password').sort({ createdAt: -1 });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get System Stats
// @route   GET /api/admin/stats
// @access  Private (Admin Role)
export const getSystemStats = async (req, res) => {
    try {
        const totalRestaurants = await Restaurant.countDocuments();
        const totalMenuItems = await MenuItem.countDocuments();
        const totalCategories = await MenuCategory.countDocuments();

        res.json({
            totalRestaurants,
            totalMenuItems,
            totalCategories
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a Restaurant
// @route   DELETE /api/admin/restaurants/:id
// @access  Private (Admin Role)
export const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        // Delete all related data
        await Promise.all([
            MenuItem.deleteMany({ restaurantId }),
            MenuCategory.deleteMany({ restaurantId }),
            Restaurant.findByIdAndDelete(restaurantId)
        ]);

        res.json({ message: 'Restaurant and all its data removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
