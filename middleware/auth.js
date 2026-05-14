const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.id;
            next();
        } catch (error) {
            res.status(500).json({ msg: 'Not authorized, token failed'})
        }
    }
    if (!token) {
        res.status(401).json({ msg: 'Not authoeized, no token'})
    }
};

module.exports = protect;
