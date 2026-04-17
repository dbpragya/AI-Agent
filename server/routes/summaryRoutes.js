const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const Chunk = require('../models/Chunk');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize Transformers.js pipeline (will download model on first run)
let embedder;
const getEmbedder = async () => {
    if (!embedder) {
        const { pipeline } = await import('@xenova/transformers');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return embedder;
};

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

// @route   POST /api/summary/vectorize
// @desc    Convert document to chunks and store as vectors
router.post('/vectorize', async (req, res) => {
    try {
        const { projectId } = req.body;
        const upload = await Upload.findById(projectId);
        if (!upload) return res.status(404).json({ status: "error", message: "Project not found" });

        const filePath = path.join(__dirname, '..', upload.file);
        const text = await extractTextFromFile(filePath, upload);
        
        // 1. Chunking (approx 800 characters per chunk with 100 char overlap)
        const chunkSize = 800;
        const overlap = 100;
        const chunks = [];
        for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
            chunks.push(text.substring(i, i + chunkSize));
        }

        // 2. Generate Embeddings
        const model = await getEmbedder();
        console.log(`Vectorizing ${chunks.length} chunks...`);

        // Clear old chunks for this project
        await Chunk.deleteMany({ projectId });

        for (let i = 0; i < chunks.length; i++) {
            const output = await model(chunks[i], { pooling: 'mean', normalize: true });
            const embedding = Array.from(output.data);
            
            await Chunk.create({
                projectId: upload._id,
                text: chunks[i],
                embedding,
                metadata: { fileName: upload.file, chunkIndex: i }
            });
        }

        res.json({ status: "success", message: `Successfully vectorized into ${chunks.length} chunks.` });
    } catch (err) {
        console.error("Vectorization Error:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @route   POST /api/summary/ask
// @desc    Ask a question about the project document (RAG)
router.post('/ask', async (req, res) => {
    try {
        const { projectId, question } = req.body;
        if (!question) return res.status(400).json({ status: "error", message: "Question is required" });

        const upload = await Upload.findById(projectId);
        if (!upload) return res.status(404).json({ status: "error", message: "Project not found" });

        // 1. Convert question to vector
        const model = await getEmbedder();
        const output = await model(question, { pooling: 'mean', normalize: true });
        const questionEmbedding = Array.from(output.data);

        // 2. Search MongoDB Atlas Vector Index
        const similarChunks = await Chunk.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", // This must match exactly what you created in MongoDB Dashboard
                    "path": "embedding",
                    "queryVector": questionEmbedding,
                    "numCandidates": 100,
                    "limit": 5
                }
            },
            {
                "$match": { "projectId": upload._id }
            },
            {
                "$project": { "text": 1, "score": { "$meta": "vectorSearchScore" } }
            }
        ]);

        const contextText = similarChunks.map(c => c.text).join("\n\n---\n\n");

        // 3. Send Context + Question to Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant answering questions about a project based on its documentation. Use only the provided context to answer. If the answer isn't in the context, say you don't know based on the documents. 
                    
                    Context:
                    ${contextText}`
                },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ 
            status: "success", 
            answer: chatCompletion.choices[0]?.message?.content,
            contextUsed: similarChunks.length 
        });
    } catch (err) {
        console.error("Q&A Error:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Existing routes for Summary and Features
router.post('/', async (req, res) => {
    try {
        const { projectId } = req.body;
        const upload = await Upload.findById(projectId);
        const filePath = path.join(__dirname, '..', upload.file);
        const text = await extractTextFromFile(filePath, upload);
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert project analyst. Summarize this project in 200 words." },
                { role: "user", content: text.substring(0, 30000) }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const summary = chatCompletion.choices[0]?.message?.content;
        upload.summary = summary;
        await upload.save();
        res.json({ status: "success", data: summary });
    } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});

router.post('/features', async (req, res) => {
    try {
        const { projectId } = req.body;
        const upload = await Upload.findById(projectId);
        const filePath = path.join(__dirname, '..', upload.file);
        const text = await extractTextFromFile(filePath, upload);
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "List ONLY major technical module names as a bulleted list." },
                { role: "user", content: text.substring(0, 30000) }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const features = chatCompletion.choices[0]?.message?.content;
        upload.features = features;
        await upload.save();
        res.json({ status: "success", data: features });
    } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});

module.exports = router;
