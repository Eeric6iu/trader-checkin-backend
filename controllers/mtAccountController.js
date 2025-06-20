const MTAccount = require('../models/MTAccount');
// 假设有MetaApiService用于验证连通性
const { verifyMTAccount } = require('../services/metaApiService');

exports.bindAccount = async (req, res) => {
  try {
    const { userId, account, investorPassword, server, platform } = req.body;
    // 验证连通性
    const verifyResult = await verifyMTAccount({ account, investorPassword, server, platform });
    const verified = typeof verifyResult === 'object' ? !!verifyResult.success : !!verifyResult;
    const mtAccount = await MTAccount.create({ userId, account, investorPassword, server, platform, verified });
    res.json({ success: true, data: mtAccount, verifyResult });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  const { userId } = req.query;
  const accounts = await MTAccount.find({ userId });
  res.json({ success: true, data: accounts });
}; 