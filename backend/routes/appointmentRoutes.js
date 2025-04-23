const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, getAppointmentById, completeAppointment, cancelAppointment, getAppointmentsByStatus } = require('../controllers/appointmentController');

router.post('/', createAppointment);

router.get('/', getAppointments);

router.get('/:id',getAppointmentById);

router.put('/:id/complete', completeAppointment);

router.put('/:id/cancel', cancelAppointment);

router.get('/status/:status', getAppointmentsByStatus);

module.exports = router;