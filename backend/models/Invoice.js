const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    sales: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Invoice', invoiceSchema);