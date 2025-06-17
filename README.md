# Trader Checkin Backend

## 项目简介
本项目是一个基于 Node.js + Express + MongoDB 的打卡后端服务，支持用户打卡记录的增查。

## 技术栈
- Node.js
- Express
- MongoDB (Mongoose)

## 项目结构
```
trader-checkin-backend/
│
├── controllers/         # 控制器，业务逻辑处理
│     └── checkinController.js
│
├── models/              # Mongoose Schema
│     └── Checkin.js
│
├── routes/              # 路由
│     └── checkinRoutes.js
│
├── middlewares/         # 中间件（可选）
│
├── utils/               # 工具函数（可选）
│
├── config/              # 配置文件
│     └── db.js
│
├── .env                 # 环境变量
├── .gitignore           # Git忽略
├── package.json
├── index.js             # 入口文件
└── README.md
```

## 本地运行方法
1. 克隆项目并进入目录
2. 安装依赖：`npm install`
3. 配置 `.env` 文件，内容示例：
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@trader-checkin.rqap00y.mongodb.net/trader?retryWrites=true&w=majority&appName=trader-checkin
   PORT=3000
   ```
4. 启动服务：`node index.js`
5. 使用 Postman 等工具测试接口

## 主要接口
- `POST /api/checkin` 新建打卡记录
- `GET /api/checkin?userId=xxx` 查询用户打卡记录
