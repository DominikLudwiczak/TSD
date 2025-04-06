const EstimationSession = require('../models/EstimationSession');

const createSession = async (sessionData) => {
  const session = new EstimationSession(sessionData);
  return await session.save();
};

const getSessionById = async (sessionId) => {
  return await EstimationSession.findById(sessionId)
    .populate('room')
    .populate('estimations.user')
    .populate('estimations.card')
    .populate('finalEstimation');
};

const addEstimation = async (sessionId, userId, cardId) => {
  return await EstimationSession.findByIdAndUpdate(
    sessionId,
    {
      $push: {
        estimations: {
          user: userId,
          card: cardId,
          estimatedAt: new Date()
        }
      }
    },
    { new: true }
  );
};

const revealEstimations = async (sessionId) => {
  return await EstimationSession.findByIdAndUpdate(sessionId, { status: 'revealed' }, { new: true });
};

const completeSession = async (sessionId, finalCardId) => {
  return await EstimationSession.findByIdAndUpdate(
    sessionId,
    {
      status: 'completed',
      finalEstimation: finalCardId,
      completedAt: new Date()
    },
    { new: true }
  );
};

module.exports = {
  createSession,
  getSessionById,
  addEstimation,
  revealEstimations,
  completeSession
};
