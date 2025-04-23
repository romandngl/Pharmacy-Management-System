const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsernames } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsernames);
router.post('/profile', verifyToken, getUserProfile); //this is post pnot get

module.exports = router;
