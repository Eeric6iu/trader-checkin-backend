const TradeHistory = require('../models/TradeHistory');
const { fetchMT4History } = require('../services/metaApiService');

exports.syncHistory = async (req, res) => {
  try {
    const { userId, account, platform } = req.body;
    // 拉取真实交易历史
    const trades = await fetchMT4History({ account, platform });
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