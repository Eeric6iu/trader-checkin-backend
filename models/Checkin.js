const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, '用户ID是必填项'],
    trim: true
  },
  checkinTime: {
    type: Date,
    required: [true, '打卡时间是必填项'],
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt 字段
});

// 创建索引以优化查询性能
checkinSchema.index({ userId: 1, checkinTime: -1 });

const Checkin = mongoose.model('Checkin', checkinSchema);

module.exports = Checkin;
