const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Upload = require('../models/Upload');


// Dashbaord
router.post('/dashboard', async (req, res) => {
    try {
        // count of uploads
        const uploads = await Upload.countDocuments();
        // count of users
        const users = await User.countDocuments();
        res.json({ status: "success", message: "Dashboard data", data: { uploads, users } });

    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
});




module.exports = router;
