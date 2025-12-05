const express = require('express');
const router = express.Router();
const { parseTask } = require('../utils/parsing');

// POST /parse-voice
router.post('/', (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) {
            return res.status(400).json({ error: 'Transcript is required' });
        }

        const parsedData = parseTask(transcript);
        res.json(parsedData);
    } catch (error) {
        console.error('Parsing error:', error);
        res.status(500).json({ error: 'Failed to parse transcript' });
    }
});

module.exports = router;
