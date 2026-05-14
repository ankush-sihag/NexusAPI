const express = require('express');
const router = express.Router();

const {
    register,
    loginUser,
    refreshAccessToken,
    logout
} = require('../controllers/authController');

const { getProfile } = require('../controllers/userController');

const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.get('/profile', protect, getProfile);
router.post('/logout',protect, logout);

module.exports = router;