const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a specific project
router.get('/', async (req, res) => {
    try {
        const { projectId } = req.query;
        let query = {};
        if (projectId) {
            query.projectId = projectId;
        }
        const messages = await Message.find(query).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Save selected text
router.post('/', async (req, res) => {
    const { text, projectId, sourceUrl, pageTitle } = req.body;
    
    if (!text || !projectId) {
        return res.status(400).json({ success: false, message: 'Text and projectId are required' });
    }

    try {
        // Fetch all existing messages in the project to research context
        const projectMessages = await Message.find({ projectId });
        
        let resultText = "New research insight ✅";
        let matchFound = false;
        let matchedContext = null;

        // 1. Check for Exact Match first
        const exactMatch = projectMessages.find(m => m.text.toLowerCase() === text.toLowerCase());
        if (exactMatch) {
            resultText = "Duplicate entry found in project ⚠️";
            matchFound = true;
            matchedContext = exactMatch.text;
        }

        // 2. Deep Context Research: Check for similar concepts if no exact match
        if (!matchFound) {
            const inputWords = new Set(text.toLowerCase().split(/\s+/).filter(w => w.length > 3));
            
            for (const msg of projectMessages) {
                const existingWords = msg.text.toLowerCase().split(/\s+/);
                const overlap = existingWords.filter(w => inputWords.has(w));
                
                // If more than 40% of unique long words overlap, it's a context match
                if (overlap.length / inputWords.size > 0.4) {
                    resultText = `Matched project context! 🧠`;
                    matchedContext = msg.text; 
                    matchFound = true;
                    break;
                }
            }
        }

        const messageObj = new Message({
            text,
            projectId,
            summary: text.length > 50 ? text.substring(0, 47) + '...' : text,
            result: resultText,
            sourceUrl,
            pageTitle,
            matchedContext
        });

        await messageObj.save();
        res.status(201).json({ 
            success: true, 
            message: 'Saved successfully',
            result: resultText,
            matchedContext
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
