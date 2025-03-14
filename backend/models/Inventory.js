const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true }
  }, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
