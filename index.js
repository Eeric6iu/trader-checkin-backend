const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // 加载.env环境变量

const app = express();
app.use(express.json());
app.use(cors()); // 允许跨域请求

// 1. 连接 MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// 2. 加载 Checkin 模型
const Checkin = require('./models/Checkin');

// 3. 测试路由
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running!',
    data: null
  });
});

// 4. 创建打卡记录
app.post('/api/checkin', async (req, res) => {
  try {
    const { userId, checkinTime, note } = req.body;

    // 验证必填字段
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '用户ID是必填项',
        data: null
      });
    }

    // 创建打卡记录
    const checkin = new Checkin({
      userId,
      checkinTime: checkinTime || new Date(),
      note
    });

    await checkin.save();

    res.status(201).json({
      success: true,
      message: '打卡记录创建成功',
      data: checkin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '创建打卡记录失败',
      data: null
    });
  }
});

// 5. 查询用户的打卡记录
app.get('/api/checkin', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '请提供用户ID',
        data: null
      });
    }

    const checkins = await Checkin.find({ userId })
      .sort({ checkinTime: -1 }) // 按时间倒序排列
      .select('-__v'); // 排除 __v 字段

    res.json({
      success: true,
      message: '查询成功',
      data: checkins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '查询打卡记录失败',
      data: null
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
