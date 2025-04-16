const mongoose = require('mongoose');
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

const addSales = async (req, res) => {
    const session = await mongoose.startSession(); // 🛑 Start a transaction session
    session.startTransaction();

    try {
        const { sales } = req.body;

        if (!Array.isArray(sales) || sales.length === 0) {
            return res.status(400).json({ message: 'Invalid sales data' });
        }

        let salesRecords = [];

        for (const sale of sales) {
            const { medicineId, inventoryId, quantitySold } = sale;

            // 🔍 Fetch the medicine with price
            const medicine = await Medicine.findById(medicineId).session(session);
            if (!medicine) {
                throw new Error(`Medicine not found for ID: ${medicineId}`);
            }

            // 🔍 Find the inventory with enough stock
            const inventory = await Inventory.findOne({
                _id: inventoryId,
                medicine: medicineId,
                quantity: { $gte: quantitySold }
            }).session(session);

            if (!inventory) {
                throw new Error(`Not enough stock in inventory for medicine: ${medicine.name}. Available stock: ${inventory ? inventory.quantity : 0}`);
            }

            // 📉 Deduct stock
            inventory.quantity -= quantitySold;
            await inventory.save({ session });

            // 💰 Calculate total price dynamically
            const totalPrice = quantitySold * medicine.price;

            // 🏷 Store medicine details in sales record
            const newSale = new Sales({
                medicine: medicine._id,
                medicineName: medicine.name,
                category: medicine.category,
                pricePerUnit: medicine.price, // ✅ Ensure Medicine schema has this field
                inventoryId: inventory._id,
                expiryDate: inventory.expiryDate,
                quantitySold,
                totalPrice,
                saleDate: new Date(),
                status: "sold"
            });

            await newSale.save({ session });
            salesRecords.push(newSale);
        }

        // ✅ Commit transaction
        await session.commitTransaction();
        res.status(201).json({ message: 'Sales recorded successfully', salesRecords });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Server error', error: error.message });

    } finally {
        session.endSession(); // ✅ Ensure session ends properly
    }
};

// ✅ Get All Sales with Medicine & Inventory Info
const getAllSales = async (req, res) => {
    try {
        const sales = await Sales.find()
            .populate({
                path: 'medicine',
                select: 'name category',
                populate: { path: 'category', select: 'name' } // ✅ Fetch category name correctly
            })
            .populate('inventoryId', 'expiryDate quantity'); // ✅ Get expiry date and quantity

        res.status(200).json({ message: 'Sales retrieved successfully', sales });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get Single Sale by ID
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sales.findById(id)
            .populate({
                path: 'medicine',
                select: 'name category',
                populate: { path: 'category', select: 'name' } // ✅ Fetch category name correctly
            })
            .populate('inventoryId', 'expiryDate quantity');

        if (!sale) {
            return res.status(404).json({ message: 'Sale record not found' });
        }

        res.status(200).json({ message: 'Sale retrieved successfully', sale });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const cancelSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { saleId } = req.params;

        const sale = await Sales.findById(saleId).session(session);
        if (!sale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Sale not found' });
        }

        if (sale.status === 'cancelled') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Sale is already cancelled' });
        }

        const inventory = await Inventory.findById(sale.inventoryId).session(session);
        if (!inventory) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Inventory record not found' });
        }

        inventory.quantity += sale.quantitySold;
        await inventory.save({ session });

        sale.status = 'cancelled';
        await sale.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Sale cancelled successfully, inventory restocked', sale });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error cancelling sale:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addSales,
    getAllSales,
    getSaleById,
    cancelSale
};
