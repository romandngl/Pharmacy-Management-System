const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addMedicine, getMedicine, deleteMedicine, editMedicine, addToInventory, updateInventory, reorderMedicine, generateStockReport } = require('../controllers/inventoryController');

router.put('/medicine/:medicineId', verifyToken, editMedicine);
router.get('/medicine/:medicineId?', getMedicine);
router.delete('/medicine/:medicineId', verifyToken, deleteMedicine);
router.post('/medicine', verifyToken, addMedicine);
router.put('/inventory/:medicineId', verifyToken, updateInventory);
router.post('/inventory/reorder',verifyToken, reorderMedicine);
router.get('/inventory/report', generateStockReport);
router.post('/inventory', verifyToken, addToInventory);

module.exports = router;

