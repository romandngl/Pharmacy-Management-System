const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');

router.get('/:userId', getUserNotifications);
router.put('/read/:notificationId', markAsRead);
router.delete('/:notificationId', deleteNotification);

module.exports = router;
