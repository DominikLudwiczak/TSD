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
  }
});

module.exports = mongoose.model('Room', roomSchema);