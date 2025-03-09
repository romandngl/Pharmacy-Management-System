const express = require('express');
const router = express.Router();
const { addMedicine, getMedicine, deleteMedicine, editMedicine, addToInventory, updateInventory, reorderMedicine, generateStockReport } = require('../controllers/inventoryController');

router.post('/medicine', addMedicine);
router.get('/medicine/:id?', getMedicine);
router.delete('/medicine/:id', deleteMedicine);
router.put('/medicine/:id', editMedicine);
router.post('/inventory', addToInventory);
router.put('/inventory/:id', updateInventory);
router.post('/inventory/reorder', reorderMedicine);
router.get('/inventory/report', generateStockReport);

module.exports = router;

