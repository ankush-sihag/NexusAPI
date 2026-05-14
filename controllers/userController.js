const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -refreshToken')
            .populate('posts');

        if (!user) return res.status(404).json({ msg: 'User not found'});

        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = { getProfile };