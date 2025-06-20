const mongoose = require('mongoose');

/**
 * 晚盘打卡模型
 */
const eveningCheckinSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  singleTrade: { type: String, enum: ['是', '否'] },
  plannedSymbolOnly: { type: String, enum: ['是', '否'] },
  lotSizeOk: { type: String, enum: ['是', '否'] },
  emotionTrade: { type: String, enum: ['有', '没有'] },
  missedOpportunity: { type: String, enum: ['是', '否'] },
  selfDisciplineOk: { type: String, enum: ['是', '否'] },
  reflection: { type: String },
  selfRating: { type: Number, min: 1, max: 5 },
  reminderTomorrow: { type: String }
}, { timestamps: true });

eveningCheckinSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('EveningCheckin', eveningCheckinSchema); 