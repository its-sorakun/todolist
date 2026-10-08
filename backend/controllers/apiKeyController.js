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
    
    // 2. Hash the key for storage
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    // 3. Save hash to DB
    const apiKey = await ApiKey.create({
      name,
      keyHash,
      user: req.user._id
    });

    // 4. Return raw key exactly once. It will never be visible again.
    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      rawKey: rawKey,
      warning: 'Please copy this key now. You will not be able to see it again.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKeys = async (req, res) => {
  try {
    // Only return the metadata, NOT the hashes
    const keys = await ApiKey.find({ user: req.user._id }).select('-keyHash');
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
