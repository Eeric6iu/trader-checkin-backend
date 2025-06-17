const mongoose = require('mongoose');

const morningCheckinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  sleepQuality: [{ type: String }],
  mentalState: [{ type: String }],
  todayGoals: [{ type: String }],
  plannedSymbols: [{ type: String }],
  riskSetup: { type: String },
  unexpectedEvent: { type: String },
  marketView: { type: String },
  declaration: { type: String }
}, { timestamps: true });

const MorningCheckin = mongoose.model('MorningCheckin', morningCheckinSchema);
module.exports = MorningCheckin; 