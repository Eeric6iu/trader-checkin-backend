const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// 路由
const checkinRoutes = require('./routes/checkinRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// const achievementRoutes = require('./routes/achievementRoutes'); // 已废弃
const mtAccountRoutes = require('./routes/mtAccountRoutes');
const tradeHistoryRoutes = require('./routes/tradeHistoryRoutes');
const tradePlanRoutes = require('./routes/tradePlanRoutes');
const tradeCompareRoutes = require('./routes/tradeCompareRoutes');
const communityRoutes = require('./routes/communityRoutes');

app.use('/api/checkin', checkinRoutes);
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/achievements', achievementRoutes); // 已废弃
app.use('/api/mtaccount', mtAccountRoutes);
app.use('/api/tradehistory', tradeHistoryRoutes);
app.use('/api/tradeplan', tradePlanRoutes);
app.use('/api/tradecompare', tradeCompareRoutes);
app.use('/api/community', communityRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is running!', data: null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
