const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password in queries by default
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  // Only hash if the password was modified (or is new)
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12); // High cost factor
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to verify passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
