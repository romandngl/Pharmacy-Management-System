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
        const limit = 10;
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
            totalRecords: totalMedicines,
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

        let medicine = await Medicine.findOne({ name });

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
        const { name, reorderLevel, price } = req.body;

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
        const medicines = await Medicine.find({ isDeleted: false });
        res.json({ message: 'All medicines', medicines });
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

const deleteInventory = async (req, res) => {
    try {
        const { inventoryId } = req.params;

        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory record not found' });
        }

        const medicineId = inventory.medicine;

        await Inventory.findByIdAndDelete(inventoryId);

        const totalStock = await Inventory.aggregate([
            { $match: { medicine: medicineId } },
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);

        const stockLevel = totalStock.length > 0 ? totalStock[0].totalQuantity : 0;
        await Medicine.findByIdAndUpdate(medicineId, { stockLevel });

        const notificationMessage = `Inventory entry deleted for medicine. New stock level: ${stockLevel}.`;
        await createNotification('admin', notificationMessage, 'inventory', inventoryId);

        res.json({ message: 'Inventory deleted successfully' });
    } catch (error) {
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
        const { status: statusFilter } = req.params;
        const { page, limit = 10 } = req.query;

        const inventory = await Inventory.find()
            .populate({
                path: 'medicine',
                populate: { path: 'category', select: 'name' }
            });

        if (inventory.length === 0) {
            return res.status(404).json({ message: 'No inventory records found' });
        }

        const currentDate = new Date();

        const updatedInventory = inventory.map(item => {
            const expiryDate = new Date(item.expiryDate);
            const timeDiff = expiryDate - currentDate;
            const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));

            let status = "low-priority";

            if (daysRemaining < 0) {
                status = "expired";
            } else if (daysRemaining <= 90) {
                status = "high-priority";
            } else if (daysRemaining <= 180) {
                status = "med-priority";
            }

            return {
                ...item.toObject(),
                status
            };
        });

        let filteredInventory = updatedInventory;
        if (statusFilter) {
            filteredInventory = updatedInventory.filter(item => item.status === statusFilter);
        }

        if (filteredInventory.length === 0) {
            return res.status(404).json({ message: `No inventory records found with status: ${statusFilter}` });
        }

        if (page) {
            const pageNumber = parseInt(page);
            const startIndex = (pageNumber - 1) * limit;
            const endIndex = startIndex + parseInt(limit);
            const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

            return res.json({
                message: 'Stock Report Generated',
                totalRecords: filteredInventory.length,
                page: pageNumber,
                totalPages: Math.ceil(filteredInventory.length / limit),
                inventory: paginatedInventory
            });
        } else {
            // If no page is specified, return all data
            return res.json({
                message: 'Stock Report Generated',
                totalRecords: filteredInventory.length,
                inventory: filteredInventory
            });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const generateDetailedStockReport = async (req, res) => {
    try {
        // Aggregate inventory data without pagination
        const inventoryAggregation = await Inventory.aggregate([
            {
                $group: {
                    _id: "$medicine",
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        if (inventoryAggregation.length === 0) {
            return res.status(404).json({ message: "No inventory records found" });
        }

        // Populate Medicine details
        const report = await Medicine.populate(inventoryAggregation, { path: "_id", select: "name category" });

        res.json({
            message: "Detailed Stock Report Generated",
            totalRecords: report.length,
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
    deleteInventory,
    reorderMedicine,
    generateStockReport,
    generateDetailedStockReport
};
