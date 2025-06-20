const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * 用户数据模型 User
 */
const userSchema = new mongoose.Schema({
  // 用户邮箱，唯一且必填
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  // 用户昵称，必填
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  // 登录密码，必填
  password: {
    type: String,
    required: true
  },
  // 注册时间，自动生成
  registerDate: {
    type: Date,
    default: Date.now
  },
  // 头像，选填，默认为空
  avatar: {
    type: String,
    default: ''
  },
  // 账号状态，默认 normal，可扩展 blocked 等
  status: {
    type: String,
    enum: ['normal', 'blocked'],
    default: 'normal'
  },
  // 最后登录时间，默认空
  lastLogin: {
    type: Date,
    default: null
  },
  streak: { type: Number, default: 0 }, // 连续打卡天数
  points: { type: Number, default: 0 }, // 积分
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }], // 成就
  userId: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4,
    index: true
  },
  // 第三方登录ID
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  appleId: { type: String, default: null },
  unlockedBadges: [{
    name: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User; 