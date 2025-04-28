const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsernames, getPaginatedPatients } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsernames);
router.get('/users/patients', getPaginatedPatients);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
