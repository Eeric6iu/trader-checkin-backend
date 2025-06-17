const Checkin = require('../models/Checkin');

// 创建打卡记录
exports.createCheckin = async (req, res) => {
  try {
    const { userId, checkinTime, note } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: '用户ID是必填项', data: null });
    }
    const checkin = new Checkin({ userId, checkinTime: checkinTime || new Date(), note });
    await checkin.save();
    res.status(201).json({ success: true, message: '打卡记录创建成功', data: checkin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '创建打卡记录失败', data: null });
  }
};

// 查询用户的打卡记录
exports.getUserCheckins = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: '请提供用户ID', data: null });
    }
    const checkins = await Checkin.find({ userId }).sort({ checkinTime: -1 }).select('-__v');
    res.json({ success: true, message: '查询成功', data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '查询打卡记录失败', data: null });
  }
}; 