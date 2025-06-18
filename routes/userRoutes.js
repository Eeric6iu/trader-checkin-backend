const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 邮箱注册
router.post('/register', userController.registerUser);
// 邮箱登录
router.post('/login', userController.loginUser);
// 查询用户成长激励信息
router.get('/growth', userController.getUserGrowth);

module.exports = router; 