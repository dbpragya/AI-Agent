const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Upload = require('../models/Upload');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload Route (Supports single file upload)
router.post('/', upload.single('file'), async (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    try {
        const { projectName, description } = req.body;

        if (!projectName || !description) {
            return res.status(400).json({ message: 'Project name and description are required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Check if project exists
        let existingProject = await Upload.findOne({ projectName });
        if (existingProject) return res.status(400).json({ message: 'Project already exists' });

        const newUpload = new Upload({
            projectName,
            description,
            file: req.file.path // Storing the file path in DB
        });

        await newUpload.save();

        res.json({ 
            status: "success", 
            message: "Project uploaded successfully", 
            data: newUpload 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
