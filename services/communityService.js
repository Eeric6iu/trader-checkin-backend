const { getValidCheckinDates } = require('./checkinService');

const COMMUNITY_TIERS = [
  { name: 'VIP社区', daysRequired: 365 },
  { name: '200天社区', daysRequired: 200 },
  { name: '100天社区', daysRequired: 100 },
  { name: '60天社区', daysRequired: 60 },
  { name: '30天社区', daysRequired: 30 },
];

/**
 * 获取用户的社区资格
 * @param {string} userId - 用户ID
 * @returns {Promise<Object[]>}
 */
async function getCommunityQualifications(userId) {
  const totalValidDays = (await getValidCheckinDates(userId, new Date(0), new Date())).length;

  return COMMUNITY_TIERS.map(tier => ({
    name: tier.name,
    qualified: totalValidDays >= tier.daysRequired,
    daysRequired: tier.daysRequired,
    userDays: totalValidDays
  }));
}

module.exports = { getCommunityQualifications, COMMUNITY_TIERS }; 