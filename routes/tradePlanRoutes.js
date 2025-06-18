const express = require('express');
const router = express.Router();
const tradePlanController = require('../controllers/tradePlanController');

router.post('/create', tradePlanController.createPlan);
router.get('/get', tradePlanController.getPlan);

module.exports = router; 