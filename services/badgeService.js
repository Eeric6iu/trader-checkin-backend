const User = require('../models/User');
const Badge = require('../models/Badge');
const { getValidCheckinDates } = require('./checkinService');

/**
 * 检查并解锁用户勋章
 * @param {string} userId - 用户ID
 */
async function checkAndUnlockBadges(userId) {
  const user = await User.findOne({ userId: userId }).select('unlockedBadges');
  if (!user) return;

  const unlockedBadgeNames = new Set(user.unlockedBadges.map(b => b.name));
  
  const allBadges = await Badge.find().lean();
  const totalValidDays = (await getValidCheckinDates(userId, new Date(0), new Date())).length;

  for (const badge of allBadges) {
    if (!unlockedBadgeNames.has(badge.name) && totalValidDays >= badge.condition.value) {
      await User.updateOne(
        { userId: userId },
        { $push: { unlockedBadges: { name: badge.name, unlockedAt: new Date() } } }
      );
    }
  }
}

module.exports = { checkAndUnlockBadges }; 