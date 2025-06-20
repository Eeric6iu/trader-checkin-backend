// services/metaApiService.js
// MetaApi/Tradelocker等第三方API对接服务示例
// 实际生产环境请替换为真实API调用

const axios = require('axios');
require('dotenv').config();

const META_API_BASE = 'https://mt-client-api-v1.new-york.agiliumtrade.ai';
const META_API_TOKEN = process.env.META_API_TOKEN;

if (!META_API_TOKEN) {
  throw new Error('META_API_TOKEN is not set in .env');
}

const api = axios.create({
  baseURL: META_API_BASE,
  headers: {
    Authorization: `Bearer ${META_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// 账号验证：创建账号并检查连接状态
async function verifyMTAccount({ account, investorPassword, server, platform }) {
  try {
    // 1. 创建MetaApi账号
    const createRes = await api.post('/users/current/accounts', {
      login: account,
      password: investorPassword,
      server,
      platform: platform.toLowerCase(), // 'mt4' or 'mt5'
      type: 'cloud',
      name: `user-${account}`,
    });
    const accountId = createRes.data.id;

    // 2. 轮询账号状态，直到已连接或超时
    let status = null;
    for (let i = 0; i < 10; i++) {
      const statusRes = await api.get(`/users/current/accounts/${accountId}`);
      status = statusRes.data.connectionStatus;
      if (status === 'CONNECTED') {
        return { success: true, accountId, statusRes: statusRes.data };
      }
      await new Promise(r => setTimeout(r, 2000)); // 2秒重试
    }
    return { success: false, error: `Account not connected, status: ${status}`, statusRes: status };
  } catch (err) {
    let msg = err.response?.data?.message || err.message || 'Unknown error';
    let raw = err.response?.data || {};
    if (!msg) msg = 'MetaApi returned no error message.';
    return { success: false, error: msg, raw };
  }
}

// 获取历史订单
async function fetchMT4History({ accountId, from, to }) {
  try {
    // 1. 拉取历史订单（MetaApi REST: /users/current/accounts/{accountId}/orders/history）
    const params = {};
    if (from) params.startTime = new Date(from).toISOString();
    if (to) params.endTime = new Date(to).toISOString();
    const res = await api.get(`/users/current/accounts/${accountId}/orders/history`, { params });
    // 2. 兼容mock格式，提取关键信息
    const orders = (res.data || []).map(o => ({
      orderId: o.id,
      symbol: o.symbol,
      lots: o.volume,
      profit: o.profit,
      openTime: o.openTime,
      closeTime: o.closeTime,
      type: o.type,
      comment: o.comment,
    }));
    return { success: true, orders };
  } catch (err) {
    let msg = err.response?.data?.message || err.message;
    return { success: false, error: msg };
  }
}

module.exports = {
  verifyMTAccount,
  fetchMT4History,
}; 