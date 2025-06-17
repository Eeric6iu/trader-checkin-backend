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
│     └── User.js
│     └── Achievement.js
│     └── MorningCheckin.js
│     └── EveningCheckin.js
│
├── routes/              # 路由
│     └── checkinRoutes.js
│     └── userRoutes.js
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

---

## 开发进度

### ✅ 已完成功能
- [x] 打卡记录的创建和查询（Checkin 数据模型与接口）
- [x] 成长激励数据模型（User: streak、points、achievements 字段，Achievement 模型）
- [x] 用户成长与激励数据的接口开发和测试
- [x] 早盘/交易前打卡（morningCheckin）与收盘/夜间打卡（eveningCheckin）分表存储，支持同一天分别记录

### 🚀 主要接口及用法说明

#### 1. 早盘/交易前打卡（MorningCheckin）
- `POST /api/morning-checkin`
- `GET /api/morning-checkin?userId=xxx` 查询早盘打卡列表
- 字段：
  - userId（必填）
  - date（必填，yyyy-mm-dd）
  - sleepQuality（数组，多选）
  - mentalState（数组，多选）
  - todayGoals（数组，多选+自定义）
  - plannedSymbols（数组，多选+自定义）
  - riskSetup（自定义）
  - unexpectedEvent（有/无/自定义）
  - marketView（看多/看空/观望/不确定/自定义）
  - declaration（自定义）
- 查询返回示例：
  - 查到数据：
    ```json
    {
      "success": true,
      "message": "查询成功",
      "data": [ /* 早盘打卡记录数组 */ ]
    }
    ```
  - 查无数据：
    ```json
    {
      "success": false,
      "message": "暂无打卡记录",
      "data": []
    }
    ```

#### 2. 收盘/夜间打卡（EveningCheckin）
- `POST /api/evening-checkin`
- `GET /api/evening-checkin?userId=xxx` 查询夜间打卡列表
- 字段：
  - userId（必填）
  - date（必填，yyyy-mm-dd）
  - singleTrade（是/否）
  - plannedSymbolOnly（是/否）
  - lotSizeOk（是/否）
  - emotionTrade（有/没有）
  - missedOpportunity（是/否）
  - selfDisciplineOk（是/否）
  - reflection（自定义）
  - selfRating（1-5）
  - reminderTomorrow（自定义/选填）
- 查询返回示例：
  - 查到数据：
    ```json
    {
      "success": true,
      "message": "查询成功",
      "data": [ /* 夜间打卡记录数组 */ ]
    }
    ```
  - 查无数据：
    ```json
    {
      "success": false,
      "message": "暂无打卡记录",
      "data": []
    }
    ```

#### 3. 查询某用户当天所有打卡信息
- `GET /api/checkin-by-date?userId=xxx&date=yyyy-mm-dd`
- 返回示例：
  - 查到数据：
    ```json
    {
      "success": true,
      "message": "查询成功",
      "data": [ /* morningCheckin, eveningCheckin */ ]
    }
    ```
  - 查无数据：
    ```json
    {
      "success": false,
      "message": "暂无打卡记录",
      "data": []
    }
    ```

#### 4. 兼容原有打卡接口
- `POST /api/checkin`、`GET /api/checkin?userId=xxx` 依然可用，历史数据不受影响
- 查询返回示例同上

#### 5. 成长与激励
- `GET /api/growth?userId=xxx` 查询成长激励数据（streak、points、achievements）

### 🕒 正在开发/待开发功能（TODO）
- [ ] 用户注册与登录
- [ ] 更多成就类型与成长激励
- [ ] 管理员后台与数据统计
- [ ] 单元测试与接口文档

---

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
