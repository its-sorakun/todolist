const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'aesthetic',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
