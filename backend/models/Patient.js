const mongoose = require('mongoose');
const User = require('./User');

const patientSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
}, { timestamps: true });

module.exports = User.discriminator('Patient', patientSchema);