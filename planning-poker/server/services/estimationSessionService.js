// server/services/estimationSessionService.js
const EstimationSession = require('../models/EstimationSession');
const Room = require('../models/Room');
const userService = require('./userService');
const roomService = require('./roomService');

/**
 * Create a new estimation session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Created session
 */
const createSession = async (sessionData) => {
  try {
    // Verify room exists
    const room = await Room.findById(sessionData.room);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // Create new session
    const newSession = new EstimationSession({
      room: sessionData.room,
      taskName: sessionData.taskName || 'Unnamed Task',
      taskDescription: sessionData.taskDescription || '',
      status: 'active'
    });
    
    await newSession.save();
    
    // Update room's lastActivity
    await Room.findByIdAndUpdate(sessionData.room, { lastActivity: new Date() });
    
    return await getSessionById(newSession._id);
  } catch (error) {
    throw new Error(`Error creating estimation session: ${error.message}`);
  }
};

/**
 * Get all sessions for a room
 * @param {String} roomId - Room ID
 * @returns {Promise<Array>} List of sessions
 */
const getSessionsByRoom = async (roomId) => {
  try {
    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    const sessions = await EstimationSession.find({ room: roomId })
      .populate('room')
      .populate('estimations.user', 'username displayName')
      .populate('estimations.card')
      .populate('finalEstimation')
      .sort({ startedAt: -1 });
      
    return sessions;
  } catch (error) {
    throw new Error(`Error fetching sessions: ${error.message}`);
  }
};

/**
 * Get session by ID
 * @param {String} id - Session ID
 * @returns {Promise<Object>} Session object
 */
const getSessionById = async (id) => {
  try {
    const session = await EstimationSession.findById(id)
      .populate('room')
      .populate('estimations.user', 'username displayName')
      .populate('estimations.card')
      .populate('finalEstimation')
      .populate('resetHistory.resetBy', 'username displayName');
      
    if (!session) {
      throw new Error('Session not found');
    }
    
    return session;
  } catch (error) {
    throw new Error(`Error fetching session: ${error.message}`);
  }
};

/**
 * Add estimation to session
 * @param {String} sessionId - Session ID
 * @param {String} userId - User ID
 * @param {String} cardId - Card ID
 * @returns {Promise<Object>} Updated session
 */
const addEstimation = async (sessionId, userId, cardId) => {
  try {
    // Verify session exists and is active
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== 'active') {
      throw new Error('Cannot add estimation to non-active session');
    }
    
    // Verify user exists
    await userService.getUserById(userId);
    
    // Check if user has already estimated
    const existingEstimationIndex = session.estimations.findIndex(
      e => e.user.toString() === userId.toString()
    );
    
    if (existingEstimationIndex !== -1) {
      // Update existing estimation
      session.estimations[existingEstimationIndex].card = cardId;
      session.estimations[existingEstimationIndex].estimatedAt = new Date();
    } else {
      // Add new estimation
      session.estimations.push({
        user: userId,
        card: cardId,
        estimatedAt: new Date()
      });
      
      // Update user statistics
      await userService.updateUserStatistics(userId, { estimationsGiven: 1 });
    }
    
    await session.save();
    
    // Update room's lastActivity
    await Room.findByIdAndUpdate(session.room, { lastActivity: new Date() });
    
    return await getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Error adding estimation: ${error.message}`);
  }
};

/**
 * Reveal estimations in a session
 * @param {String} sessionId - Session ID
 * @returns {Promise<Object>} Updated session
 */
const revealEstimations = async (sessionId) => {
  try {
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== 'active') {
      throw new Error('Session is already revealed or completed');
    }
    
    session.status = 'revealed';
    await session.save();
    
    // Check for consensus
    const cardIds = session.estimations.map(e => e.card.toString());
    const uniqueCardIds = [...new Set(cardIds)];
    
    // If all estimations are the same and there's at least one estimation
    if (uniqueCardIds.length === 1 && session.estimations.length > 0) {
      session.hasConsensus = true;
      await session.save();
    }
    
    // Update room's lastActivity
    await Room.findByIdAndUpdate(session.room, { lastActivity: new Date() });
    
    return await getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Error revealing estimations: ${error.message}`);
  }
};

/**
 * Reset session (back to active state, clear estimations)
 * @param {String} sessionId - Session ID
 * @param {String} userId - User ID of person resetting the session
 * @returns {Promise<Object>} Updated session
 */
const resetSession = async (sessionId, userId) => {
  try {
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Verify user exists
    await userService.getUserById(userId);
    
    // Record reset history
    if (!session.resetHistory) {
      session.resetHistory = [];
    }
    
    session.resetHistory.push({
      resetAt: new Date(),
      resetBy: userId
    });
    
    // Clear estimations and reset status
    session.estimations = [];
    session.status = 'active';
    session.hasConsensus = false;
    
    await session.save();
    
    // Update room's lastActivity
    await Room.findByIdAndUpdate(session.room, { lastActivity: new Date() });
    
    return await getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Error resetting session: ${error.message}`);
  }
};

/**
 * Complete session and set final estimation
 * @param {String} sessionId - Session ID
 * @param {String} cardId - Final card ID
 * @returns {Promise<Object>} Updated session
 */
const completeSession = async (sessionId, cardId) => {
  try {
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status === 'completed') {
      throw new Error('Session is already completed');
    }
    
    session.status = 'completed';
    session.finalEstimation = cardId;
    session.completedAt = new Date();
    
    await session.save();
    
    // Update room's lastActivity
    await Room.findByIdAndUpdate(session.room, { lastActivity: new Date() });
    
    return await getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Error completing session: ${error.message}`);
  }
};

/**
 * Add notes to session
 * @param {String} sessionId - Session ID
 * @param {String} notes - Notes text
 * @returns {Promise<Object>} Updated session
 */
const addSessionNotes = async (sessionId, notes) => {
  try {
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.notes = notes;
    await session.save();
    
    return await getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Error adding session notes: ${error.message}`);
  }
};

/**
 * Delete session
 * @param {String} id - Session ID
 * @returns {Promise<Boolean>} True if deleted
 */
const deleteSession = async (id) => {
  try {
    const session = await EstimationSession.findByIdAndDelete(id);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Error deleting session: ${error.message}`);
  }
};

module.exports = {
  createSession,
  getSessionsByRoom,
  getSessionById,
  addEstimation,
  revealEstimations,
  resetSession,
  completeSession,
  addSessionNotes,
  deleteSession
};