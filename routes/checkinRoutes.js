const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

// 创建打卡记录
router.post('/checkin', checkinController.createCheckin);
// 查询用户的打卡记录
router.get('/checkin', checkinController.getUserCheckins);

// 新增：早盘/交易前打卡
router.post('/morning-checkin', checkinController.createMorningCheckin);
// 新增：收盘/夜间打卡
router.post('/evening-checkin', checkinController.createEveningCheckin);
// 新增：查询某用户当天所有打卡信息
router.get('/checkin-by-date', checkinController.getUserCheckinByDate);
// 新增：查询早盘打卡列表
router.get('/morning-checkin', checkinController.getMorningCheckins);
// 新增：查询夜间打卡列表
router.get('/evening-checkin', checkinController.getEveningCheckins);

router.get('/stats', checkinController.getCheckinStats);

module.exports = router; 