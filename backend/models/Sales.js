const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantitySold: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    saleDate: { type: Date, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Sales', salesSchema);