const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), async (req, res) => {
  try {
    const profile = req.user;
    // Find or create user
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails && profile.emails[0] && profile.emails[0].value ? profile.emails[0].value : '',
        nickname: profile.displayName || 'Google用户',
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value ? profile.photos[0].value : ''
      });
    }
    // 生成JWT
    const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign({ userId: user.userId, email: user.email, nickname: user.nickname }, SECRET, { expiresIn: '7d' });
    user.lastLogin = new Date();
    await user.save();
    res.json({
      success: true,
      message: 'google 登录成功',
      data: {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.facebookCallback);

// Apple OAuth（如需可补充）

// Email/Password Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;