const store = require('../data/store');

exports.getHistory = (req, res) => {
  const userId = req.headers['x-user-id'] || 'default';
  const userHistory = store.predictions.filter(p => p.userId === userId);
  return res.status(200).json(userHistory);
};
