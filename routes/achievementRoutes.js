const express = require('express');
const router = express.Router();
const { getUserAchievements } = require('../controllers/achievementController');

// 获取用户成就列表
router.get('/', getUserAchievements);

module.exports = router; 