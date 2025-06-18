const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

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