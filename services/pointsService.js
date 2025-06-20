const User = require('../models/User');
const PointTransaction = require('../models/PointTransaction');
const MorningCheckin = require('../models/MorningCheckin');
const EveningCheckin = require('../models/EveningCheckin');

/**
 * 为用户打卡添加积分
 * @param {string} userId - 用户ID
 * @param {'morning' | 'evening'} checkinType - 打卡类型
 * @param {Date} date - 打卡日期
 */
async function addPointsForCheckin(userId, checkinType, date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  let pointsToAdd = 2;
  let bonusPoints = 0;

  // 检查是否需要发放额外奖励
  if (checkinType === 'morning') {
    const evening = await EveningCheckin.findOne({ userId, date: day });
    if (evening) bonusPoints = 1;
  } else { // evening checkin
    const morning = await MorningCheckin.findOne({ userId, date: day });
    if (morning) bonusPoints = 1;
  }

  // 更新用户总积分并记录明细
  const totalPoints = pointsToAdd + bonusPoints;
  await User.updateOne({ userId: userId }, { $inc: { points: totalPoints } });
  
  const transactions = [{ userId, date, type: checkinType, points: pointsToAdd }];
  if (bonusPoints > 0) {
    transactions.push({ userId, date, type: 'bonus', points: bonusPoints });
  }
  await PointTransaction.insertMany(transactions);
}

module.exports = { addPointsForCheckin }; 