const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create a new project (adding this for convenience so we have something to test with)
router.post('/', async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
