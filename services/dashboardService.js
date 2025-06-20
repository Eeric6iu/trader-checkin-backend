const User = require('../models/User');
const MorningCheckin = require('../models/MorningCheckin');
const EveningCheckin = require('../models/EveningCheckin');
const { getValidCheckinDates, calculateStreaks } = require('./checkinService');
const { getCommunityQualifications } = require('./communityService');

/**
 * 获取用户看板的聚合数据
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>}
 */
async function getUserDashboardData(userId) {
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  
  const [
    user,
    morningCheckin,
    eveningCheckin,
    allTimeValidDates,
    communityQualifications
  ] = await Promise.all([
    User.findOne({ userId }).select('nickname points unlockedBadges').lean(),
    MorningCheckin.findOne({ userId, date: { $gte: todayStart } }).lean(),
    EveningCheckin.findOne({ userId, date: { $gte: todayStart } }).lean(),
    getValidCheckinDates(userId, new Date(0), new Date()),
    getCommunityQualifications(userId)
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  const { currentStreak, maxStreak } = calculateStreaks(allTimeValidDates);
  
  const qualifiedCommunities = communityQualifications.filter(c => c.qualified).map(c => c.name);
  const nextTier = communityQualifications.find(c => !c.qualified);

  return {
    userInfo: {
      userId: userId,
      nickname: user.nickname
    },
    points: user.points,
    badges: user.unlockedBadges,
    community: {
      qualified: qualifiedCommunities,
      nextTier: nextTier ? nextTier.name : null,
      progress: nextTier ? `${nextTier.userDays}/${nextTier.daysRequired}` : '已解锁所有社区'
    },
    todayCheckin: {
      morning: !!morningCheckin,
      evening: !!eveningCheckin
    },
    checkinStats: {
      currentStreak,
      maxStreak
    }
  };
}

module.exports = { getUserDashboardData }; 