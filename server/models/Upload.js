const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    file: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Upload', uploadSchema);
