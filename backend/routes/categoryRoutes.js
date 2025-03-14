const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.get('/:categoryId', categoryController.getCategoryById);
router.post('/', categoryController.addCategory);
router.put('/:categoryId', categoryController.updateCategory);
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;
