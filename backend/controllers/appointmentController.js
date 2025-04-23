const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
    try {
        const { patient, date, time } = req.body;

        // Validate patient ID format
        if (!mongoose.Types.ObjectId.isValid(patient)) {
            return res.status(400).json({ error: "Invalid patient ID format" });
        }

        // Check if patient exists
        const existingPatient = await User.findById(patient);
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ error: "The patient you are trying to schedule an appointment for does not exist" });
        }

        const newAppointment = new Appointment({ patient, date, time });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        // Get the 'page' and 'limit' parameters from the query
        const page = parseInt(req.query.page) || 1;
        const limit = 10

        const skip = (page - 1) * limit;

        const appointments = await Appointment.find()
            .skip(skip)
            .limit(limit)
            .populate('patient');

        const totalAppointments = await Appointment.countDocuments();

        res.status(200).json({
            appointments,
            page,
            totalPages: Math.ceil(totalAppointments / limit), // Calculate total pages
            totalAppointments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patient');
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment
};
