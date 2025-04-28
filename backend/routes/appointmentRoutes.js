const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, getAppointmentById, getAppointmentsByUserId, completeAppointment, cancelAppointment, getAppointmentsByStatus } = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/', getAppointments);

router.get('/user/:userId', getAppointmentsByUserId);
router.get('/status/:status', getAppointmentsByStatus); // Put this before /:id
router.get('/:id', getAppointmentById);                 // Keep this at the bottom of the GETs

router.put('/:id/complete', completeAppointment);
router.put('/:id/cancel', cancelAppointment);


module.exports = router;