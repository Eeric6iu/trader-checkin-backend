const User = require('../models/User');
const Achievement = require('../models/Achievement');

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