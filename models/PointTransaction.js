const mongoose = require('mongoose');

/**
 * 积分明细模型
 * 用于记录用户的每一笔积分收入
 */
const pointTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['morning', 'evening', 'bonus'], required: true },
  points: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PointTransaction', pointTransactionSchema); 