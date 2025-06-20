const communityService = require('../services/communityService');

/**
 * @description 获取用户的社区解锁资格
 * @route GET /api/community/qualification
 */
exports.getUserQualifications = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const qualifications = await communityService.getCommunityQualifications(userId);
    res.json({ success: true, communities: qualifications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 