const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional, if it's user-specific
    message: { type: String, required: true },
    type: { type: String, enum: ['sale', 'inventory', 'reorder', 'system','appointment', 'medicine']},
    isRead: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g. sales/inventory id for linking
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
