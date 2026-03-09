import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';

// ---- CATEGORIES ----

// @desc    Get categories for a restaurant
// @route   GET /api/menu/:restaurantId/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await MenuCategory.find({ restaurantId: req.params.restaurantId }).sort('orderInfo');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new category
// @route   POST /api/menu/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const { name, description, orderInfo } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const category = await MenuCategory.create({
            name,
            description,
            imageUrl,
            orderInfo,
            restaurantId: req.restaurantId,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/menu/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    try {
        const category = await MenuCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (category.restaurantId.toString() !== req.restaurantId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updates = { ...req.body };
        if (req.file) {
            updates.imageUrl = `/uploads/${req.file.filename}`;
        }

        Object.assign(category, updates);
        const updatedCategory = await category.save();

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/menu/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const category = await MenuCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (category.restaurantId.toString() !== req.restaurantId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await MenuCategory.findByIdAndDelete(req.params.id);
        // Also delete associated menu items
        await MenuItem.deleteMany({ categoryId: req.params.id });

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// ---- ITEMS ----

// @desc    Get menu items by category
// @route   GET /api/menu/categories/:categoryId/items
// @access  Public
export const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({ categoryId: req.params.categoryId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an item
// @route   POST /api/menu/items
// @access  Private
export const createMenuItem = async (req, res) => {
    try {
        const { categoryId, name, description, price, tags, isAvailable } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const itemTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

        const item = await MenuItem.create({
            restaurantId: req.restaurantId,
            categoryId,
            name,
            description,
            price: Number(price),
            imageUrl,
            isAvailable: isAvailable !== 'false', // handling string 'false' from formdata
            tags: itemTags,
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an item
// @route   PUT /api/menu/items/:id
// @access  Private
export const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.restaurantId.toString() !== req.restaurantId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, description, price, tags, isAvailable, categoryId } = req.body;

        let imageUrl = item.imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const itemTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : item.tags;

        item.name = name || item.name;
        item.description = description !== undefined ? description : item.description;
        item.price = price ? Number(price) : item.price;
        item.imageUrl = imageUrl;
        item.tags = itemTags;
        item.categoryId = categoryId || item.categoryId;

        // convert string to boolean correctly, since FormData sends strings
        if (isAvailable !== undefined) {
            item.isAvailable = isAvailable === 'true' || isAvailable === true;
        }

        const updatedItem = await item.save();

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an item
// @route   DELETE /api/menu/items/:id
// @access  Private
export const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.restaurantId.toString() !== req.restaurantId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await MenuItem.findByIdAndDelete(req.params.id);

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
