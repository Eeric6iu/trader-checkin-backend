const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'STREAK_3_DAYS',    // 连续打卡3天
      'STREAK_7_DAYS',    // 连续打卡7天
      'STREAK_30_DAYS',   // 连续打卡30天
      'TOTAL_10_TIMES',   // 累计打卡10次
      'TOTAL_100_TIMES',  // 累计打卡100次
      'FIRST_CHECKIN',    // 首次打卡
      'FULL_ATTENDANCE',  // 早晚盘全勤
      'COMEBACK',         // 连续未打卡3天后重新打卡
      'POINTS_500'        // 达成积分500分
    ]
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  unlockDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 只保留userId+type唯一索引
achievementSchema.index({ userId: 1, type: 1 }, { unique: true });

// 成就配置
const ACHIEVEMENT_CONFIG = {
  STREAK_3_DAYS: {
    name: '初露锋芒',
    desc: '连续打卡3天，展现你的坚持！',
    icon: 'badge-fire-1'
  },
  STREAK_7_DAYS: {
    name: '持之以恒',
    desc: '连续打卡7天，你正在养成好习惯！',
    icon: 'badge-fire-2'
  },
  STREAK_30_DAYS: {
    name: '坚持不懈',
    desc: '连续打卡30天，你已经成为打卡达人！',
    icon: 'badge-fire-3'
  },
  TOTAL_10_TIMES: {
    name: '小有所成',
    desc: '累计打卡10次，继续加油！',
    icon: 'badge-star-1'
  },
  TOTAL_100_TIMES: {
    name: '百炼成钢',
    desc: '累计打卡100次，你已经是打卡专家！',
    icon: 'badge-star-2'
  },
  FIRST_CHECKIN: {
    name: '初次见面',
    desc: '完成首次打卡，开启你的打卡之旅！',
    icon: 'badge-first'
  },
  FULL_ATTENDANCE: {
    name: '全勤达人',
    desc: '早晚盘全勤，展现你的专业态度！',
    icon: 'badge-perfect'
  },
  COMEBACK: {
    name: '王者归来',
    desc: '连续未打卡3天后重新打卡，欢迎回来！',
    icon: 'badge-comeback'
  },
  POINTS_500: {
    name: '积分达人',
    desc: '达成500积分，你的努力得到了回报！',
    icon: 'badge-points'
  }
};

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = {
  Achievement,
  ACHIEVEMENT_CONFIG
}; 