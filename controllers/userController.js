const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const PointTransaction = require('../models/PointTransaction');
const Badge = require('../models/Badge');
const { getUserDashboardData } = require('../services/dashboardService');

// 查询用户成长激励信息
exports.getUserGrowth = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: '请提供用户ID', data: null });
    }
    const user = await User.findOne({ userId }).populate('achievements');
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在', data: null });
    }
    res.json({
      success: true,
      message: '查询成功',
      data: {
        streak: user.streak,
        points: user.points,
        achievements: user.achievements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '查询失败', data: null });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const [user, history] = await Promise.all([
      User.findOne({ userId: userId }).select('points').lean(),
      PointTransaction.find({ userId }).sort({ createdAt: -1 }).limit(100).lean()
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, points: user.points, history });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUnlockedBadges = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const [user, allBadges] = await Promise.all([
      User.findOne({ userId: userId }).select('unlockedBadges').lean(),
      Badge.find().lean()
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, badges: user.unlockedBadges, allBadges });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const dashboardData = await getUserDashboardData(userId);
    res.json({ success: true, data: dashboardData });
  } catch (err) {
    const statusCode = err.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
}; 