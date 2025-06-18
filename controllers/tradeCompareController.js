const TradePlan = require('../models/TradePlan');
const TradeHistory = require('../models/TradeHistory');
const TradeCompareReport = require('../models/TradeCompareReport');

// 核心对比逻辑
function analyze(plan, trades) {
  const planSymbols = new Set(plan.symbols);
  const actualSymbols = new Set(trades.map(t => t.symbol));
  const outOfPlan = [...actualSymbols].filter(s => !planSymbols.has(s));
  const overLots = trades.reduce((sum, t) => sum + t.lots, 0) > plan.lots;
  return {
    outOfPlanSymbols: outOfPlan,
    overLots,
  };
}

exports.generateReport = async (req, res) => {
  try {
    const { userId, date } = req.body;
    const plan = await TradePlan.findOne({ userId, date: new Date(date) });
    const trades = await TradeHistory.find({ userId, openTime: { $gte: new Date(date), $lte: new Date(date + 'T23:59:59.999Z') } });
    if (!plan) return res.status(404).json({ success: false, message: '无打卡计划' });
    const analysis = analyze(plan, trades);
    const report = await TradeCompareReport.findOneAndUpdate(
      { userId, date: new Date(date) },
      { userId, date: new Date(date), plan, trades, analysis },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getReport = async (req, res) => {
  const { userId, date } = req.query;
  const report = await TradeCompareReport.findOne({ userId, date: new Date(date) });
  res.json({ success: true, data: report });
}; 