const mongoose = require('mongoose');

/**
 * 勋章定义模型
 * 用于存储所有可解锁的勋章及其条件
 */
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "7天勋章"
  description: { type: String, required: true }, // e.g., "累计有效打卡7天"
  condition: {
    type: { type: String, enum: ['CUMULATIVE_DAYS'], required: true }, // 条件类型
    value: { type: Number, required: true } // 条件值, e.g., 7
  }
});

// 初始化勋章数据
const Badge = mongoose.model('Badge', badgeSchema);
Badge.countDocuments().then(count => {
  if (count === 0) {
    const badges = [
      { name: '7天勋章', description: '累计有效打卡7天', condition: { type: 'CUMULATIVE_DAYS', value: 7 } },
      { name: '30天勋章', description: '累计有效打卡30天', condition: { type: 'CUMULATIVE_DAYS', value: 30 } },
      { name: '60天勋章', description: '累计有效打卡60天', condition: { type: 'CUMULATIVE_DAYS', value: 60 } },
      { name: '100天勋章', description: '累计有效打卡100天', condition: { type: 'CUMULATIVE_DAYS', value: 100 } },
      { name: '200天勋章', description: '累计有效打卡200天', condition: { type: 'CUMULATIVE_DAYS', value: 200 } },
      { name: '365天勋章', description: '累计有效打卡365天', condition: { type: 'CUMULATIVE_DAYS', value: 365 } },
    ];
    Badge.insertMany(badges).then(() => console.log('Badges initialized.'));
  }
});

module.exports = Badge; 