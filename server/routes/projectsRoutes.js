const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');

router.get('/', async (req, res) => {
    try {
        const uploads = await Upload.find();
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const formattedUploads = uploads.map(upload => ({
            id: upload._id,
            projectName: upload.projectName || "",
            description: upload.description || "",
            file: upload.file ? `${baseUrl}/${upload.file.replace(/\\/g, '/')}` : null,
            createdAt: upload.createdAt
        }));

        res.json({ status: "success", message: "All Projects Fetched Successfully", data: formattedUploads });
    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
});

module.exports = router;