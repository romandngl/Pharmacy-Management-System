const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:categoryId', getCategoryById);
router.post('/', addCategory);
router.put('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
