const mongoose = require('mongoose');
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

const addSales = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sales } = req.body;

        if (!Array.isArray(sales) || sales.length === 0) {
            return res.status(400).json({ message: 'Invalid sales data' });
        }

        let salesRecords = [];

        for (const sale of sales) {
            const { medicineId, inventoryId, quantitySold } = sale;

            const medicine = await Medicine.findById(medicineId).populate('category', 'name');
            if (!medicine) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Medicine not found for ID: ${medicineId}` });
            }

            const inventory = await Inventory.findOne({
                _id: inventoryId,
                medicine: medicineId,
                quantity: { $gte: quantitySold }
            }).session(session);

            if (!inventory) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: `Not enough stock for medicine: ${medicine.name}. Available stock: ${inventory?.quantity || 0}`
                });
            }

            inventory.quantity -= quantitySold;
            await inventory.save({ session });

            const totalPrice = quantitySold * medicine.price;

            const newSale = new Sales({
                medicine: medicine._id,
                medicineName: medicine.name,
                category: medicine.category.name,
                inventoryId: inventory._id,
                expiryDate: inventory.expiryDate,
                quantitySold,
                totalPrice,
                saleDate: new Date(),
                status: 'sold'
            });

            await newSale.save({ session });
            salesRecords.push(newSale);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Sales recorded successfully', salesRecords });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error recording sales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getAllSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = 5
        const skip = limit ? (page - 1) * limit : 0; // Calculate skip value

        let salesQuery = Sales.find()
            .populate({
                path: 'medicine',
                select: 'name category',
                populate: { path: 'category', select: 'name' } 
            })
            .populate('inventoryId', 'expiryDate quantity');

        if (limit) {
            salesQuery = salesQuery.skip(skip).limit(limit);
        }

        const sales = await salesQuery;

        if (sales.length === 0) {
            return res.status(404).json({ message: "No sales records found" });
        }

        // Get total count (without pagination)
        const totalSales = await Sales.countDocuments();
        const totalPages = limit ? Math.ceil(totalSales / limit) : 1;

        res.status(200).json({
            message: "Sales retrieved successfully",
            currentPage: page,
            totalPages,
            totalSales,
            sales
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sales.findById(id)
            .populate({
                path: 'medicine',
                select: 'name category',
                populate: { path: 'category', select: 'name' } // Populate category details
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
