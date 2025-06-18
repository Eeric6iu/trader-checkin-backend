const TradePlan = require('../models/TradePlan');

exports.createPlan = async (req, res) => {
  try {
    const { userId, date, symbols, lots, stopLoss, takeProfit, note } = req.body;
    const plan = await TradePlan.findOneAndUpdate(
      { userId, date: new Date(date) },
      { userId, date: new Date(date), symbols, lots, stopLoss, takeProfit, note },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getPlan = async (req, res) => {
  const { userId, date } = req.query;
  const plan = await TradePlan.findOne({ userId, date: new Date(date) });
  res.json({ success: true, data: plan });
}; 