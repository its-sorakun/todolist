const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

exports.generateKey = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Please provide a name for this API Key (e.g., Kiko Assistant)' });
    }

    // 1. Generate secure raw key (32 bytes = 64 hex characters)
    const rawKey = 'nw_' + crypto.randomBytes(32).toString('hex');

    // 2. Save raw key to DB directly
    const apiKey = await ApiKey.create({
      name,
      rawKey,
      user: req.user._id
    });

    // 3. Return the key data
    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      rawKey: rawKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKeys = async (req, res) => {
  try {
    // Return all keys including the rawKey so user can view them anytime
    const keys = await ApiKey.find({ user: req.user._id });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.revokeKey = async (req, res) => {
  try {
    const keyId = req.params.id;
    const apiKey = await ApiKey.findOneAndDelete({ _id: keyId, user: req.user._id });
    
    if (!apiKey) {
      return res.status(404).json({ error: 'API Key not found or unauthorized' });
    }
    
    res.json({ message: 'API Key revoked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
