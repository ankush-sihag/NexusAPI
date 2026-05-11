const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
   try {
        const { username, email, password } = req.body;

        const user = await User.create({ username, email, password });

        const { accessToken, refreshToken  } = generateTokens(user._id);

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


const refresh = async (req, res) => {
    const { token } = req.body;
    if(!token) return res.status(401).json({ msg: 'refresh token required'});

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ msg: 'invalid refresh token'});
        }

        const tokens = generateTokens(user._id);
        res.json({ accessToken: tokens.accessToken});
    } catch (err) {
        return res.status(403).json({ msg: 'Token expired or invalid'});
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        user.refreshToken = null;
        await user.save();

        res.json({ msg: 'Logged out successfully'});
    } catch (err) {
        res.status(500).send('Server Error');
    }
};