const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/hash');

// 通用第三方登录处理
async function handleOAuthLogin(profile, provider, res) {
  try {
    let query = {};
    if (provider === 'google') query = { googleId: profile.id };
    if (provider === 'facebook') query = { facebookId: profile.id };
    if (provider === 'apple') query = { appleId: profile.id };

    let user = await User.findOne(query);
    if (!user) {
      // 自动注册
      user = await User.create({
        email: profile.emails?.[0]?.value || '',
        nickname: profile.displayName || profile.username || '新用户',
        avatar: profile.photos?.[0]?.value || '',
        [`${provider}Id`]: profile.id
      });
    }
    const token = generateToken(user);
    user.lastLogin = new Date();
    await user.save();
    res.json({
      success: true,
      message: `${provider} 登录成功`,
      data: { userId: user.userId, email: user.email, nickname: user.nickname, avatar: user.avatar },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
}

exports.googleCallback = (req, res) => handleOAuthLogin(req.user, 'google', res);
exports.facebookCallback = (req, res) => handleOAuthLogin(req.user, 'facebook', res);
exports.appleCallback = (req, res) => handleOAuthLogin(req.user, 'apple', res);

// Email Registration
exports.register = async (req, res) => {
  try {
    const { email, nickname, password, avatar } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ success: false, message: '邮箱、昵称和密码为必填项' });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ success: false, message: '该邮箱已被注册' });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      userId: email, // Use email as default userId
      email,
      nickname,
      password: hashedPassword,
      avatar
    });
    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { userId: user.userId, email: user.email, nickname: user.nickname, avatar: user.avatar },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Email Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '邮箱和密码为必填项' });
    }
    const user = await User.findOne({ userId: email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      message: '登录成功',
      data: { userId: user.userId, email: user.email, nickname: user.nickname, avatar: user.avatar },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 