const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, getAppointmentById, getAppointmentsByUserId, completeAppointment, cancelAppointment, getAppointmentsByStatus } = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/', getAppointments);

router.get('/user/:userId', getAppointmentsByUserId);
router.get('/status/:status', getAppointmentsByStatus);
router.get('/:id', getAppointmentById);                

router.put('/:id/complete', completeAppointment);
router.put('/:id/cancel', cancelAppointment);


module.exports = router;