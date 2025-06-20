const MorningCheckin = require('../models/MorningCheckin');
const EveningCheckin = require('../models/EveningCheckin');

/**
 * 获取指定时间范围内的有效打卡日期数组
 * @param {string} userId - 用户ID
 * @param {Date} from - 开始日期
 * @param {Date} to - 结束日期
 * @returns {Promise<Date[]>} - 返回有效打卡日的Date对象数组
 */
async function getValidCheckinDates(userId, from, to) {
  const [morningCheckins, eveningCheckins] = await Promise.all([
    MorningCheckin.find({ userId, date: { $gte: from, $lte: to } }).select('date').lean(),
    EveningCheckin.find({ userId, date: { $gte: from, $lte: to } }).select('date').lean()
  ]);

  const dateSet = new Set();
  morningCheckins.forEach(c => dateSet.add(c.date.toISOString().slice(0, 10)));
  eveningCheckins.forEach(c => dateSet.add(c.date.toISOString().slice(0, 10)));

  return Array.from(dateSet).map(d => new Date(d)).sort((a, b) => a - b);
}

/**
 * 计算连续打卡天数
 * @param {Date[]} validDates - 有效打卡日期数组 (已排序)
 * @returns {{currentStreak: number, maxStreak: number}}
 */
function calculateStreaks(validDates) {
  if (!validDates.length) return { currentStreak: 0, maxStreak: 0 };
  
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (let i = 0; i < validDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const diff = (validDates[i] - validDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  }

  // 检查当前连续天数是否从今天或昨天开始
  const today = new Date();
  today.setHours(0,0,0,0);
  const lastCheckinDate = validDates[validDates.length - 1];
  const diffFromToday = (today - lastCheckinDate) / (1000 * 60 * 60 * 24);

  if (diffFromToday > 1) {
    currentStreak = 0; // 如果最后一次打卡在昨天之前，则当前连续中断
  }

  return { currentStreak, maxStreak };
}

module.exports = { getValidCheckinDates, calculateStreaks }; 