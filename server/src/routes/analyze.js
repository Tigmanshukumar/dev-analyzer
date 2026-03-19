const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

router.get('/:username', analyzeController.analyzeProfile);

module.exports = router;
