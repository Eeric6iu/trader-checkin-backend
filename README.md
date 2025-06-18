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
│     └── MTAccount.js
│     └── TradeHistory.js
│     └── TradePlan.js
│     └── TradeCompareReport.js
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

#### 6. 成就系统
- `GET /api/achievements?userId=xxx` 查询用户已解锁的成就列表
- 支持的成就类型：
  - 连续打卡3天、7天、30天
  - 累计打卡10次、100次
  - 首次打卡
  - 早晚盘全勤
  - 连续未打卡3天后重新打卡
  - 达成积分500分
- 返回示例：
  ```json
  {
    "success": true,
    "message": "查询成功",
    "data": [
      {
        "userId": "xxx",
        "type": "STREAK_3_DAYS",
        "name": "初露锋芒",
        "desc": "连续打卡3天，展现你的坚持！",
        "icon": "badge-fire-1",
        "unlockDate": "2024-03-20T10:00:00.000Z"
      }
    ]
  }
  ```

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

## 用户数据模型 User

| 字段         | 类型    | 说明                 |
| ------------| ------- | -------------------- |
| email       | String  | 邮箱，唯一，必填     |
| nickname    | String  | 昵称，必填           |
| password    | String  | 密码，必填           |
| registerDate| Date    | 注册时间，自动生成   |
| avatar      | String  | 头像，选填，默认空   |
| status      | String  | 账号状态，默认 normal，可扩展 blocked 等 |
| lastLogin   | Date    | 最后登录时间，默认空 |

---

## 用户注册/登录与第三方登录 API 文档

### 依赖说明
- 需安装依赖：bcryptjs（用于密码加密）、jsonwebtoken、passport、passport-google-oauth20、passport-facebook、passport-apple、uuid

### 密码安全说明
- 用户注册时，密码会用 bcryptjs 进行 hash 加密后存储到数据库，数据库中不保存明文密码。
- 用户登录时，后端用 bcryptjs.compare 校验密码，不允许明文对比。
- 如数据库中存在明文密码，需统一 hash 后存储或强制用户重置密码。

### 1. 邮箱注册
- **POST /api/register**
- 请求体：
  ```json
  {
    "email": "test@example.com",
    "nickname": "测试用户",
    "password": "123456",
    "avatar": "https://example.com/avatar.png" // 可选
  }
  ```
- 返回：
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "userId": "xxxx-xxxx-xxxx-xxxx",
      "email": "test@example.com",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.png"
    },
    "token": "...jwt..."
  }
  ```

### 2. 邮箱登录
- **POST /api/login**
- 请求体：
  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```
- 返回：
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "userId": "xxxx-xxxx-xxxx-xxxx",
      "email": "test@example.com",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.png"
    },
    "token": "...jwt..."
  }
  ```

### 3. Google 登录
- **GET /api/auth/google**
- 浏览器跳转 OAuth 流程，回调后返回：
  ```json
  {
    "success": true,
    "message": "google 登录成功",
    "data": { "userId": "...", "email": "...", "nickname": "...", "avatar": "..." },
    "token": "...jwt..."
  }
  ```

### 4. Facebook 登录
- **GET /api/auth/facebook**
- 浏览器跳转 OAuth 流程，回调后返回同上。

### 5. Apple 登录
- **GET /api/auth/apple**
- 浏览器跳转 OAuth 流程，回调后返回同上。

### 6. token 校验
- 需要登录的接口加 header：
  `Authorization: Bearer <token>`
- 校验失败返回：
  ```json
  { "success": false, "message": "token无效", "data": null }
  ```

### 7. 用户模型字段
| 字段         | 类型    | 说明                 |
| ------------| ------- | -------------------- |
| userId      | String  | 用户唯一ID，自动生成 |
| email       | String  | 邮箱，唯一，必填     |
| nickname    | String  | 昵称，必填           |
| password    | String  | 密码，加密存储       |
| avatar      | String  | 头像，选填           |
| googleId    | String  | Google第三方ID       |
| facebookId  | String  | Facebook第三方ID     |
| appleId     | String  | Apple第三方ID        |
| registerDate| Date    | 注册时间             |
| status      | String  | 账号状态             |
| lastLogin   | Date    | 最后登录时间         |

---

## 其它说明
- 所有接口返回统一格式：`{ success, message, data, token }`
- 密码加密存储，安全可靠。
- 第三方登录自动注册/登录，返回 JWT。
- 如需更多接口示例或权限校验用法，请联系开发者。

---

## MT4/MT5账号绑定与交易对比分析模块

### 数据模型
- models/MTAccount.js：MT账号绑定（加密investor password）
- models/TradeHistory.js：真实交易历史
- models/TradePlan.js：每日交易计划
- models/TradeCompareReport.js：计划与真实交易对比报告

### 主要接口

#### 1. MT账号绑定与查询
- `POST /api/mtaccount/bind` 绑定MT4/MT5账号（需验证连通性）
- `GET /api/mtaccount/list?userId=xxx` 查询用户所有MT账号

#### 2. 真实交易历史同步与查询
- `POST /api/tradehistory/sync` 同步真实交易历史（MetaApi等）
- `GET /api/tradehistory/list?userId=xxx&date=yyyy-mm-dd` 查询历史

#### 3. 每日交易计划
- `POST /api/tradeplan/create` 新建/更新计划
- `GET /api/tradeplan/get?userId=xxx&date=yyyy-mm-dd` 查询计划

#### 4. 计划与真实交易对比分析
- `POST /api/tradecompare/generate` 生成对比报告（自动/手动）
- `GET /api/tradecompare/get?userId=xxx&date=yyyy-mm-dd` 查询对比报告

### 说明
- investor password 等敏感信息已加密存储。
- 支持多账号绑定、自动/手动同步、计划与真实交易对比。
- 可扩展支持MetaApi、Tradelocker等第三方API。

### 对接MetaApi/Tradelocker等第三方API
- 相关服务代码在 `services/metaApiService.js`
- `verifyMTAccount`：用于验证MT账号连通性（可对接MetaApi等）
- `fetchMT4History`：用于拉取真实交易历史（可对接MetaApi等）
- 当前为mock实现，实际生产请替换为真实API调用
