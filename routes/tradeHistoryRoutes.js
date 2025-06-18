const express = require('express');
const router = express.Router();
const tradeHistoryController = require('../controllers/tradeHistoryController');

router.post('/sync', tradeHistoryController.syncHistory);
router.get('/list', tradeHistoryController.getHistory);

module.exports = router; 