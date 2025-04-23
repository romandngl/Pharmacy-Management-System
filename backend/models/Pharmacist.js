const mongoose = require('mongoose');
const User = require('./User'); // Import User model

const pharmacistSchema = new mongoose.Schema({
    medicalHistory: [{ type: String }],
}, { timestamps: true });

module.exports = User.discriminator('Pharmacist', pharmacistSchema);

