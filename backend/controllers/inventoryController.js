const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

const getMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;

        let medicines;
        if (medicineId) {
            // Get a specific medicine by ID
            medicines = await Medicine.findById(medicineId);
            if (!medicines) {
                return res.status(404).json({ message: 'Medicine not found' });
            }
        } else {
            // Get all medicines (including active ones only, excluding soft deleted)
            medicines = await Medicine.find({ isDeleted: false });
        }

        res.status(200).json({ message: 'Medicines retrieved successfully', medicines });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Add New Medicine
const addMedicine = async (req, res) => {
    try {
        const { name, category, reorderLevel } = req.body;

        let medicine = await Medicine.findOne({ name, category });

        if (medicine) {
            return res.status(400).json({ message: 'Medicine already exists' });
        }

        medicine = new Medicine({ name, category, reorderLevel });
        await medicine.save();

        res.status(201).json({ message: 'Medicine added', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        if (medicine.isDeleted) {
            return res.status(400).json({ message: 'Medicine is already deleted' });
        }

        // Mark medicine as deleted
        medicine.isDeleted = true;
        await medicine.save();

        res.json({ message: 'Medicine deleted (soft delete)', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const editMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const { name, category, reorderLevel } = req.body;

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Update fields
        medicine.name = name || medicine.name;
        medicine.category = category || medicine.category;
        medicine.reorderLevel = reorderLevel || medicine.reorderLevel;

        await medicine.save();

        res.json({ message: 'Medicine updated successfully', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Medicine to Inventory
const addToInventory = async (req, res) => {
    try {
        const { medicineId, quantity, expiryDate, reorderLevel } = req.body; // ✅ expiryDate added

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

        // Create inventory entry with expiry date
        const inventoryItem = new Inventory({ medicine: medicineId, quantity, expiryDate, reorderLevel });
        await inventoryItem.save();

        res.status(201).json({ message: 'Medicine added to inventory', inventoryItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Update Inventory Stock
const updateInventory = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;

        // Find inventory item
        let inventoryItem = await Inventory.findOne({ medicine: medicineId });
        if (!inventoryItem) return res.status(404).json({ message: 'Inventory item not found' });

        // Update quantity
        inventoryItem.quantity = quantity;
        await inventoryItem.save();

        res.json({ message: 'Inventory updated', inventoryItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reorder Medicine (if stock is low)
const reorderMedicine = async (req, res) => {
    try {
        const { medicineId } = req.body;

        let medicine = await Medicine.findById(medicineId);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

        let totalStock = await Inventory.aggregate([
            { $match: { medicine: medicine._id } },
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);

        let currentStock = totalStock.length > 0 ? totalStock[0].totalQuantity : 0;

        if (currentStock >= medicine.reorderLevel) {
            return res.status(400).json({ message: 'Stock level is sufficient, reorder not required' });
        }

        res.json({ message: `Reorder needed for ${medicine.name}, please place an order.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Generate Stock Report
const generateStockReport = async (req, res) => {
    try {
        const inventory = await Inventory.find().populate('medicine');

        if (inventory.length === 0) {
            return res.status(404).json({ message: 'No inventory records found' });
        }

        res.json({ message: 'Stock Report Generated', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addMedicine,
    getMedicine,
    deleteMedicine,
    editMedicine,

    addToInventory,
    updateInventory,
    reorderMedicine,
    generateStockReport,
    
};
