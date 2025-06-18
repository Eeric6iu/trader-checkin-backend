const mongoose = require('mongoose');

const tradeHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  account: { type: String, required: true },
  platform: { type: String, enum: ['MT4', 'MT5'], required: true },
  orderId: { type: String, required: true },
  symbol: { type: String, required: true },
  lots: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  openTime: { type: Date, required: true },
  closeTime: { type: Date },
  profit: { type: Number },
  raw: { type: Object }
}, { timestamps: true });

tradeHistorySchema.index({ userId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('TradeHistory', tradeHistorySchema); 