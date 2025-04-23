const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    price: { type: Number, required: true },
    stockLevel: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
