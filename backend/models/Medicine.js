const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    stockLevel: { type: Number, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Medicine', medicineSchema);