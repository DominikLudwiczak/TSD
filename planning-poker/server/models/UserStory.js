const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  estimatedHours: {
    type: Number,
    min: 0,
    default: null
  },
  actualHours: {
    type: Number,
    min: 0,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

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
  tasks: [taskSchema], // Używamy zdefiniowanego schematu zadań
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  acceptanceCriteria: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware do aktualizacji updatedAt
userStorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Aktualizuj updatedAt dla wszystkich zadań
  if (this.tasks && this.tasks.length > 0) {
    this.tasks.forEach(task => {
      if (task.isModified()) {
        task.updatedAt = new Date();
      }
    });
  }
  
  next();
});

// Metody pomocnicze
userStorySchema.methods.getTaskById = function(taskId) {
  return this.tasks.id(taskId);
};

userStorySchema.methods.addTask = function(taskData) {
  this.tasks.push(taskData);
  return this.tasks[this.tasks.length - 1];
};

userStorySchema.methods.removeTask = function(taskId) {
  return this.tasks.id(taskId).remove();
};

userStorySchema.methods.getTasksByAssignee = function(userId) {
  return this.tasks.filter(task => 
    task.assignedTo && task.assignedTo.toString() === userId.toString()
  );
};

userStorySchema.methods.getTasksByStatus = function(status) {
  return this.tasks.filter(task => task.status === status);
};

// Indeksy
userStorySchema.index({ room: 1 });
userStorySchema.index({ assignedTo: 1 });
userStorySchema.index({ 'tasks.assignedTo': 1 });
userStorySchema.index({ status: 1 });

module.exports = mongoose.model('UserStory', userStorySchema);
