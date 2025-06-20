const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

/**
 * @description 获取用户的社区解锁资格
 * @route GET /api/community/qualification
 */
router.get('/qualification', communityController.getUserQualifications);

module.exports = router; 