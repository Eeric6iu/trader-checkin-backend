const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievementId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  condition: { type: String }, // 例如 'streak:7' 表示连续7天
  reward: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema); 