// server/models/UserStory.js
const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo'
  },
  estimation: Number,
  finalEstimation: Number,
  jiraId: String,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstimationSession'
  },
  tasks: [{
    title: String,
    description: String,
    status: {
      type: String,
      enum: ['todo', 'inProgress', 'done'],
      default: 'todo'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserStory', userStorySchema);