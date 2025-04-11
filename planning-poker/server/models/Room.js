// server/models/Room.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deckType: {
    type: String,
    enum: ['fibonacci', 'tshirt', 'custom'],
    default: 'fibonacci'
  },
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      isActive: {
        type: Boolean,
        default: true
      },
      // Dodanie roli użytkownika w danym pokoju
      role: {
        type: String,
        enum: ['developer', 'observer', 'moderator'],
        default: 'developer'
      }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Dodanie ostatniej aktywności w pokoju
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Dodanie ustawień pokoju
  settings: {
    // Czy pokazywać średnią estymacji
    showAverage: {
      type: Boolean,
      default: true
    },
    // Czy moderator może ujawnić karty
    moderatorCanReveal: {
      type: Boolean,
      default: true
    },
    // Czy obserwatorzy mogą widzieć karty przed ujawnieniem
    observersCanSeeCards: {
      type: Boolean,
      default: false
    }
  }
});

// Indeksy dla efektywniejszego wyszukiwania
roomSchema.index({ isActive: 1, lastActivity: -1 });
roomSchema.index({ creator: 1 });
roomSchema.index({ 'participants.user': 1 });

module.exports = mongoose.model('Room', roomSchema);