const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');

const createNotification = async (userId, message, type = 'appointment', relatedId = null) => {
    try {
        await Notification.create({
            userId,
            message,
            type,
            relatedId
        });
    } catch (err) {
        console.error('Error creating notification:', err.message);
    }
};

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

        await createNotification(
            newAppointment.patient.toString(),
            `Your appointment has been scheduled for ${date} at ${time}.`,
            'appointment',
            newAppointment._id
        );

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10

        const skip = (page - 1) * limit;

        const appointments = await Appointment.find()
            .sort({ createdAt: -1 }) 
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

const getAppointmentsByUserId = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.userId }).populate('patient', '-password');
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this user" });
        }
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'canceled' }, { new: true });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        await createNotification(
            appointment.patient,
            `Your appointment scheduled for ${appointment.date} at ${appointment.time} has been canceled.`,
            'appointment',
            appointment._id
        );

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const completeAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status: 'completed' }, 
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        await createNotification(
            appointment.patient,
            `Your appointment scheduled for ${appointment.date} at ${appointment.time} has been completed.`,
            'appointment',
            appointment._id
        );

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAppointmentsByStatus = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10
        const skip = limit ? (page - 1) * limit : 0;
        const status = req.params.status;

        let appointmentsQuery = Appointment.find({ status });

        if (limit) {
            appointmentsQuery = appointmentsQuery.skip(skip).limit(limit);
        }

        const [appointments, totalAppointments] = await Promise.all([
            Appointment.find({ status }).skip(skip).limit(limit),
            Appointment.countDocuments({ status })
        ]);

        const totalPages = Math.ceil(totalAppointments / limit);

        res.status(200).json({
            message: `Appointments retrieved successfully by status ${status}`,
            page,
            totalPages,
            totalAppointments,
            appointments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    getAppointmentsByUserId,
    completeAppointment,
    cancelAppointment,
    getAppointmentsByStatus
};
