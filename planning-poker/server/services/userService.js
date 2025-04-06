const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const updateLastActive = async (userId) => {
  return await User.findByIdAndUpdate(userId, { lastActive: Date.now() }, { new: true });
};

module.exports = {
  createUser,
  findUserByUsername,
  updateLastActive
};
