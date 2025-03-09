const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    type: { type: String, required: true },
    generatedDate: { type: Date, required: true },
    content: { type: String, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Report', reportSchema);
  