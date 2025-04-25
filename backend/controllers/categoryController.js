const Medicine = require('../models/Medicine');
const Category = require('../models/Category');

const createNotification = async (userId, message, relatedType, relatedId) => {
    try {
        await Notification.create({
            userId,
            message,
            relatedType,
            relatedId
        });
    } catch (err) {
        console.error('Error creating notification:', err.message);
    }
};

// Get All Categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Single Category
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category retrieved successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a New Category
const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        let existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({ name, description });
        await category.save();

        await createNotification(
            'admin',
            `New category "${name}" has been added.`,
            'category',
            category._id
        );

        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();

        await createNotification(
            'admin',
            `Category "${category.name}" has been updated.`,
            'category',
            category._id
        );

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const defaultCategoryName = "Uncategorized"; 

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let defaultCategory = await Category.findOne({ name: defaultCategoryName });
        if (!defaultCategory) {
            defaultCategory = new Category({
                name: defaultCategoryName,
                description: 'Default category for uncategorized medicines'
            });
            await defaultCategory.save();
        }

        await Medicine.updateMany(
            { category: categoryId },
            { $set: { category: defaultCategory._id } }
        );

        await category.deleteOne();

        await createNotification(
            'admin',
            `Category "${category.name}" has been deleted. Affected medicines moved to "${defaultCategory.name}".`,
            'category',
            categoryId
        );

        res.status(200).json({ message: 'Category deleted successfully, medicines updated to default category' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};
