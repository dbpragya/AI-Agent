const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize Transformers.js pipeline (will download model on first run)


/**
 * Utility to extract text from different file types
 */
const extractTextFromFile = async (filePath, upload) => {
    let fileContent = "";
    const fileExtension = path.extname(filePath).toLowerCase();

    try {
        if (fileExtension === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);
            fileContent = pdfData.text;
        } else if (fileExtension === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            fileContent = result.value;
        } else if (['.xlsx', '.xls'].includes(fileExtension)) {
            const workbook = XLSX.readFile(filePath);
            fileContent = workbook.SheetNames.map(name => {
                const sheet = workbook.Sheets[name];
                return XLSX.utils.sheet_to_txt(sheet);
            }).join('\n');
        } else if (['.txt', '.md', '.js', '.json', '.html', '.css', '.csv'].includes(fileExtension)) {
            fileContent = fs.readFileSync(filePath, 'utf8');
        }
    } catch (parseError) {
        console.error("File parsing error:", parseError);
    }

    return (fileContent || "").trim() || upload.description || "";
};

// @route   GET /api/summary
router.get('/', async (req, res) => {
    try {
        const uploads = await Upload.find();
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const formattedUploads = uploads.map(upload => ({
            ...upload.toObject(),
            summary: upload.summary || "",
            features: upload.features || "",
            projectName: upload.projectName || "",
            description: upload.description || "",
            file: upload.file ? `${baseUrl}/${upload.file.replace(/\\/g, '/')}` : null
        }));

        res.json({ status: "success", message: "Uploads fetched successfully", data: formattedUploads });
    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
});

// Existing routes for Summary and Features
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const upload = await Upload.findById(projectId);
        const filePath = path.join(__dirname, '..', upload.file);
        const text = await extractTextFromFile(filePath, upload);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert project analyst. Summarize this project in 400 words." },
                { role: "user", content: text.substring(0, 30000) }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const summary = chatCompletion.choices[0]?.message?.content;
        upload.summary = summary;
        await upload.save();
        res.json({ status: "success", message: "Summary Generated Successfully", data: summary });
    } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});

router.get('/features/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const upload = await Upload.findById(projectId);
        if (!upload) return res.status(404).json({ status: "error", message: "Project not found" });

        const filePath = path.join(__dirname, '..', upload.file);
        const text = await extractTextFromFile(filePath, upload);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Analyze the project documentation and extract major technical modules. " +
                        "Return ONLY a RAW JSON array of objects. Each object must have: " +
                        "1. 'title': The module name (e.g., 'Authentication Core'). " +
                        "2. 'features': An array of 4-6 specific feature strings. " +
                        "3. 'screensCount': A realistic estimate of unique screens for this module. " +
                        "Return ONLY the JSON array. No markdown, no explanations."
                },
                { role: "user", content: text.substring(0, 30000) }
            ],
            model: "llama-3.3-70b-versatile",
        });

        let featuresRaw = chatCompletion.choices[0]?.message?.content || "[]";
        // Remove potential markdown code blocks
        featuresRaw = featuresRaw.replace(/```json\n?|```/g, "").trim();

        try {
            const features = JSON.parse(featuresRaw);
            upload.features = JSON.stringify(features);
            await upload.save();
            res.json({ status: "success", message: "Features Generated Successfully", data: features });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, featuresRaw);
            res.status(500).json({ status: "error", message: "Failed to parse AI response as JSON" });
        }
    } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});

router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { search } = req.query;
        const upload = await Upload.findById(projectId);

        if (!upload || !upload.file) {
            return res.status(404).json({ status: "error", message: "Project or associated file not found" });
        }

        const filePath = path.join(__dirname, '..', upload.file);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: "error", message: "File not found on server" });
        }

        const text = await extractTextFromFile(filePath, upload);

        if (!text.toLowerCase().includes((search || "").toLowerCase())) {
            return res.status(404).json({ status: "error", message: "CANNOT FIND THIS IN THE DOCUMENT" });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: `You are an expert analyst. If the word "${search}" is found in the documentation, provide a concise explanation (max 50 words) about its context. Start your response with "Yes, found the word: "` },
                { role: "user", content: text.substring(0, 30000) }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const response = chatCompletion.choices[0]?.message?.content;
        res.json({
            status: "success", message: "we found this module in your document",
            data: response
        });

    } catch (err) { res.status(500).json({ status: "error", message: "we cant find this module in your document" }); }
});
module.exports = router;
