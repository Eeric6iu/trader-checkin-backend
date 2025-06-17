const mongoose = require('mongoose');

const eveningCheckinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  singleTrade: { type: String },
  plannedSymbolOnly: { type: String },
  lotSizeOk: { type: String },
  emotionTrade: { type: String },
  missedOpportunity: { type: String },
  selfDisciplineOk: { type: String },
  reflection: { type: String },
  selfRating: { type: Number, min: 1, max: 5 },
  reminderTomorrow: { type: String }
}, { timestamps: true });

const EveningCheckin = mongoose.model('EveningCheckin', eveningCheckinSchema);
module.exports = EveningCheckin; 