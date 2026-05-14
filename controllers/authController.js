const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
   try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists'});

        const user = await User.create({ username, email, password });

        const { accessToken, refreshToken  } = generateToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ 
            accessToken, 
            refreshToken, 
            user: { id: user._id, username: user.username }
        });
   } catch (err) {
    res.status(500).json({ error: err.message});
   }
};

const loginUser =async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: 'Invalid email or password'});

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password'});

        const { accessToken, refreshToken } = generateToken(user._id);

        res.status(200).json({
            message: 'login successfull',
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ msg: error.message});
    }
};

const refreshAccessToken = async (req, res) => {
    const { token } = req.body;
    if(!token) return res.status(401).json({ msg: 'refresh token required'});

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ msg: 'invalid refresh token'});
        }

        const tokens = generateToken(user._id);
        res.json({ accessToken: tokens.accessToken});
    } catch (err) {
        return res.status(403).json({ msg: 'Token expired or invalid'});
    }
};

// const getProfile = async (req, res) => {
//     res.status(200).json({
//         success: true,
//         user: req.user
//     });
// };

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.refreshToken = null;
        await user.save();

        res.json({ msg: 'Logged out successfully'});
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    register,
    loginUser,
    refreshAccessToken,
    logout
};