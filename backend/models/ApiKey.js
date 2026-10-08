const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  rawKey: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUsedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);
