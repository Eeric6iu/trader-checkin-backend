const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// 用户注册接口
exports.registerUser = async (req, res) => {
  try {
    const { email, nickname, password, avatar } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ success: false, message: '邮箱、昵称和密码为必填项', data: null });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ success: false, message: '该邮箱已被注册', data: null });
    }
    const hashed = await hashPassword(password);
    const user = await User.create({ email, nickname, password: hashed, avatar });
    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { userId: user.userId, email: user.email, nickname: user.nickname, avatar: user.avatar },
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: '邮箱或 userId 已存在', data: null });
    } else {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }
};

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

// 邮箱登录
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '邮箱和密码为必填项', data: null });
    }
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误', data: null });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误', data: null });
    }
    const token = generateToken(user);
    user.lastLogin = new Date();
    await user.save();
    res.json({
      success: true,
      message: '登录成功',
      data: { userId: user.userId, email: user.email, nickname: user.nickname, avatar: user.avatar },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
}; 