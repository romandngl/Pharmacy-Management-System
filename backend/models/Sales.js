const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName: { type: String, required: true }, // ✅ Store medicine name
    category: { type: String, required: true }, // ✅ Store category
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    expiryDate: { type: Date }, // ✅ Store expiry date
    quantitySold: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    status: { type: String, enum: ['sold', 'cancelled', 'pending'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sales', salesSchema);
