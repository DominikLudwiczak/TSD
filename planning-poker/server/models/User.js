// server/models/User.js - ZAKTUALIZOWANA WERSJA z opcjonalnymi polami
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: function() {
      // Email jest wymagany tylko jeśli hasło jest podane (pełna rejestracja)
      return !!this.password;
    },
    unique: true,
    sparse: true, // Pozwala na null values przy unique index
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false, // Hasło opcjonalne dla temporary users
    minlength: [6, 'Password must be at least 6 characters long']
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
  isTemporary: {
    type: Boolean,
    default: false // True dla użytkowników created przez planning poker
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferredDeckType: {
    type: String,
    enum: ['fibonacci', 'tshirt', 'custom'],
    default: 'fibonacci'
  },
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
  avatar: {
    type: String,
    default: null
  }
});

// Hash password before saving (tylko jeśli hasło istnieje)
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method (tylko jeśli hasło istnieje)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user is fully registered (has email and password)
userSchema.methods.isFullyRegistered = function() {
  return !!(this.email && this.password && !this.isTemporary);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Custom validation
userSchema.pre('validate', function(next) {
  // Jeśli email jest podany, musi być unikalny
  if (this.email && this.email.includes('@temp.planning-poker.local')) {
    // Pozwól na temporary emails
    return next();
  }
  next();
});

// Indeksy
userSchema.index({ username: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model('User', userSchema);