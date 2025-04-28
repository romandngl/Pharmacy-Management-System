const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addMedicine, getMedicine, deleteMedicine, editMedicine, getMedicineNames, addToInventory, updateMedicineCategory, updateInventory, deleteInventory, reorderMedicine, generateStockReport, generateDetailedStockReport } = require('../controllers/inventoryController');

router.put('/medicine/:medicineId/category', updateMedicineCategory);
router.put('/medicine/:medicineId', editMedicine);
router.get('/medicine/:medicineId?', getMedicine);
router.delete('/medicine/:medicineId', deleteMedicine);
router.post('/medicine/add', addMedicine);
router.get('/medicines', getMedicineNames);


router.put('/inventory/:inventoryId', updateInventory);
router.delete('/inventory/:inventoryId', deleteInventory );
router.post('/inventory/reorder', reorderMedicine);
router.get('/inventory/report/:status?', generateStockReport);
router.get('/inventory/details', generateDetailedStockReport);
router.post('/inventory', addToInventory);

module.exports = router;

