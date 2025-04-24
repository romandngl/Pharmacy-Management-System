const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: `A user with email ${email} already exists` });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: { message: error.message, stack: error.stack } });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: `No user found with email ${email}` });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Generate JWT token
        const payload = { userId: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: { message: error.message, stack: error.stack } });
    }
};

const getUserProfile = (req, res) => {
    try {
        res.json({ user: req.user }); // User details from token
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const getAllUsernames = async (req, res) => {
    try {
        const users = await User.find({ role: 'patient' }, { name: 1, email: 1, role: 1 }).lean();
        const patients = users.map(user => ({ name: user.name, email: user.email, role: user.role }));
        const count = users.length;
        res.json({ patients, count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: { message: error.message, stack: error.stack } });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsernames };

