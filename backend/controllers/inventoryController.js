const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');

const createNotification = async (userId, message, relatedType, relatedId) => {
    try {
        const user = await User.findOne({ role: userId }); // Assuming 'admin' is a role
        if (!user) throw new Error(`User with role '${userId}' not found`);

        await Notification.create({
            userId: user._id,
            message,
            relatedType,
            relatedId
        });
    } catch (err) {
        console.error('Error creating notification:', err.message);
    }
};


const getMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = 5
        const skip = limit ? (page - 1) * limit : 0; // Skip calculation

        if (medicineId) {
            // Fetch single medicine with category name
            const medicine = await Medicine.findById(medicineId).populate('category', 'name');
            if (!medicine) {
                return res.status(404).json({ message: 'Medicine not found' });
            }
            return res.status(200).json({ message: 'Medicine retrieved successfully', medicine });
        }

        // Fetch all medicines with category names, supporting dynamic pagination
        let medicinesQuery = Medicine.find({ isDeleted: false }).populate('category', 'name');
        if (limit) {
            medicinesQuery = medicinesQuery.skip(skip).limit(limit);
        }
        const medicines = await medicinesQuery;
        const totalMedicines = await Medicine.countDocuments({ isDeleted: false });
        const totalPages = limit ? Math.ceil(totalMedicines / limit) : 1;

        res.status(200).json({
            message: 'Medicines retrieved successfully',
            currentPage: page,
            totalPages,
            medicines
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Add New Medicine
const addMedicine = async (req, res) => {
    try {
        const { name, category, reorderLevel, price } = req.body;

        if (!price || price <= 0) {
            return res.status(400).json({ message: 'Valid price is required' });
        }

        let medicine = await Medicine.findOne({ name, category });

        if (medicine) {
            return res.status(400).json({ message: 'Medicine already exists' });
        }

        medicine = new Medicine({ name, category, reorderLevel, price });
        await medicine.save();

        const notificationMessage = `New medicine ${name} added to the inventory.`;
        await createNotification('admin', notificationMessage, 'medicine', medicine._id);

        res.status(201).json({ message: 'Medicine added', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Soft Delete Medicine
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

        const notificationMessage = `Medicine ${medicine.name} has been deleted (soft delete).`;
        await createNotification('admin', notificationMessage, 'medicine', medicine._id);

        res.json({ message: 'Medicine deleted (soft delete)', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Edit Medicine
const editMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const { name, reorderLevel, price } = req.body; // ❌ Removed category from request body

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // ✅ Update only the allowed fields
        if (name) medicine.name = name;
        if (reorderLevel !== undefined) medicine.reorderLevel = reorderLevel;
        if (price !== undefined && price > 0) medicine.price = price;

        await medicine.save();

        const notificationMessage = `Medicine ${medicine.name} has been updated.`;
        await createNotification('admin', notificationMessage, 'medicine', medicine._id);

        res.json({ message: 'Medicine updated successfully', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateMedicineCategory = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({ message: 'categoryId is required' });
        }

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        medicine.category = categoryId;
        await medicine.save();

        res.json({ message: 'Medicine category updated successfully', medicine });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all medicine names
const getMedicineNames = async (req, res) => {
    try {
        const medicineNames = await Medicine.distinct('name');
        const medicineCount = await Medicine.countDocuments({ isDeleted: false });
        res.json({ message: 'All medicine names', medicineNames, medicineCount });
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

        const notificationMessage = `Medicine ${medicine.name} added to inventory with quantity ${quantity}.`;
        await createNotification('admin', notificationMessage, 'inventory', inventoryItem._id);

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

        await inventory.save();

        const notificationMessage = `Inventory for medicine updated: ${inventory.medicine.name}, quantity now ${inventory.quantity}.`;
        await createNotification('admin', notificationMessage, 'inventory', inventory._id);
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

        const notificationMessage = `Reorder needed for medicine: ${medicine.name}. Current stock is below reorder level.`;
        await createNotification('admin', notificationMessage, 'medicine', medicine._id);

        res.json({ message: `Reorder needed for ${medicine.name}, please place an order.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Generate Stock Report
const generateStockReport = async (req, res) => {
    try {
        const { status: statusFilter } = req.params; // Get status from URL params
        const inventory = await Inventory.find()
            .populate({
                path: 'medicine',
                populate: { path: 'category', select: 'name' }
            });

        if (inventory.length === 0) {
            return res.status(404).json({ message: 'No inventory records found' });
        }

        // Calculate the status based on expiry date
        const currentDate = new Date();

        const updatedInventory = inventory.map(item => {
            const expiryDate = new Date(item.expiryDate);
            const timeDiff = expiryDate - currentDate; // Time difference in milliseconds
            const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert time difference to days

            let status = "low-priority"; // Default status

            if (daysRemaining < 0) {
                status = "expired"; // If expired
            } else if (daysRemaining <= 90) {
                status = "high-priority"; // If expiry date within 3 months
            } else if (daysRemaining <= 180) {
                status = "med-priority"; // If expiry date within 6 months
            }

            // Add status to the inventory item
            return {
                ...item.toObject(), // Convert Mongoose document to plain object
                status
            };
        });

        // If a status filter is provided, filter inventory by status
        let filteredInventory = updatedInventory;
        if (statusFilter) {
            filteredInventory = updatedInventory.filter(item => item.status === statusFilter);
        }

        // If no records match the filter
        if (filteredInventory.length === 0) {
            return res.status(404).json({ message: `No inventory records found with status: ${statusFilter}` });
        }

        res.json({ message: 'Stock Report Generated', inventory: filteredInventory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const generateDetailedStockReport = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = 2
        const skip = limit ? (page - 1) * limit : 0; // Calculate skip value

        // Aggregate inventory data
        let inventoryAggregation = Inventory.aggregate([
            {
                $group: {
                    _id: "$medicine",
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        // Apply pagination if limit is provided
        if (limit) {
            inventoryAggregation = inventoryAggregation.skip(skip).limit(limit);
        }

        const inventory = await inventoryAggregation;

        if (inventory.length === 0) {
            return res.status(404).json({ message: "No inventory records found" });
        }

        // Get total count (without pagination)
        const totalRecords = await Inventory.countDocuments();
        const totalPages = limit ? Math.ceil(totalRecords / limit) : 1;

        // Populate Medicine details
        const report = await Medicine.populate(inventory, { path: "_id", select: "name category" });

        res.json({
            message: "Detailed Stock Report Generated",
            currentPage: page,
            totalPages,
            totalRecords,
            report
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    addMedicine,
    getMedicine,
    deleteMedicine,
    editMedicine,
    updateMedicineCategory,
    getMedicineNames,

    addToInventory,
    updateInventory,
    reorderMedicine,
    generateStockReport,
    generateDetailedStockReport
};
