const TradeHistory = require('../models/TradeHistory');
const MTAccount = require('../models/MTAccount');
const { fetchMT4History, verifyMTAccount } = require('../services/metaApiService');

exports.syncHistory = async (req, res) => {
  try {
    const { userId, account } = req.body;
    // 1. 查找MTAccount，获取investorPassword/server/platform
    const mtAccount = await MTAccount.findOne({ userId, account });
    if (!mtAccount) {
      return res.status(400).json({ success: false, message: 'MTAccount not found' });
    }
    // 2. 调用verifyMTAccount获取MetaApi accountId
    const verifyResult = await verifyMTAccount({
      account: mtAccount.account,
      investorPassword: mtAccount.investorPassword,
      server: mtAccount.server,
      platform: mtAccount.platform
    });
    if (!verifyResult.success) {
      return res.status(400).json({ success: false, message: verifyResult.error, raw: verifyResult.raw });
    }
    const accountId = verifyResult.accountId;
    // 3. 拉取真实交易历史
    const result = await fetchMT4History({ accountId });
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error, raw: result.raw });
    }
    const trades = result.orders;
    if (!Array.isArray(trades)) {
      return res.status(400).json({ success: false, message: 'trades is not iterable', raw: trades });
    }
    // 批量 upsert
    for (const t of trades) {
      await TradeHistory.updateOne(
        { userId, orderId: t.orderId },
        { $set: { ...t, userId } },
        { upsert: true }
      );
    }
    res.json({ success: true, count: trades.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const { userId, date } = req.query;
  const query = { userId };
  if (date) {
    const d = new Date(date);
    query.openTime = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
  }
  const trades = await TradeHistory.find(query);
  res.json({ success: true, data: trades });
}; 