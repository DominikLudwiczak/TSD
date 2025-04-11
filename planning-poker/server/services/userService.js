// server/services/userService.js
const User = require('../models/User');

/**
 * Get a user by username
 * @param {String} username - Username
 * @returns {Promise<Object>} User object
 */
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

/**
 * Get a user by ID
 * @param {String} id - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Update a user
 * @param {String} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (id, userData) => {
  try {
    // If username is being updated, check if it's already taken
    if (userData.username) {
      const existingUser = await User.findOne({ 
        username: userData.username,
        _id: { $ne: id }
      });
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Update user's last active timestamp
 * @param {String} id - User ID
 * @returns {Promise<Object>} Updated user
 */
const updateUserActivity = async (id) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { lastActive: new Date() },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error updating user activity: ${error.message}`);
  }
};

/**
 * Update user statistics
 * @param {String} id - User ID
 * @param {Object} stats - Statistics to update
 * @returns {Promise<Object>} Updated user
 */
const updateUserStatistics = async (id, stats) => {
  try {
    const updateQuery = {};
    
    if (stats.roomsCreated) {
      updateQuery['statistics.roomsCreated'] = stats.roomsCreated;
    }
    
    if (stats.sessionsParticipated) {
      updateQuery['statistics.sessionsParticipated'] = stats.sessionsParticipated;
    }
    
    if (stats.estimationsGiven) {
      updateQuery['statistics.estimationsGiven'] = stats.estimationsGiven;
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: updateQuery },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error updating user statistics: ${error.message}`);
  }
};

/**
 * Delete a user
 * @param {String} id - User ID
 * @returns {Promise<Boolean>} True if deleted
 */
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  updateUserActivity,
  updateUserStatistics,
  deleteUser
};