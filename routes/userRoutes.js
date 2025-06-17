const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 查询用户成长激励信息
router.get('/growth', userController.getUserGrowth);

module.exports = router; 