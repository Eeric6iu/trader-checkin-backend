const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  streak: { type: Number, default: 0 }, // 连续打卡天数
  points: { type: Number, default: 0 }, // 积分
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }], // 成就
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User; 