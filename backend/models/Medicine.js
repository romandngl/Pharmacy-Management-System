const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    reorderLevel: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Medicine', medicineSchema);
