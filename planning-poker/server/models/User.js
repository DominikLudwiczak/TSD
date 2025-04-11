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
  },
  // Dodanie preferowanego typu talii
  preferredDeckType: {
    type: String,
    enum: ['fibonacci', 'tshirt', 'custom'],
    default: 'fibonacci'
  },
  // Dodanie statystyk użytkownika
  statistics: {
    roomsCreated: {
      type: Number,
      default: 0
    },
    sessionsParticipated: {
      type: Number,
      default: 0
    },
    estimationsGiven: {
      type: Number,
      default: 0
    }
  },
  // Dodanie pola na avatar (opcjonalne)
  avatar: {
    type: String,
    default: null
  }
});

// Indeksy dla efektywniejszego wyszukiwania
userSchema.index({ username: 1 });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model('User', userSchema);