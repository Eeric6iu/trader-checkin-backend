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
const achievementRoutes = require('./routes/achievementRoutes');

app.use('/api', checkinRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/achievements', achievementRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is running!', data: null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
