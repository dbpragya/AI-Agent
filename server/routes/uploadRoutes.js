const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');

// Register
router.post('/upload', async (req, res) => {
    try {
        const { projectName, description, file } = req.body;

        if (!projectName || !description || !file) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        let upload = await Upload.findOne({ projectName });
        if (upload) return res.status(400).json({ message: 'Project already exists' });


        upload = new Upload({
            projectName,
            description,
            file
        });

        await upload.save();

        res.json({ status: "success", message: "Project uploaded successfully", data: upload });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
