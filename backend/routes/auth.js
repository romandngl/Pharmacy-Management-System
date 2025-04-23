const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsernames } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsernames);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
