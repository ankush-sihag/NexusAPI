const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const protect = require('../middleware/auth');

const {
    uploadMedia
} = require('../controllers/mediaController');

router.post(
    '/upload',
    protect,
    upload.single('image'),
    uploadMedia
);

module.exports = router;