const store = require('../data/store');

exports.getProfile = (req, res) => {
  const userId = req.headers['x-user-id'] || 'default';
  const profile = store.profiles[userId] || null;
  return res.status(200).json(profile);
};

exports.saveProfile = (req, res) => {
  const userId = req.headers['x-user-id'] || 'default';

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Profile data is required' });
  }

  store.profiles[userId] = {
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({ success: true, profile: store.profiles[userId] });
};
