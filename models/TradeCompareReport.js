const mongoose = require('mongoose');

const tradeCompareReportSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  plan: { type: Object, required: true },
  trades: [{ type: Object }],
  analysis: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

tradeCompareReportSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TradeCompareReport', tradeCompareReportSchema); 