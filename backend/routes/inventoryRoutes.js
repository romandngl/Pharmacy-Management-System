const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addMedicine, getMedicine, deleteMedicine, editMedicine, addToInventory, updateInventory, reorderMedicine, generateStockReport } = require('../controllers/inventoryController');

router.put('/medicine/:medicineId', editMedicine);
router.get('/medicine/:medicineId?', getMedicine);
router.delete('/medicine/:medicineId', deleteMedicine);
router.post('/medicine/add', addMedicine);
router.put('/inventory/:medicineId', updateInventory);
router.post('/inventory/reorder', reorderMedicine);
router.get('/inventory/report', generateStockReport);
router.post('/inventory', addToInventory);

module.exports = router;

