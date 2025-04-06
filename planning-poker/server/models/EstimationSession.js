// server/models/EstimationSession.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estimationSessionSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  taskName: {
    type: String,
    trim: true
  },
  taskDescription: {
    type: String,
    trim: true
  },
  estimations: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      card: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
      },
      estimatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'revealed', 'completed'],
    default: 'active'
  },
  finalEstimation: {
    type: Schema.Types.ObjectId,
    ref: 'Card'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('EstimationSession', estimationSessionSchema);