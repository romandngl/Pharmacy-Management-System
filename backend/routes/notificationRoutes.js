const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    markAsRead,
    deleteNotification,
    getNotificationsForPharmacist,
    getAllNotificationsForAdmin
} = require('../controllers/notificationController');

router.get('/admin', getAllNotificationsForAdmin);
router.get('/pharmacist', getNotificationsForPharmacist);
router.get('/:userId', getUserNotifications);
router.put('/read/:notificationId', markAsRead);
router.delete('/:notificationId', deleteNotification);

module.exports = router;
