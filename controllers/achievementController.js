const { Achievement, ACHIEVEMENT_CONFIG } = require('../models/Achievement');
const Checkin = require('../models/Checkin');
const MorningCheckin = require('../models/MorningCheckin');
const EveningCheckin = require('../models/EveningCheckin');
const User = require('../models/User');

// 合并所有打卡记录，按时间排序
async function getAllUserCheckins(userId) {
  // 普通打卡
  const checkins = await Checkin.find({ userId }).select('checkinTime').lean();
  // 早盘打卡
  const morning = await MorningCheckin.find({ userId }).select('date').lean();
  // 晚盘打卡
  const evening = await EveningCheckin.find({ userId }).select('date').lean();
  // 统一格式
  const all = [
    ...checkins.map(c => ({ time: c.checkinTime })),
    ...morning.map(m => ({ time: m.date })),
    ...evening.map(e => ({ time: e.date })),
  ];
  // 按时间升序
  return all.filter(i => i.time).sort((a, b) => new Date(a.time) - new Date(b.time));
}

// 检查并解锁成就
const checkAndUnlockAchievements = async (userId) => {
  try {
    const allCheckins = await getAllUserCheckins(userId);
    if (!allCheckins.length) {
      console.log(`[成就检测] 用户${userId} 没有任何打卡记录`);
      return;
    }
    const user = await User.findOne({ userId });
    if (!user) {
      console.log(`[成就检测] 用户${userId} 不存在`);
      return;
    }

    // 检查首次打卡
    if (allCheckins.length === 1) {
      console.log(`[成就检测] 用户${userId} 首次打卡`);
      await unlockAchievement(userId, 'FIRST_CHECKIN');
    }

    // 检查累计打卡次数
    if (allCheckins.length >= 10) {
      console.log(`[成就检测] 用户${userId} 累计打卡10次`);
      await unlockAchievement(userId, 'TOTAL_10_TIMES');
    }
    if (allCheckins.length >= 100) {
      console.log(`[成就检测] 用户${userId} 累计打卡100次`);
      await unlockAchievement(userId, 'TOTAL_100_TIMES');
    }

    // 检查连续打卡
    let currentStreak = 1;
    let maxStreak = 1;
    let lastCheckinDate = new Date(allCheckins[0].time).toDateString();
    for (let i = 1; i < allCheckins.length; i++) {
      const currentDate = new Date(allCheckins[i].time).toDateString();
      const prevDate = new Date(new Date(lastCheckinDate).getTime() - 24 * 60 * 60 * 1000).toDateString();
      if (currentDate === prevDate) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
      lastCheckinDate = currentDate;
    }
    if (maxStreak >= 3) {
      console.log(`[成就检测] 用户${userId} 连续打卡3天`);
      await unlockAchievement(userId, 'STREAK_3_DAYS');
    }
    if (maxStreak >= 7) {
      console.log(`[成就检测] 用户${userId} 连续打卡7天`);
      await unlockAchievement(userId, 'STREAK_7_DAYS');
    }
    if (maxStreak >= 30) {
      console.log(`[成就检测] 用户${userId} 连续打卡30天`);
      await unlockAchievement(userId, 'STREAK_30_DAYS');
    }

    // 检查早晚盘全勤（同一天有2次打卡）
    const today = new Date().toDateString();
    const todayCheckins = allCheckins.filter(c => new Date(c.time).toDateString() === today);
    if (todayCheckins.length >= 2) {
      console.log(`[成就检测] 用户${userId} 早晚盘全勤`);
      await unlockAchievement(userId, 'FULL_ATTENDANCE');
    }

    // 检查连续未打卡3天后重新打卡
    if (allCheckins.length >= 2) {
      const lastCheckin = new Date(allCheckins[allCheckins.length - 2].time);
      const currentCheckin = new Date(allCheckins[allCheckins.length - 1].time);
      const daysDiff = Math.floor((currentCheckin - lastCheckin) / (24 * 60 * 60 * 1000));
      if (daysDiff >= 3) {
        console.log(`[成就检测] 用户${userId} 连续未打卡3天后重新打卡`);
        await unlockAchievement(userId, 'COMEBACK');
      }
    }

    // 检查积分
    if (user.points >= 500) {
      console.log(`[成就检测] 用户${userId} 达成积分500分`);
      await unlockAchievement(userId, 'POINTS_500');
    }
  } catch (error) {
    console.error('[成就检测] Error checking achievements:', error);
  }
};

// 解锁成就
const unlockAchievement = async (userId, type) => {
  try {
    const config = ACHIEVEMENT_CONFIG[type];
    if (!config) return;
    const result = await Achievement.findOneAndUpdate(
      { userId, type },
      {
        userId,
        type,
        name: config.name,
        desc: config.desc,
        icon: config.icon,
        unlockDate: new Date()
      },
      { upsert: true, new: true }
    );
    if (result) {
      console.log(`[成就写入] 用户${userId} 成就${type} 已写入/已存在`);
    }
  } catch (error) {
    console.error(`[成就写入] Error unlocking achievement for user ${userId}, type ${type}:`, error);
  }
};

// 获取用户成就列表
const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: '用户ID不能为空' });
    }
    const achievements = await Achievement.find({ userId }).sort({ unlockDate: -1 });
    res.json({ success: true, message: '查询成功', data: achievements });
  } catch (error) {
    console.error('Error getting user achievements:', error);
    res.status(500).json({ message: '获取成就列表失败' });
  }
};

module.exports = {
  checkAndUnlockAchievements,
  getUserAchievements
}; 