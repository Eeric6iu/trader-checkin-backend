const User = require('../models/User');
// const { checkAndUnlockAchievements } = require('./achievementController'); // 已废弃
const MorningCheckin = require('../models/MorningCheckin');
const EveningCheckin = require('../models/EveningCheckin');
const { getValidCheckinDates, calculateStreaks } = require('../services/checkinService');
const { addPointsForCheckin } = require('../services/pointsService');
const { checkAndUnlockBadges } = require('../services/badgeService');

// 连续天数成就配置
const STREAK_ACHIEVEMENTS = [
  { achievementId: 'streak7', name: '连续打卡7天', description: '连续打卡7天', condition: 7, reward: 50 },
  { achievementId: 'streak30', name: '连续打卡30天', description: '连续打卡30天', condition: 30, reward: 200 },
];

// 创建打卡记录
exports.createCheckin = async (req, res) => {
  try {
    const { userId, checkinTime, note } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: '用户ID是必填项', data: null });
    }
    // 保存打卡记录
    const checkin = new Checkin({ userId, checkinTime: checkinTime || new Date(), note });
    await checkin.save();

    // 查找或创建用户
    let user = await User.findOne({ userId });
    const today = new Date();
    today.setHours(0,0,0,0);
    if (!user) {
      user = new User({
        userId,
        email: `${userId}@auto.local`,
        nickname: userId,
        streak: 1,
        points: 1
      });
    } else {
      // 判断是否连续打卡
      const lastCheckin = await Checkin.findOne({ userId }).sort({ checkinTime: -1 });
      let isStreak = false;
      if (lastCheckin) {
        const lastDate = new Date(lastCheckin.checkinTime);
        lastDate.setHours(0,0,0,0);
        const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          user.streak += 1;
          isStreak = true;
        } else if (diff === 0) {
          // 同一天不增加 streak
        } else {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }
      user.points += 1; // 每次打卡+1分
    }
    await user.save();

    // 检查并解锁成就
    await checkAndUnlockAchievements(userId);

    res.status(201).json({ success: true, message: '打卡记录创建成功', data: checkin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '创建打卡记录失败', data: null });
  }
};

// 查询用户的打卡记录
exports.getUserCheckins = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: '请提供用户ID', data: null });
    }
    const checkins = await Checkin.find({ userId }).sort({ checkinTime: -1 }).select('-__v');
    // 如果查不到任何数据，返回 success: false
    if (!checkins || checkins.length === 0) {
      return res.json({ success: false, message: '未查到打卡数据', data: [] });
    }
    // 查到数据时保持原有返回
    res.json({ success: true, message: '查询成功', data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '查询打卡记录失败', data: null });
  }
};

async function handleCheckin(Model, userId, data, checkinType, res) {
  const day = new Date(data.date);
  day.setHours(0, 0, 0, 0);

  const exist = await Model.findOne({ userId, date: day });
  if (exist) {
    return res.status(400).json({ success: false, message: '今天已提交过同类型打卡' });
  }

  const checkinData = { ...data, userId, date: day };
  const checkin = await Model.create(checkinData);

  // 异步处理积分和勋章，不阻塞主流程
  addPointsForCheckin(userId, checkinType, day).catch(console.error);
  checkAndUnlockBadges(userId).catch(console.error);

  res.status(201).json({ success: true, message: '打卡成功', data: checkin });
}

exports.createMorningCheckin = async (req, res) => {
  try {
    await handleCheckin(MorningCheckin, req.body.userId, req.body, 'morning', res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createEveningCheckin = async (req, res) => {
  try {
    await handleCheckin(EveningCheckin, req.body.userId, req.body, 'evening', res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 查询某用户当天所有打卡信息（morning+evening），兼容 date 多种格式，确保时区和格式统一
exports.getUserCheckinByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res.status(400).json({ success: false, message: 'userId 和 date 必填', data: null });
    }
    // 统一将 date 字符串转为当天 0点-23:59:59 范围（本地时区）
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ success: false, message: '日期格式不正确', data: null });
    }
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    // 用范围查找，避免格式/时区差异查不到
    const morning = await MorningCheckin.findOne({ userId, date: { $gte: start, $lte: end } });
    const evening = await EveningCheckin.findOne({ userId, date: { $gte: start, $lte: end } });
    if (!morning && !evening) {
      return res.json({ success: false, message: '未查到打卡数据', data: [] });
    }
    res.json({ success: true, message: '查询成功', data: [morning, evening].filter(Boolean) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 查询早盘打卡列表
exports.getMorningCheckins = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: '请提供用户ID', data: null });
    }
    const list = await MorningCheckin.find({ userId }).sort({ date: -1 });
    if (!list || list.length === 0) {
      return res.json({ success: false, message: '暂无打卡记录', data: [] });
    }
    res.json({ success: true, message: '查询成功', data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 查询夜间打卡列表
exports.getEveningCheckins = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: '请提供用户ID', data: null });
    }
    const list = await EveningCheckin.find({ userId }).sort({ date: -1 });
    if (!list || list.length === 0) {
      return res.json({ success: false, message: '暂无打卡记录', data: [] });
    }
    res.json({ success: true, message: '查询成功', data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.getCheckinStats = async (req, res) => {
  try {
    const { userId, from, to } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    let end = to ? new Date(to) : new Date();
    let start = from ? new Date(from) : new Date(new Date().setDate(end.getDate() - 29));
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const rangeDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    
    const validDates = await getValidCheckinDates(userId, start, end);
    const allTimeValidDates = await getValidCheckinDates(userId, new Date(0), new Date());
    
    const { currentStreak, maxStreak } = calculateStreaks(allTimeValidDates);
    
    const checkedDays = validDates.length;
    const missedDays = rangeDays - checkedDays;

    res.json({
      success: true,
      data: {
        totalDays: rangeDays,
        checkedDays,
        missedDays,
        missedRate: rangeDays > 0 ? (missedDays / rangeDays).toFixed(2) : '0.00',
        currentStreak,
        maxStreak,
        trend: Array.from({ length: rangeDays }, (_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().slice(0, 10);
            return {
                date: dateStr,
                checked: validDates.some(vd => vd.toISOString().slice(0, 10) === dateStr)
            };
        })
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 