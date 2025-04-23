const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, getAppointmentById } = require('../controllers/appointmentController');

router.post('/', createAppointment);

router.get('/', getAppointments);

router.get('/:id',getAppointmentById);

module.exports = router;
