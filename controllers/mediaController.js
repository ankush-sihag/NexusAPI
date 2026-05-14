const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            ImageUrl: req.file.path,
            uploadedBy: req.user._id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadMedia
};