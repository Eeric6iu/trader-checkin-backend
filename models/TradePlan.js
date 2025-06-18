const mongoose = require('mongoose');

const tradePlanSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  symbols: [{ type: String }],
  lots: { type: Number },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

tradePlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TradePlan', tradePlanSchema); 