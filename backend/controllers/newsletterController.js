const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Newsletter = require('../models/Newsletter');
require('dotenv').config();

const {PASSWORD} = process.env;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'k.b.s.tobi@gmail.com',
        pass: PASSWORD
    }
});

const createAndSendNewsletter = async (req, res) => {
    try {
        const { fullName, email, message, relatedType = null, relatedId = null } = req.body;

        if (!fullName || !email || !message) {
            return res.status(400).json({ message: 'Full name, email, and message are required' });
        }

        // Create the notification/newsletter entry in the database
        const notification = await Notification.create({
            userId: null,  // No user associated
            fullName,
            email,
            message,
            relatedType,
            relatedId,
            read: false
        });

        // Send the email to the provided email address
        const mailOptions = {
            from: 'k.b.s.tobi@gmail.com',
            to: email,
            subject: 'New Newsletter',
            text: message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Newsletter email sent to:', email);

        res.json({ message: 'Newsletter created and sent successfully', notification });
    } catch (err) {
        console.error('Error creating and sending newsletter:', err.message);
        res.status(500).json({ message: 'Error creating and sending newsletter', error: err.message });
    }
};

const getAllNewsletters = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        const newsletters = await Newsletter.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalNewsletters = await Newsletter.countDocuments();
        const totalPages = Math.ceil(totalNewsletters / limit);

        res.json({
            message: 'All newsletters fetched successfully',
            currentPage: page,
            totalPages,
            totalNewsletters,
            newsletters
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteNewsletter = async (req, res) => {
    try {
        const { newsletterId } = req.params;

        const deleted = await Newsletter.findByIdAndDelete(newsletterId);  // Delete from Newsletter model
        if (!deleted) return res.status(404).json({ message: 'Newsletter not found' });

        res.json({ message: 'Newsletter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAndSendNewsletter,
    getAllNewsletters,
    deleteNewsletter
};