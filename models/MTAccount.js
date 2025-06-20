const mongoose = require('mongoose');
const crypto = require('crypto');

function encryptPassword(v) {
  if (!v || typeof v !== 'string') return v;
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.SECRET_KEY, process.env.SECRET_IV);
    let encrypted = cipher.update(v, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (e) {
    return v; // fallback: 不加密直接存
  }
}

const mtAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  account: { type: String, required: true },
  investorPassword: {
    type: String,
    required: true,
    set: encryptPassword
  },
  server: { type: String, required: true },
  platform: { type: String, enum: ['MT4', 'MT5'], required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MTAccount', mtAccountSchema); 