const express = require('express');
const router = express.Router();
const tradeCompareController = require('../controllers/tradeCompareController');

router.post('/generate', tradeCompareController.generateReport);
router.get('/get', tradeCompareController.getReport);

module.exports = router; 