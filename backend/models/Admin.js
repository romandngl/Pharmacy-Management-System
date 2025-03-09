const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  }, { timestamps: true });
  
  module.exports = User.discriminator('Admin', adminSchema);