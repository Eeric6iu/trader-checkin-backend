const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// This route has been moved to authRoutes.js
// router.post('/login', userController.loginUser);

// 查询用户成长激励信息
router.get('/growth', userController.getUserGrowth);
router.get('/points', userController.getUserPoints);
router.get('/badges', userController.getUnlockedBadges);
router.get('/dashboard', userController.getUserDashboard);

module.exports = router; 