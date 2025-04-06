// server/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  displayName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['developer', 'observer', 'moderator'],
    default: 'developer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);