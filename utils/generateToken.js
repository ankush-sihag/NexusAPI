const jwt = require('jsonwebtoken');

const generateToken = (userId) => {

    const accessToken = jwt.sign(
        { _id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'}
    );

    const refreshToken = jwt.sign(
        { _id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

module.exports = generateToken;