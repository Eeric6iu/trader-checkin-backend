const mongoose = require('mongoose');
const crypto = require('crypto');

const mtAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  account: { type: String, required: true },
  investorPassword: {
    type: String,
    required: true,
    set: v => crypto.createCipheriv('aes-256-cbc', process.env.SECRET_KEY, process.env.SECRET_IV).update(v, 'utf8', 'hex')
  },
  server: { type: String, required: true },
  platform: { type: String, enum: ['MT4', 'MT5'], required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MTAccount', mtAccountSchema); 