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
        const { medicineId, quantity, expiryDate} = req.body; // ✅ expiryDate added

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

        // Create inventory entry with expiry date
        const inventoryItem = new Inventory({ medicine: medicineId, quantity, expiryDate});
        await inventoryItem.save();

        res.status(201).json({ message: 'Medicine added to inventory', inventoryItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Update Inventory Stock

const updateInventory = async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const { medicineId, quantity, expiryDate } = req.body;

        // console.log(`Updating inventory: inventoryId=${inventoryId}, medicineId=${medicineId}, quantity=${quantity}, expiryDate=${expiryDate}`);

        // Find the inventory record
        const inventory = await Inventory.findOne({ _id: inventoryId, medicine: medicineId });
        if (!inventory) {
            console.log('Inventory record not found');
            return res.status(404).json({ message: 'Inventory record not found' });
        }

        console.log(`Current inventory found: ${JSON.stringify(inventory)}`);

        // Update only provided fields
        if (quantity !== undefined) {
            inventory.quantity = quantity;
        }
        if (expiryDate !== undefined) {
            inventory.expiryDate = expiryDate;
        }

        // Check if at least one field is being updated
        if (quantity === undefined && expiryDate === undefined) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        await inventory.save();
        console.log(`Updated inventory: ${JSON.stringify(inventory)}`);

        // Only update stock level if quantity was changed
        if (quantity !== undefined) {
            const totalStock = await Inventory.aggregate([
                { $match: { medicine: medicineId } },
                { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
            ]);

            const stockLevel = totalStock.length > 0 ? totalStock[0].totalQuantity : 0;
            // console.log(`Updated stock level for medicineId=${medicineId}: ${stockLevel}`);

            await Medicine.findByIdAndUpdate(medicineId, { stockLevel });
        }

        res.json({ message: 'Inventory updated successfully', inventory });
    } catch (error) {
        // console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Reorder Medicine (if stock is low)
const reorderMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;

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
