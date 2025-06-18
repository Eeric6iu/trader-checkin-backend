const express = require('express');
const router = express.Router();
const mtAccountController = require('../controllers/mtAccountController');

router.post('/bind', mtAccountController.bindAccount);
router.get('/list', mtAccountController.getAccounts);

module.exports = router; 