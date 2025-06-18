// services/metaApiService.js
// MetaApi/Tradelocker等第三方API对接服务示例
// 实际生产环境请替换为真实API调用

// 验证MT账号连通性（示例：总是返回true）
exports.verifyMTAccount = async ({ account, investorPassword, server, platform }) => {
  // TODO: 调用MetaApi等第三方API验证账号连通性
  // 这里只做mock，实际应返回API验证结果
  if (!account || !investorPassword || !server || !platform) {
    throw new Error('参数不完整');
  }
  // 假设账号格式正确即通过
  return true;
};

// 拉取MT4/MT5真实交易历史（示例：返回mock数据）
exports.fetchMT4History = async ({ account, platform }) => {
  // TODO: 调用MetaApi等第三方API获取历史
  // 这里只做mock，实际应返回API数据
  return [
    {
      orderId: '10001',
      symbol: 'EURUSD',
      lots: 0.1,
      type: 'buy',
      openTime: new Date(),
      closeTime: new Date(),
      profit: 10.5,
      raw: {}
    },
    {
      orderId: '10002',
      symbol: 'USDJPY',
      lots: 0.2,
      type: 'sell',
      openTime: new Date(),
      closeTime: new Date(),
      profit: -5.2,
      raw: {}
    }
  ];
}; 