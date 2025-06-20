const mongoose = require('mongoose');

/**
 * 早盘打卡模型
 */
const morningCheckinSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  sleepQuality: { type: String, enum: ['很好', '一般', '差'] },
  mentalState: { type: String, enum: ['放松', '紧张', '焦虑', '兴奋'] },
  todayGoals: [{ type: String }], // 可多选
  plannedSymbols: [{ type: String }], // 可多选
  riskSetup: { type: String },
  unexpectedEvent: { type: String, enum: ['有', '无'] },
  marketView: { type: String, enum: ['看多', '看空', '观望', '不确定'] },
  declaration: { type: String }
}, { timestamps: true });

morningCheckinSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MorningCheckin', morningCheckinSchema); 