const express = require('express');
const router = express.Router();
const {addSales, getAllSales, getSaleById, cancelSale} = require('../controllers/salesController');


router.post('/add', addSales);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.put('/:id/cancel', cancelSale);

module.exports = router;
