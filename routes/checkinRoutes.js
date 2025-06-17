const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

// 创建打卡记录
router.post('/checkin', checkinController.createCheckin);
// 查询用户的打卡记录
router.get('/checkin', checkinController.getUserCheckins);

module.exports = router; 