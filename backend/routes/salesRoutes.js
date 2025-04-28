const express = require('express');
const router = express.Router();
const {addSales, paginatedSales,getAllSales, getSaleById, cancelSale} = require('../controllers/salesController');


router.post('/add', addSales);
router.get('/', paginatedSales);
router.get('/all', getAllSales);
router.get('/:id', getSaleById);
router.put('/:id/cancel', cancelSale);

module.exports = router;
