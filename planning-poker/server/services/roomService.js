// server/services/roomService.js
const Room = require('../models/Room');
const userService = require('./userService');

/**
 * Get all rooms
 * @param {Boolean} activeOnly - If true, only return active rooms
 * @returns {Promise<Array>} List of rooms
 */
const getAllRooms = async (activeOnly = false) => {
  try {
    let query = {};
    
    if (activeOnly) {
      query.isActive = true;
    }
    
    const rooms = await Room.find(query)
      .populate('creator', 'username displayName')
      .populate('participants.user', 'username displayName')
      .sort({ lastActivity: -1 });
      
    return rooms;
  } catch (error) {
    throw new Error(`Error fetching rooms: ${error.message}`);
  }
};

/**
 * Get a room by ID
 * @param {String} id - Room ID
 * @returns {Promise<Object>} Room object
 */
const getRoomById = async (id) => {
  try {
    const room = await Room.findById(id)
      .populate('creator', 'username displayName')
      .populate('participants.user', 'username displayName');
      
    if (!room) {
      throw new Error('Room not found');
    }
    
    return room;
  } catch (error) {
    throw new Error(`Error fetching room: ${error.message}`);
  }
};

/**
 * Create a new room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>} Created room
 */
const createRoom = async (roomData) => {
  try {
    // Ensure creator exists
    await userService.getUserById(roomData.creator);
    
    // Update room with default settings if not provided
    if (!roomData.settings) {
      roomData.settings = {
        showAverage: true,
        moderatorCanReveal: true,
        observersCanSeeCards: false
      };
    }
    
    // Add creator as first participant
    if (!roomData.participants || roomData.participants.length === 0) {
      roomData.participants = [{
        user: roomData.creator,
        role: 'moderator',
        isActive: true
      }];
    }
    
    const newRoom = new Room(roomData);
    await newRoom.save();
    
    // Update user statistics
    await userService.updateUserStatistics(roomData.creator, { roomsCreated: 1 });
    
    return await getRoomById(newRoom._id);
  } catch (error) {
    throw new Error(`Error creating room: ${error.message}`);
  }
};

/**
 * Update a room
 * @param {String} id - Room ID
 * @param {Object} roomData - Room data to update
 * @returns {Promise<Object>} Updated room
 */
const updateRoom = async (id, roomData) => {
  try {
    // Update lastActivity timestamp
    roomData.lastActivity = new Date();
    
    const room = await Room.findByIdAndUpdate(
      id,
      roomData,
      { new: true, runValidators: true }
    );
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return await getRoomById(room._id);
  } catch (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }
};

/**
 * Add participant to room
 * @param {String} roomId - Room ID
 * @param {Object} participantData - Participant data
 * @returns {Promise<Object>} Updated room
 */
const addParticipant = async (roomId, participantData) => {
  try {
    // Ensure user exists
    await userService.getUserById(participantData.user);
    
    // Check if user is already a participant
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    const existingParticipant = room.participants.find(
      p => p.user.toString() === participantData.user.toString()
    );
    
    if (existingParticipant) {
      // If user is already a participant, update their status
      existingParticipant.isActive = true;
      existingParticipant.joinedAt = new Date();
      if (participantData.role) {
        existingParticipant.role = participantData.role;
      }
    } else {
      // Add new participant
      room.participants.push({
        user: participantData.user,
        role: participantData.role || 'developer',
        isActive: true
      });
      
      // Update user statistics
      await userService.updateUserStatistics(participantData.user, { sessionsParticipated: 1 });
    }
    
    // Update lastActivity timestamp
    room.lastActivity = new Date();
    
    await room.save();
    return await getRoomById(roomId);
  } catch (error) {
    throw new Error(`Error adding participant: ${error.message}`);
  }
};

/**
 * Remove participant from room
 * @param {String} roomId - Room ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Updated room
 */
const removeParticipant = async (roomId, userId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // Find participant index
    const participantIndex = room.participants.findIndex(
      p => p.user.toString() === userId.toString()
    );
    
    if (participantIndex === -1) {
      throw new Error('User is not a participant in this room');
    }
    
    // Mark participant as inactive instead of removing them
    room.participants[participantIndex].isActive = false;
    
    // Update lastActivity timestamp
    room.lastActivity = new Date();
    
    await room.save();
    return await getRoomById(roomId);
  } catch (error) {
    throw new Error(`Error removing participant: ${error.message}`);
  }
};

/**
 * Update room settings
 * @param {String} roomId - Room ID
 * @param {Object} settings - Room settings
 * @returns {Promise<Object>} Updated room
 */
const updateRoomSettings = async (roomId, settings) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // Update settings
    room.settings = {
      ...room.settings,
      ...settings
    };
    
    // Update lastActivity timestamp
    room.lastActivity = new Date();
    
    await room.save();
    return await getRoomById(roomId);
  } catch (error) {
    throw new Error(`Error updating room settings: ${error.message}`);
  }
};

/**
 * Delete a room
 * @param {String} id - Room ID
 * @returns {Promise<Boolean>} True if deleted
 */
const deleteRoom = async (id) => {
  try {
    const room = await Room.findByIdAndDelete(id);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  addParticipant,
  removeParticipant,
  updateRoomSettings,
  deleteRoom
};